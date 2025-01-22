import React from 'react';
import { ethers } from "ethers";
import OpenMintABI from "../abi/OpenMint.json";

const MintingInterface = ({
  currentAccount,
  setCurrentAccount,
  network,
  NETWORK_ID,
  CONTRACT_ADDRESS,
  tokenBalance,
  ticker,
  setSuccessMessage,
  setShowConfetti,
  setExploreLink,
  mintAmount
}) => {
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert("Please install an EVM wallet to interact with this app.");
        return;
      }
  
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
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
        alert("Please install an EVM wallet to interact with this app.");
        return;
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const signer = await provider.getSigner(accounts[0]);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, OpenMintABI, signer);
  
      let mintTxn = await connectedContract.publicMint();
      await mintTxn.wait();
  
      setSuccessMessage(`You minted ${mintAmount} tokens to your wallet! 🎉🎉`);
      setShowConfetti(true);
      setExploreLink(`https://basescan.org/tx/${mintTxn.hash}`);
     
      setTimeout(() => {
        setShowConfetti(false);
        setSuccessMessage("");
        setExploreLink("");
      }, 5069);
  
    } catch (error) {
      console.error("Error in minting process:", error);
      alert(`An error occurred during the minting process. ${error}`);
    }
  }

  return (
    <div>
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
          <p className="bal-text">Your Token Balance: {tokenBalance} {ticker}</p>
        </>
      ) : (
        <p className="acc-text">Please connect to Base Network to view data</p>
      )}
    </div>
  );
};

export default MintingInterface; 