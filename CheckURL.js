const fs = require('fs')
const request = require('request');
const opts = process.argv.slice(2);   //remove the first two arguments 'E:\\Node.js\\node.exe','E:\\DPS909\\releast0.1\\CheckURL.js'
const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,10}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g; //from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const regexp = new RegExp(urlR); //match Url using regular expression
const colors = require('colors');

//if there's no input
if (opts.length == 0) {
    console.log("You didn't enter any argument.");
    console.log("To check current version: --v, --version, /v, /version .");
    console.log("To test URLs: enter filename");
    return process.exit(0);
}

//process with different inputs
if (opts[0].startsWith("--") || opts[0].startsWith("/")) {     //if it's a commnand that start with -- or /
    if (opts[0] == "--v" || opts[0] == "--version" || opts[0] == "/v" || opts[0] == "/version") {
        console.log("Current version: 1.0");
    } else {
        console.log("Invalid input, please enter '--v' for version or filename for testing.");
    }
    return process.exit(0);
} else if (fs.existsSync(opts[0]) == false) {               //check if the file exist
    console.log("filename " + opts[0] + " does not exist.")
} else (

    fs.readFile(opts[0], (err, data) => {                 //read the file
        if (err) {
            console.log(err);
        } else {
            var strData = data.toString();
            var URLs = strData.match(regexp);
            URLs = [...new Set(URLs)];
            URLs.forEach(url => {
                request.get({ uri: url, timeout: 5000 }, function (err, response, body) {
                    if (err) {
                        console.log("Error encountered: " + url)
                    } else if (response.statusCode == 200) {
                        console.log("This page is ok: " + url.green)
                    } else if (response.statusCode == 400 || response.statusCode == 404) {
                        console.log("Can not find this page: " + url.red)
                    } else {
                        console.log("Unkown status: " + url.grey)
                    }
                })
            })
        }
    })

)




