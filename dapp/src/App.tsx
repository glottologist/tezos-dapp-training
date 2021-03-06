import { Contract, ContractsService } from '@dipdup/tzkt-api';
import { useState } from 'react';
import './App.css';
import ConnectButton from './ConnectWallet';
import { TezosToolkit, WalletContract } from '@taquito/taquito';
import DisconnectButton from './DisconnectWallet';

function App() {

  const [Tezos, setTezos] = useState<TezosToolkit>(new TezosToolkit("https://hangzhounet.tezos.marigold.dev"));
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const contractsService = new ContractsService( {baseUrl: "https://api.hangzhounet.tzkt.io" , version : "", withCredentials : false});
  const [contracts, setContracts] = useState<Array<Contract>>([]);

  const poke = async (contract : Contract) => {
    let c : WalletContract = await Tezos.wallet.at(""+contract.address);
    try {
      const op = await c.methods.default().send();
      await op.confirmation();
    } catch (error : any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const fetchContracts = () => {
    (async () => {
     setContracts((await contractsService.getSimilar({address:"KT1M1sXXUYdLvow9J4tYcDDrYa6aKn3k1NT9" , includeStorage:true, sort:{desc:"id"}})));
    })();
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>

        <ConnectButton
          Tezos={Tezos}
          setWallet={setWallet}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          wallet={wallet}
        />

        <DisconnectButton
          wallet={wallet}
          setUserAddress={setUserAddress}
          setUserBalance={setUserBalance}
          setWallet={setWallet}
        />

        <div>
        I am {userAddress} with {userBalance} Tz
        </div>

        </p>
        <br />
        <div>
          <button onClick={fetchContracts}>Fetch contracts</button>
        {contracts.map((contract) => <div>{contract.address} <button onClick={() =>poke(contract)}>Poke</button></div>)}
        </div>
      </header>
    </div>
  );
}

export default App;
