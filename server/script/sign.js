const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey =
  "3decd59abef63d4b7fcb8866b94b55f0469c0c88bea4756be94df61bd7a5bfc7";
const publicKey =
  "04902ff0ceaca914159c58c745d86ebef88b570a8e38a8e865fe7e4ecab16c56de53efc421f79a6720662340d7cc98d1704135c57ed9548a9438463b7e723a2bb1";
const message = "hello world!";

const messageHash = keccak256(utf8ToBytes(message));

const signature = secp.secp256k1.sign(messageHash, privateKey);

const verify = secp.secp256k1.verify(signature, messageHash, publicKey);

console.log(signature);
console.log(verify);
