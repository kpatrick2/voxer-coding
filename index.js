

const fs = require("fs");
const events = require("events");

const { compareMD5Hash, readAndWriteFile } = require('./customUtils.js');

const inputFile = "./inputFile.txt";
const outputFile = "./outputFile.txt";

/**
 *  1. Read from one file and write into another using streams
 */
 (async () => {
    await readAndWriteFile(inputFile, outputFile);
})();

/**
 *  2. Calculate md5 hash : Compare checksum of input & output files created above
 */

// output
(async () => {
    let test = await compareMD5Hash(inputFile, outputFile);
    if (test) {
        console.log(`${inputFile} hash equals ${outputFile} hash `);
    }
    else {
        console.log(`${inputFile} hash different from ${outputFile} hash `);
    }
})();

/**
*  3. Design Event emitter or streams module to make multiple copies of same file simultaneously
*/

const emitter = new events.EventEmitter();

// custom event to make copies
emitter.on("makeCopyEvent", (copyNumber) => {
    const filenameToCopy = './inputFile.txt';

    for(let i = 1; i <= copyNumber; i++) {
        let newFilename = `./${i}_${filenameToCopy.substring(2)}`;
        fs.copyFile(filenameToCopy, newFilename, (err) => {
            if (err) throw err;
            console.log(`${filenameToCopy} was copied to ${newFilename}`);
        });
    }
})

process.stdin.on("data", data => {
    const input = data.toString().trim();

    if (input === "exit") {
        process.exit();
    }

    // call this event only if input is a number
    if (!isNaN(input) && input > 1) {
        emitter.emit("makeCopyEvent", input);
    }
})

