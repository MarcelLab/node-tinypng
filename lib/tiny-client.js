var https = require('https'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    helpers = require('./helpers'),
    cwd = process.cwd();

var API_URL = 'https://api.tinypng.com/shrink';

function tinyClient(files, options) {
    // certificate hack
    // https://tinypng.com/developers/reference#node-js
    var boundaries = /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----\n/g
    var certs = fs.readFileSync(path.join(cwd, 'certificate', 'cacert.pem')).toString();
    https.globalAgent.options.ca = certs.match(boundaries);

    var requestOptions = url.parse(API_URL);
    requestOptions.auth = 'api:' + options.apiKey;
    requestOptions.method = 'POST';

    var counter = 0;

    files.forEach(function(filePath, index) {
        var inputPath = path.join(cwd, options.folder, filePath);
        var outputPath = inputPath + '.temp';

        var inputStream = fs.createReadStream(inputPath);
        var outputStream = fs.createWriteStream(outputPath);

        var request = https.request(requestOptions, function(response) {
            if (response.statusCode === 201) {
                https.get(response.headers.location, function(response) {
                    response.on('end', function() {
                        // remove
                        fs.unlink(inputPath, function(err) {
                            if (err) { throw err; }

                            fs.renameSync(outputPath, inputPath);
                        });
                    });

                    response.pipe(outputStream);
                });
            } else {
                // do nothing
                console.log('compression failed');
            }

        });

        inputStream.pipe(request);
    });
};



module.exports = tinyClient;