const fs = require('fs');
var path = require('path');
var fse = require("fs-extra");
var filename1 = path.join('recorderWorker.js');
var filename2 = path.join('dist', 'recorderWorker.js');
// console.log(filename1.toString());
// console.log(filename2.toString());

const data = fs.readFileSync(filename1).toString()
fs.appendFileSync(filename2, data, { flag: 'w' });

fse.copySync('src/assets', 'dist/assets', function (err) {
    if (err) return console.error(err)
    console.log('success!')
});

// // destination.txt will be created or overwritten by default.
// fs.copyFile(filename1.toString(), filename2.toString(), (err) => {
//     if (err) throw err;
//     console.log('src\\lib\\recorderWorker.js was copied to dist\\recorderWorker.js');
// });
