/**
 *  1. Read from one file and write into another using streams
 */

const fs = require("fs");
const crypto = require("crypto");
const events = require("events");

const inputFile = "./inputFile.txt";
const outputFile = "./outputFile.txt";

const readStream = fs.createReadStream(inputFile, "UTF-8");
const writeStream = fs.createWriteStream(outputFile, "UTF-8");

readStream.pipe(writeStream);

/**
 *  2. Calculate md5 hash : Compare checksum of input & output files created above
 */

const getFileHash = filename => new Promise(resolve => {
    const hash = crypto.createHash('md5');
    fs.createReadStream(filename)
        .on('data', data => hash.update(data))
        .on('end', () => resolve(hash.digest('hex')));
});

const compareMD5Hash = async (inputFile, outputFile) => {
    const inputHash = await getFileHash(inputFile);
    const outputHash = await getFileHash(outputFile);
    return inputHash === outputHash;
};

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

