var https = require('https'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    helpers = require('./helpers'),
    cwd = process.cwd();

var API_URL = 'https://api.tinypng.com/shrink';

//  @TODO could be refactored
function tinyClient(files, options) {
    // certificate hack
    // https://tinypng.com/developers/reference#node-js
    var boundaries = /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----[\r\n]+/g
    var certificatesPath = path.join(__dirname, '..', 'certificate', 'cacert.pem');
    var certificates = fs.readFileSync(certificatesPath).toString();
    https.globalAgent.options.ca = certificates.match(boundaries);

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
                            console.log('   - compression success : ' + inputPath);
                        });
                    });

                    response.pipe(outputStream);

                }).on('error', function(err) {
                    console.log('get problem : ' + err.message);
                    process.exit(0);
                });
            } else {
                // do nothing
                console.log('   - compression failed : ' + inputPath);
            }

        }).on('error', function(err) {
            console.log('request problem : ' + err.message);
            process.exit(0);
        });

        inputStream.pipe(request);
    });
};



module.exports = tinyClient;