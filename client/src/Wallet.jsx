import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);

    if (address) {
      try {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address"
          value={address}
          onChange={onChange}
        />
      </label>

      <label>
        <div className="balance">Balance: {balance}</div>
      </label>
    </div>
  );
}

export default Wallet;
