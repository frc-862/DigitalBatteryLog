// import all dependencies + scopes for OAuth2
const readline = require('readline');
const fs = require('fs');
const { google } = require('googleapis');
const { scopes } = require('../../config/constants/googleAPIConstants.json')

//file paths for the token and credentials
const TOKEN_PATH = './config/auth/token.json';
const CREDENTIALS_PATH = './config/auth/credentials.json'

// This function is called in syncData.js when there is not a token.json file. 
// If you ever change the scopes in googleAPIConstants.json, please run getNewToken.js (src/tools.getNewToken.js
async function getNewToken() {
    let credentials;
    //reads credentials file
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
        //returns error if no credentials
        if (err) return console.log('Error loading client secret file:', err)
        credentials = JSON.parse(content);

        //attributes from the credentials file.
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        //creates an OAuth2 url 
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });

        // prompts the user to visit the auth url 
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        //prompts the user to enter the code given to them by google 
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
}

module.exports = getNewToken;