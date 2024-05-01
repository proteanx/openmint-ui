import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import OpenMintABI from "./abi/OpenMint.json";

//const ethers = require("ethers")

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

    if (!ethereum) {
      console.log("Ethereum object not found");
      alert("Please install MetaMask to interact with this app.");
      return;
    }

    console.log("Ethereum object found:", ethereum);

    //const web3url = "https://rpc-sepolia.rockx.com";
    //const network = "0xaa36a7";
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.getNetwork().then(network => console.log('Network:', network));

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log("Accounts:", accounts);
    const signer = await provider.getSigner(accounts[0]);
    console.log("Signer:", signer);

    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, OpenMintABI, signer);

    console.log("Contract connected:", connectedContract);

    //console.log("Going to pop wallet now to pay gas...");
    let mintTxn = await connectedContract.publicMint();

    console.log("Minting...please wait.");
    await mintTxn.wait();

    console.log(`Mined, see transaction: https://sepolia.etherscan.io/tx/${mintTxn.hash}`);

    alert(`You minted to your wallet!`);

    console.log("Setup event listener!");
  } catch (error) {
    console.error("Error in minting process:", error);
    alert("An error occurred during the minting process. Check the console for details.");
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