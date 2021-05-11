const crypto = require("crypto");
const fs = require("fs");

/**
 *  1. Read from one file and write into another using streams
 */
const readAndWriteFile = (inputFile, outputFile) => new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inputFile, "UTF-8");
    const writeStream = fs.createWriteStream(outputFile, "UTF-8");
    readStream.pipe(writeStream);
    writeStream.on("end", () => { resolve(true); });
    writeStream.on("error", reject);
})

/**
 *  2. Calculate md5 hash input & output files
 */
const getFileHash = filename => new Promise(resolve => {
    const hash = crypto.createHash('md5');
    fs.createReadStream(filename)
        .on('data', data => hash.update(data))
        .on('end', () => resolve(hash.digest('hex')));
});

/**
 *  2. Compare checksum of input & output files
 */
const compareMD5Hash = async (inputFile, outputFile) => {
    const inputHash = await getFileHash(inputFile);
    const outputHash = await getFileHash(outputFile);
    return inputHash === outputHash;
};

exports.compareMD5Hash = compareMD5Hash;
exports.readAndWriteFile = readAndWriteFile;
