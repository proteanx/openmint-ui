import React, { useState } from 'react';
import { JsonRpcProvider } from '@ethersproject/providers';
import * as ethers from 'ethers';

const contractABI = require('../abi/OpenMint.json'); 
const contractAddress = '0x2Ec60E666577a9d48f4F641c3e7F5f76Bc388B8F';

function OpenMintInterface() {
    const [minting, setMinting] = useState(false);
    const [message, setMessage] = useState('');

    async function handleMint() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const openMintContract = new ethers.Contract(contractAddress, contractABI.abi, signer);

                setMinting(true);
                const tx = await openMintContract.publicMint();
                await tx.wait();
                setMessage('Minting successful!');
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            } finally {
                setMinting(false);
            }
        } else {
            setMessage('Please install MetaMask!');
        }
    }

    return (
        <div>
            <h1>OpenMint Interface</h1>
            <button onClick={handleMint} disabled={minting}>
                {minting ? 'Minting...' : 'Mint Tokens'}
            </button>
            <p>{message}</p>
        </div>
    );
}

export default OpenMintInterface;
