var fs = require('fs');
var path = require('path');

module.exports = function(extractPath, electronVersion, platform, arch, done) {

    // 'src/assets/data/test.db'
    let source = path.join(__dirname, '../assets/data/test.db');
    let destination = path.join(extractPath, 'test.db');

    copyDatabase(source,destination);

    // copy database to root folder
    function copyDatabase(source, destination) {
        fs.copyFile(source, destination, function (err) { 
            if (err){ 
                console.log('An error occured while copying the database.') 
                return console.error(err) 
            } 
            console.log('Database successfully copied!') 
        });
    }

    done();
 }