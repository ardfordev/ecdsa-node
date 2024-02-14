import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const data = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient: recipient,
    };

    const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(data))));
    const signature = secp.secp256k1.sign(messageHash, privateKey);
    const r = signature["r"].toString();
    const s = signature["s"].toString();
    const recovery = signature["recovery"];

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        data,
        messageHash,
        r,
        s,
        recovery,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          value={privateKey}
          onChange={setValue(setPrivateKey)}
          placeholder="Type an address"
          type="password"
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
