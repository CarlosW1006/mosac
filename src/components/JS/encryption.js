const sha256 = require('js-sha256');

export function generateSHA256Hash(data) {
   return sha256(data);
}