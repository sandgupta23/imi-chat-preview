const fs = require('fs');
var path = require('path');
var filename1 = path.basename('\\src\\lib\\recorderWorker.js');
var filename2 = path.basename('\\dist\\recorderWorker.js');
// destination.txt will be created or overwritten by default.
fs.copyFile(filename1, filename2, (err) => {
    if (err) throw err;
    console.log('src\\lib\\recorderWorker.js was copied to dist\\recorderWorker.js');
});
