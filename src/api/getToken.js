const readline = require('readline');
const fs = require('fs');
const { google } = require('googleapis');
const { scopes } = require('../../config/constants/googleAPIConstants.json')

const TOKEN_PATH = './config/auth/token.json';
const CREDENTIALS_PATH = './config/auth/credentials.json'

async function getNewToken() {
    let credentials;
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err)
        credentials = JSON.parse(content);

        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
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
            });
        });
    });
    // Authorize a client with credentials
}

module.exports = getNewToken;