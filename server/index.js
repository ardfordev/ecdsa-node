const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

/*account 1
private key: 93ffcf4d158aa64f1358ff4c759323cae53ca99fb935ecf30cb37231ce67320a
public key: 04c3579a7613cbbc09c94a4365000e531806f6c64bb2b3c4ea33598abccad7281c1405ca3828e45b92d32001b882d1055bff3f8b78f5200f51e0331445be5cb435
account 2
private key: 04f85c3f0f26cba0f21838905261eaf21b6f7d7b0708c78fe44f4e3071b07863
public key: 042e8f1967ecc9cb162aac84714e04d1385d2f7f8b0e09e464038bd8384a549c2f812ee822acd891eaa76cc3551bb3abf403194f3705f00c5483cad8dc483ea5b0
account 3
private key: 8542e26603076a81b86ea7292aed85d1ee3be44752bb378897517b2dcb694dab
public key: 04eeb97e7f08f501e096e9f0c5de0ebca5d945a5c9cd4d4d0afc7d84ed074fe47bc2a16faa299133652ee3dd59c241574a51ef23f820d4912f17280630150ca3dd
*/

const balances = {
  "04c3579a7613cbbc09c94a4365000e531806f6c64bb2b3c4ea33598abccad7281c1405ca3828e45b92d32001b882d1055bff3f8b78f5200f51e0331445be5cb435": 100,
  "042e8f1967ecc9cb162aac84714e04d1385d2f7f8b0e09e464038bd8384a549c2f812ee822acd891eaa76cc3551bb3abf403194f3705f00c5483cad8dc483ea5b0": 50,
  "04eeb97e7f08f501e096e9f0c5de0ebca5d945a5c9cd4d4d0afc7d84ed074fe47bc2a16faa299133652ee3dd59c241574a51ef23f820d4912f17280630150ca3dd": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { data, messageHash, r, s, recovery } = req.body;
  // TODO : get a signature from the client-side application
  // recover the pubic address from the signature

  const signature = {
    r: BigInt(r),
    s: BigInt(s),
    recovery: recovery,
  };

  const verify = secp.secp256k1.verify(signature, messageHash, data.sender);

  setInitialBalance(data.sender);
  setInitialBalance(data.recipient);

  if (verify) {
    if (balances[data.sender] < data.amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[data.sender] -= data.amount;
      balances[data.recipient] += data.amount;
      res.send({ balance: balances[data.sender] });
    }
  } else {
    res.status(400).send({ message: "Your private key is invalid!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
