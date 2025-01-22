import React from 'react';

const TokenInfo = ({ 
  hasStarted, 
  startBlock, 
  blocksToGo, 
  contractName, 
  mintAmount, 
  endBlock, 
  currentSupply, 
  mintsRemaining, 
  maxMints,
  ticker 
}) => {
  if (!hasStarted) {
    return (
      <div className="startMessage">
        <p className="start-text">
          Minting has not yet started. Start block: {startBlock} <br /> 
          Blocks until mint: {blocksToGo}
        </p>
      </div>
    );
  }

  return (
    <div className="tokenInfo">
      <p className="token-text"> TOKEN NAME <br /> {contractName} </p>
      <p className="token-text"> MINT AMOUNT <br /> {mintAmount} {ticker}</p>
      <p className="token-text"> END BLOCK <br /> {endBlock} </p>
      <p className="token-text"> CURRENT SUPPLY <br /> {currentSupply} {ticker} </p>
      <p className="token-text"> MINTS LEFT <br /> {mintsRemaining}/{maxMints} </p>
    </div>
  );
};

export default TokenInfo; 