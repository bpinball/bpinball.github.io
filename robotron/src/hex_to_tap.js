const fs = require('fs');

const checksum = (data) => data.reduce((acc, value) => acc ^ value, 0);
const toBytes = (str) => {
    const buffer = Buffer.from(str, 'utf8');
    const result = [];
    for (let i = 0; i < buffer.length; i++) {
        result.push(buffer[i]);
    }
    return result;
};

const lines = fs.readFileSync('robotron', 'utf8').split("\n");
let result = new Array();
let startAddress = 0xffff;
lines.forEach((line) => {
    hexData = line.replace(/.*:/, "");
    if (hexData.length > 8) {
        len = parseInt(hexData.substring(0, 2), 16);
        address = parseInt(hexData.substring(2, 6), 16);
        recType = parseInt(hexData.substring(6, 8), 16);

        if (recType == 0) {
            startAddress = Math.min(startAddress, address);
            const data = hexData.substring(8, 8 + len * 2);
            for (let i = 0; i < len; i++) {
                result[address + i] = parseInt(data.substring(i * 2, i * 2 + 2), 16);
            }
        }
    }
});

result = result.slice(startAddress);
let header = [0, 3];
header = header.concat(toBytes("Robotr2023"));
header = header.concat([result.length & 0xff, result.length >> 8, startAddress & 0xff, startAddress >> 8, 0, 0x80]);
header.push(checksum(header));
header = [header.length & 0xff, header.length >> 8].concat(header);

let data = [0xff];
data = data.concat(result);
data.push(checksum(data));
data = [data.length & 0xff, data.length >> 8].concat(data);

let output = header.concat(data);
let buffer = Buffer.from(output);
fs.writeFileSync("binary.tap", buffer);