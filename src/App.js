import React, { useEffect, useState } from "react";
import './App.css';
import { Network, ethers } from "ethers";
import OpenMintABI from "./abi/OpenMint.json";
import xLogo from "./assets/logo.svg";
import openMintLogo from "./assets/openmint.png";


const X_USER = 'proteanx';
const X_LINK = `https://twitter.com/proteanx_`;
const CONTRACT_ADDRESS = '0x0F50Ebb1EB98623147a5d8665f6A39f07cC22955';
const NETWORK_ID = '11155111';


const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [mintsRemaining, setMintsRemaining] = useState(0);
  const [network, setNetwork] = useState("");
  const [contractName, setContractName] = useState("");
  const [currentSupply, setCurrentSupply] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [startBlock, setStartBlock] = useState("");
  const [endBlock, setEndBlock] = useState("");
  const [maxMints, setMaxMints] = useState("");
  const [ticker, setTicker] = useState("");



  useEffect(() => {
    checkIfWalletIsConnected();
    fetchContractInfo();

    const interval = setInterval(() => {
      fetchContractInfo();
      checkIfWalletIsConnected();
      findNetwork();
    }, 5000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [currentAccount]) // Re-run the effect if currentAccount changes

  const fetchContractInfo = async () => {
    try {
      const { ethereum } = window;
      if (ethereum && currentAccount) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, OpenMintABI, signer);

        let balance = await connectedContract.balanceOf(currentAccount);
        const balanceTokens = balance.toString() / 10 ** 18;
        console.log("Balance:", balance.toString());
        setTokenBalance(balanceTokens);

        let contractName = await connectedContract.name();
        console.log("Contract Name:", contractName);
        setContractName(contractName.toString());

        let currentSupply = await connectedContract.totalSupply();
        console.log("Current Supply:", currentSupply.toString());
        setCurrentSupply(currentSupply.toString());

        let mintAmount = await connectedContract.mintAmount();
        const mintAmountTokens = mintAmount.toString() / 10 ** 18;
        console.log("Mint Amount:", mintAmountTokens);
        setMintAmount(mintAmountTokens);

        let startBlock = await connectedContract.startBlock();
        console.log("Start Block:", startBlock.toString());
        setStartBlock(startBlock.toString());

        let endBlock = await connectedContract.endBlock();
        console.log("End Block:", endBlock.toString());
        setEndBlock(endBlock.toString());

        let maxMints = await connectedContract.maxMints();
        console.log("Max Mints:", maxMints.toString());
        setMaxMints(maxMints.toString());

        let remaining = await connectedContract.mintsRemaining();
        console.log("Remaining:", remaining.toString());
        setMintsRemaining(remaining.toString());
        
        let ticker = await connectedContract.symbol();
        console.log("Ticker:", ticker.toString());
        setTicker(ticker.toString());
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have a wallet connected!");
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

const findNetwork = async () => {
  const { ethereum } = window;
  const provider = new ethers.BrowserProvider(ethereum);
  const network = await provider.getNetwork();
  console.log("Network:", network);
  const chainId = network.chainId;
  setNetwork(chainId.toString());
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

    alert(`You minted ${mintAmount} tokens to your wallet!`);

    fetchContractInfo();
  } catch (error) {
    console.error("Error in minting process:", error);
    alert("An error occurred during the minting process. Check the console for details.");
  }
}

useEffect(() => {
  checkIfWalletIsConnected();
  findNetwork();
}, [])

return (
  <div className="App">
    <div className="container">
      <div className="App-header">
        <img alt="OpenMint" className="open-logo" src={openMintLogo} />
        <p className="sub-text">
          Welcome to OpenMint
        </p>
        <p className="explain-text">
          This is a proof of concept for open public token minting, similar to how
          BRC20 & Runes work on bitcoin. There is a set mint amount and a maximum amount of 
          mints, as well as a start and end block. Use at your own risk, this is presented without
          warranty.
        </p>
        {currentAccount === "" && (
          <p className="sub-text2">
            Connect wallet using Base Network to mint tokens
          </p>
        )}
        {network === NETWORK_ID && currentAccount !== "" ? (
          <button onClick={askContractToMint} className="cta-button">
          Mint Tokens
        </button>
        ) : (
          <button onClick={connectWallet} className="cta-button">
            Connect to Wallet
          </button>
        )}
        {network === NETWORK_ID && currentAccount !== "" ? (
          <>
            <p className="acc-text">Connected to: {currentAccount}</p>
            <p className="bal-text">Your Token Balance: {tokenBalance} OpenMint <br />
            Public Mints Remaining: {mintsRemaining} mints</p>
          </>
        ) : (
          <p className="acc-text">Please connect to Base Network to view data</p>
        )}
        <p> </p>
        <div className="footer">
          <img alt="X Logo" className="x-logo" src={xLogo} />
          <a
            className="footer-text"
            href={X_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${X_USER}`}</a>
        </div>
      </div>
    </div>
  </div>
);
};

export default App;