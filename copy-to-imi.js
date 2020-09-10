const fs = require('fs');

// destination.txt will be created or overwritten by default.
fs.copyFile('dist/main.js', 'C:\\Users\\k\\Desktop\\nodebook\\bot_platform-fe\\src\\assets\\main.js', (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
});

fs.copyFile('dist/styles.css', 'C:\\Users\\k\\Desktop\\nodebook\\bot_platform-fe\\src\\assets\\styles.css', (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
});
