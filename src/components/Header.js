import React from 'react';
import openMintLogo from "../assets/openmint.png";

const Header = () => {
  return (
    <>
      <img alt="OpenMint" className="open-logo" src={openMintLogo} />
      <p className="sub-text">
        Welcome to OpenMint
      </p>
      <p className="explain-text">
        This is a proof of concept for open public token minting, similar to how
        BRC20 & Runes work on bitcoin. There is a set amount per mint and a maximum amount of 
        mints, as well as a start and end block. Use at your own risk, this interface and underlying 
        contracts are open source and presented without warranty.
      </p>
    </>
  );
};

export default Header; 