const fs = require('fs');

// destination.txt will be created or overwritten by default.
fs.copyFile('src/sw.js', 'dist/sw.js', (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
})