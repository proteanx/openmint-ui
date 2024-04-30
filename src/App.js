import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import OpenMint from "./abi/OpenMint.json";
//import OpenMintInterface from './components/OpenMint';

const TWITTER_HANDLE = 'proteanx';
const TWITTER_LINK = `https://twitter.com/proteanx_`;
const CONTRACT_ADDRESS = '0x0F50Ebb1EB98623147a5d8665f6A39f07cC22955';

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
    } else {
        console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
    } else {
        console.log("No authorized account found")
    }
}

const connectWallet = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    /*
    * Fancy method to request access to account.
    */
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    /*
    * Boom! This should print out public address once we authorize Metamask.
    */
    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]); 
  } catch (error) {
    console.log(error)
  }
}

const askContractToMint = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new JsonRpcProvider();
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, OpenMint.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let mintTxn = await connectedContract.publicMint();

      console.log("Minting...please wait.")
      await mintTxn.wait();
      
      console.log(`Mined, see transaction: https://sepolia.etherscan.io/tx/${mintTxn.hash}`);
      connectedContract.on("NewMintDetected", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`You minted to your wallet.`)
      });

      console.log("Setup event listener!")
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

useEffect(() => {
  checkIfWalletIsConnected();
}, [])

return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">Open Mint Dashboard</p>
        <p className="sub-text">
          Mint your ERC20 Open Mint today
        </p>
        {currentAccount === "" ? (
          <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
          </button>
        ) : (
          <button onClick={askContractToMint} className="cta-button connect-wallet-button">
            Mint Tokens
          </button>
        )}

      </div>
    </div>
  </div>
);
};

export default App;