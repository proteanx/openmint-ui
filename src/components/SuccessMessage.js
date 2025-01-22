import React from 'react';
import Confetti from 'react-confetti';

const SuccessMessage = ({ showConfetti, successMessage, exploreLink }) => {
  if (!showConfetti && !successMessage) return null;

  return (
    <>
      {showConfetti && <Confetti />}
      {successMessage && (
        <div className="success-message">
          {successMessage} <br />
          <a href={exploreLink} target="_blank" rel="noreferrer">
            Check on Explorer
          </a>
        </div>
      )}
    </>
  );
};

export default SuccessMessage; 