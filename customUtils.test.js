fs = require('fs');
const customUtils = require('./customUtils');

describe('compareMD5Hash function', () => {
    const test_inputFile = "./test_inputFile.txt";
    const test_outputFile = "./test_outputFile.txt";
    beforeAll( () => {
        fs.writeFileSync(test_inputFile, 'Hello World!');
        fs.writeFileSync(test_outputFile, 'Hello World!');
    } );

    afterAll( () => {
        fs.unlink(test_inputFile, (err) => {
            if (err) {
              console.error(err)
            }
        });

        fs.unlink(test_outputFile, (err) => {
            if (err) {
              console.error(err)
            }
        })
    });

    test('checksum of 2 identical files', async () => {
        await expect(customUtils.compareMD5Hash(test_inputFile, test_outputFile)).resolves.toBe(true);
    });

    test('checksum of 2 different files', async () => {
        fs.writeFileSync(test_outputFile, 'Hello!'); // different content
        await expect(customUtils.compareMD5Hash(test_inputFile, test_outputFile)).resolves.toBe(false);
    });
});