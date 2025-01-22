import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import OpenMintABI from "./abi/OpenMint.json";

import Header from './components/Header';
import TokenInfo from './components/TokenInfo';
import MintingInterface from './components/MintingInterface';
import Footer from './components/Footer';
import SuccessMessage from './components/SuccessMessage';

const X_USER = 'proteanx';
const X_LINK = `https://twitter.com/proteanx_`;
const GITHUB_LINK = `https://github.com/proteanx`;
const FARCASTER_LINK = `https://warpcast.com/proteus`;
const CONTRACT_ADDRESS = '0x9B4893F07d9e20a26b524853D6eD1DBf9679e147';
const NETWORK_ID = '8453';

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
  const [hasStarted, setHasStarted] = useState();
  const [blocksToGo, setBlocksToGo] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [exploreLink, setExploreLink] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have a wallet connected!");
      return;
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0])
    }
  }

  const findNetwork = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const network = await provider.getNetwork();
    setNetwork(network.chainId.toString());
  }

  const fetchContractInfo = async () => {
    try {
      const { ethereum } = window;
      if (ethereum && currentAccount) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, OpenMintABI, signer);

        let balance = await connectedContract.balanceOf(currentAccount);
        setTokenBalance(balance.toString() / 10 ** 18);

        let contractName = await connectedContract.name();
        setContractName(contractName.toString());

        let currentSupply = await connectedContract.totalSupply();
        setCurrentSupply(currentSupply.toString() / 10 ** 18);

        let mintAmount = await connectedContract.mintAmount();
        setMintAmount(mintAmount.toString() / 10 ** 18);

        let startBlock = await connectedContract.startBlock();
        setStartBlock(startBlock.toString());

        let endBlock = await connectedContract.endBlock();
        setEndBlock(endBlock.toString());

        let maxMints = await connectedContract.maxMints();
        setMaxMints(maxMints.toString());

        let remaining = await connectedContract.mintsRemaining();
        setMintsRemaining(remaining.toString());
        
        let ticker = await connectedContract.symbol();
        setTicker(ticker.toString());

        const blockNumber = await provider.getBlockNumber();
        if (blockNumber >= startBlock) {
          setHasStarted(true);
        } else {
          setHasStarted(false);
          setBlocksToGo(startBlock.toString() - blockNumber.toString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    fetchContractInfo();
    findNetwork();

    const interval = setInterval(() => {
      fetchContractInfo();
      checkIfWalletIsConnected();
      findNetwork();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="App-content">
          <SuccessMessage 
            showConfetti={showConfetti}
            successMessage={successMessage}
            exploreLink={exploreLink}
          />
          
          <Header />

          {network === NETWORK_ID && (
            <TokenInfo
              hasStarted={hasStarted}
              startBlock={startBlock}
              blocksToGo={blocksToGo}
              contractName={contractName}
              mintAmount={mintAmount}
              endBlock={endBlock}
              currentSupply={currentSupply}
              mintsRemaining={mintsRemaining}
              maxMints={maxMints}
              ticker={ticker}
            />
          )}

          <MintingInterface
            currentAccount={currentAccount}
            setCurrentAccount={setCurrentAccount}
            network={network}
            NETWORK_ID={NETWORK_ID}
            CONTRACT_ADDRESS={CONTRACT_ADDRESS}
            tokenBalance={tokenBalance}
            ticker={ticker}
            setSuccessMessage={setSuccessMessage}
            setShowConfetti={setShowConfetti}
            setExploreLink={setExploreLink}
            mintAmount={mintAmount}
          />

          <Footer
            X_USER={X_USER}
            X_LINK={X_LINK}
            GITHUB_LINK={GITHUB_LINK}
            FARCASTER_LINK={FARCASTER_LINK}
          />
        </div>
      </div>
    </div>
  );
};

export default App;