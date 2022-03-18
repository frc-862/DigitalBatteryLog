const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const batteryDataModel = require('./schemas/batterySchema.js')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './auth/token.json';
const CREDENTIALS_PATH = './auth/credentials.json'
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1SX7XJvakIZy1HRAKwPCJXn5hu9fjtQ1SoHH57GadeV0/edit#gid=0'

async function checkDb() {
    const res = await batteryDataModel.find({ updated: false })
    let finalVals = [];
    let finalDocs = [];
    let finalRows = [];
    for (let updated in res) {
        console.log(res[updated])
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
            values[8] = `${res[updated].purpose}`;
        }
        finalVals.push(values);
    }
    update(finalVals, finalDocs, finalRows);
}
module.exports = checkDb;
async function update(values, document, row) {
    // Load client secrets from a local file.
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), writeData, values, document, row);
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
        if (err) return getNewToken(oAuth2Client, callback, values, document, row);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, values, document, row);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback, values, document, row) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client, values, document, row);
        });
    });
}

/**
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function writeData(auth, values, document, row) {
    const spreadsheetId = SHEET_URL.slice(39, 83)
    const sheets = google.sheets({ version: 'v4', auth });
    for (let vals in values) {
        const res = await sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId, range: 'A2:I' })
        let nextOpenRow;
        if (res.data.values == undefined) {
            nextOpenRow = 2;
        } else {
            nextOpenRow = res.data.values.length + 2
        }
        let range;
        if (row[vals] == null) {
            range = `Sheet1!A${nextOpenRow}:I`
            document[vals].row = nextOpenRow;
        } else {
            range = `Sheet1!A${row}:I`
        }
        const resource = {
            "majorDimension": 'ROWS',
            "values": [values[vals]],
        };
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

