import fs from 'fs';
import batteryDataModel from '../schemas/batterySchema.js';
import { google } from 'googleapis';
import cron from 'node-cron';
import { OAuth2Client } from 'google-auth-library';
const TOKEN_PATH = './config/auth/token.json';
const CREDENTIALS_PATH = './config/auth/credentials.json';
import fetch from 'node-fetch';

export default class SheetsApi {
    constructor() {
        this.runSync()
    }
    //primary function for checking db updates 
    private async checkDb(): Promise<void> {
        //searches db for unsynced data
        const res = await batteryDataModel.find({ updated: false })
        //final array of values sent to write function
        let finalVals = [];
        let finalDocs = [];
        let finalRows = [];
        for (let updated in res) {
            //formats all data from the doc being updated for the sheets API. 
            let values = [];
            finalDocs.push(res[updated]);
            if (res[updated].row == undefined) {
                finalRows.push(null);
            } else if (res[updated].row != undefined) {
                finalRows.push(res[updated].row);
            }
            values[0] = `${res[updated].batteryNumber}`;
            values[1] = `${res[updated].timeOut}`;
            if (res[updated].beakBefore.rint == undefined) {
                values[2] = null;
            } else {
                values[2] = `${res[updated].beakBefore.rint}`;
            }
            if (res[updated].beakBefore.soc == undefined) {
                values[3] = null;
            } else {
                values[3] = `${res[updated].beakBefore.soc}`;
            }
            if (res[updated].timeIn == undefined) {
                values[4] = null;
            } else {
                values[4] = `${res[updated].timeIn}`;
            }

            if (res[updated].beakAfter.rint == undefined) {
                values[5] = null;
            } else {
                values[5] = `${res[updated].beakAfter.rint}`;
            }

            if (res[updated].beakAfter.soc == undefined) {
                values[6] = null;
            } else {
                values[6] = `${res[updated].beakAfter.soc}`;
            }

            if (res[updated].purpose == undefined) {
                values[7] = null;
            } else {
                values[7] = `${res[updated].purpose}`;
            }
            if (res[updated].subgroup == undefined) {
                values[8] = null;
            } else {
                values[8] = `${res[updated].subgroup}`;
            }
            finalVals.push(values);
        }
        try {
            this.update(finalVals, finalDocs, finalRows);
        } catch (err) {
            if (err) console.log(err)
        }
    }
    private async update(values: any[], document: any[], row: any[]) {
        // Load client secrets from a local file.
        fs.readFile(CREDENTIALS_PATH, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            try {
                this.authorize(JSON.parse(content.toString()), this.writeData, values, document, row);
            } catch (err) {
                if (err) console.log(err)
            }
        });
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    private async authorize(credentials: { installed: { client_secret: any; client_id: any; redirect_uris: any; }; }, callback: { (auth: any, values: any, document: any, row: any): Promise<void>; (arg0: OAuth2Client, arg1: any, arg2: any, arg3: any): void; }, values: any[], document: any[], row: any[]) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                //if there is no token.json file, return an error and kill the program
                console.error('Cannot find token, please run getNewToken.js');
                return process.kill(process.pid);
            } else {
                oAuth2Client.setCredentials(JSON.parse(token.toString()));
                try {
                    callback(oAuth2Client, values, document, row);
                } catch (err) {
                    if (err) console.log(err)
                }
            }
        });
    }
    /**
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
    private async writeData(auth: any, values: { [x: string]: any; }, document: {
        [x: string]: {
            updated: boolean;
            row: any; save: () => void;
        };
    }, row: { [x: string]: any; }) {
        //obtains the spreadsheet ID from the URL
        const spreadsheetId = process.env.sheetURL.slice(39, 83)
        //sheets object
        const sheets: any = google.sheets({ version: 'v4', auth });
        for (let vals in values) {
            //reads spreadsheet
            const res: any = await sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId, range: 'A2:I' }).catch((err) => console.error('fatal error occurred', err))
            //determines the next blank row
            let nextOpenRow;
            if (res.data.values == undefined) {
                nextOpenRow = 2;
            } else {
                nextOpenRow = res.data.values.length + 2
            }
            // if a row is defined already in the document, update that row, 
            //otherwise use the next open row and add its number to the document.
            let range;
            if (row[vals] == null) {
                range = `Sheet1!A${nextOpenRow}:I`
                document[vals].row = nextOpenRow;
            } else {
                range = `Sheet1!A${row[vals]}:I`
            }
            const resource = {
                "majorDimension": 'ROWS',
                "values": [values[vals]],
            };
            //updates sheet with all the new values 
            await sheets.spreadsheets.values.update({
                spreadsheetId: spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                resource,
            }).then((result) => {
                console.log('%d cells updated.', result.updatedCells);
                document[vals].updated = true;
                document[vals].save();
            }).catch((err) => console.log(err));
            console.log('doc #', vals)
        }
    }
    //function run by index.js for syncing database with google sheets
    private async runSync() {
        //checking syncIntervalMinutes in constants.json and insures its an integer
        if (!(Number.isInteger(parseInt(process.env.syncInterval)))) return console.error('ERROR! syncInterval is not an integer');

        //node-cron schedule for running sync at interval of your choice
        cron.schedule(`*/${process.env.syncInterval} * * * *`, () => {
            //check if there is an internet connection. 
            this.checkInternet(function (isConnected) {
                if (isConnected) {
                    console.log('Internet connection good; scanning for updates');
                    try {
                        this.checkDb();
                    } catch (err) {
                        if (err) console.log(err);
                    }
                } else {
                    return;
                }
            }).catch((err) => console.log(err));

        })
    }
    //function that attempts to perform a DNS lookup on google.com. Determines if there is an internet connection. 
    private async checkInternet(cb) {
        try { 
            const res = await fetch('https://google.com');
            return res.status != 200 ? false : true; 
        } catch (err) {
            return false;
        }
    }
}