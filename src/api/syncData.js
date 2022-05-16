const fs = require('fs');
const batteryDataModel = require('../schemas/batterySchema.js');
const TOKEN_PATH = './config/auth/token.json';
const CREDENTIALS_PATH = './config/auth/credentials.json'
const { google } = require('googleapis');

//primary function for checking db updates 
async function checkDb() {
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
        update(finalVals, finalDocs, finalRows);
    } catch (err) {
        if (err) console.log(err)
    }
}
module.exports = checkDb;
async function update(values, document, row) {
    // Load client secrets from a local file.
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        try {
            authorize(JSON.parse(content), writeData, values, document, row);
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
async function authorize(credentials, callback, values, document, row) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            //if there is no token.json file, return an error and kill the program
            console.error('Cannot find token, please run getNewToken.js');
            return process.kill();
        } else {
            oAuth2Client.setCredentials(JSON.parse(token));
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
async function writeData(auth, values, document, row) {
    //obtains the spreadsheet ID from the URL
    const spreadsheetId = process.env.sheetURL.slice(39, 83)
    //sheets object
    const sheets = google.sheets({ version: 'v4', auth });
    for (let vals in values) {
        //reads spreadsheet
        const res = await sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId, range: 'A2:I' }).catch((err) => console.error('fatal error occurred', err))
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

