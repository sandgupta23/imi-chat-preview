const fs = require('fs');

// destination.txt will be created or overwritten by default.
fs.copyFile('dist/main.js', 'D:\\nodebook\\DEVELOP\\imi\\src\\assets\\main.js', (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
});

fs.copyFile('dist/styles.css', 'D:\\nodebook\\DEVELOP\\imi\\src\\assets\\styles.css', (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
});
