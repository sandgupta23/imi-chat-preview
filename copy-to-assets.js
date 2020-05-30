const fs = require('fs');

// destination.txt will be created or overwritten by default.
fs.copyFile('\\src\\lib\\recorderWorker.js', '\\dist\\recorderWorker.js', (err) => {
    if (err) throw err;
    console.log('src\\lib\\recorderWorker.js was copied to dist\\recorderWorker.js');
});
