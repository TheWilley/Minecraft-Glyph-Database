const fs = require("fs");

function checkPath(path) {
    if (fs.existsSync(path)) {
        return true
    } else {
        return false
    }
}

function get2dArrayDimensions(arr) {
    return [
        arr.length,
        arr.reduce((x, y) => Math.max(x, y.length), 0)
    ];
}

module.exports = { checkPath, get2dArrayDimensions }