// STUB External modules
// tell our app to require the modules we've installed
const express = require("express");
const request = require("request");
const fs = require("fs");
const readline = require("readline");
const {google} = require("googleapis");

// STUB Instanced modules
// we create a new express instance
app = express();

// STUB Configuration
// set our templating engine to EJS
app.set("view engine", "ejs");

// STUB middleware
// tell express to serve static files from the  "Public" directory 
app.use(express.static("public"));

// STUB Routes

// view routes
app.get("/", function(req, res) {
    // load client from a local file
    fs.readFile("credentials.json", (err, content) => {
        if(err)
            return console.log("Error loading client secret file:", + err);

    // authorize a client with credentials, then call the Google Sheets API
    authorize(JSON.parse(content), pullData);
    });

    /** ANCHOR creates OAuth2 param
     * Prints the data from pixel progress sample g-sheet
     * @see https://docs.google.com/spreadsheets/d/12EAr1BB8-DVW8W-lDKrFOgtqgzX_U5WKQ8VxeqfW_i0/edit#gid=0
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client
     */

    function pullData(auth) {
        const sheets = google.sheets({version: "v4", auth});
        /** ANCHOR batchGet
         * Google Sheets API method called batchGet "allows us to return one or more ranges of values from a spreadsheet"
         * '2019' refers to the sheet tab name in the file
         */

        sheets.spreadsheets.values.batchGet({
            spreadsheetId: "12EAr1BB8-DVW8W-lDKrFOgtqgzX_U5WKQ8VxeqfW_i0",
            ranges: ["A2:A373", "B2:B373", "C2:C373", "D2:D373"],
        }, (err, response) => {
            if(err) 
                return console.log("The API returned an error:", + err);

            //this creates four variables to store our data and then puts them in a data array which will make manipulating them easier
            const date = response.data.valueRanges[0].values;
            const topic = response.data.valueRanges[1].values;
            const time = response.data.valueRanges[2].values;
            const level = response.data.valueRanges[3].values;
            const data = [date, topic, time, level];
            
            if(data.length) {
                console.log("Data:");

                // print columns A to C, which correspond to indices 0 to 2
                data.map((row) => {
                    // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                    res.render("home", {data: data});
                });

            } else {
                console.log("No data found.");
            }
        });
    }
});


// STUB Scopes
// if modifying these scopes, delete token.json

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// the file token.json stores the user's access and refresh tokens, and is created automatically when authorization flow completes for the first time

const TOKEN_PATH = "token.json";

/** STUB create instance of OAuth2 client
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client
 */

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // check if we have previously stored a token
    fs.readFile(TOKEN_PATH, (err, token) => {
        if(err)
            return getNewToken(oAuth2Client, callback);
        
            oAuth2Client.setCredentials(JSON.parse(token));

            callback(oAuth2Client);
    });
}

/** STUB get and store new token
 * Get and store new token after prompting for user authorization, and then execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client
 */

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });

    console.log("Authorize this app by visiting this url:", authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", (code) => {
        rl.close();

        oAuth2Client.getToken(code, (err, token) => {
            if(err)
                return console.error("Error while trying to retrieve access token:", + err);

            oAuth2Client.setCredentials(token);

            // ANCHOR store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    return console.error(err);
                    console.log("Token stored to:", TOKEN_PATH);
            });

            callback(oAuth2Client);
        });
    });
}


// Server Listener
// process.env.PORT will let our environment (ex: Heroku) set the variable for us later
app.listen(process.env.PORT || 3000, function() {
    console.log("Server running on port 3000")
})
