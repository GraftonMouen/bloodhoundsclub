import React, { useState } from 'react';
import BloodhoundSketch from './assets/bloodhound-sketch.png';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    // placeholder for wallet connection logic
    // you can integrate MetaMask or Web3Modal here
    // For now, we'll just toggle for testing
    setWalletConnected(true);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark">
      {/* Bloodhound Sketch Logo */}
      <img
        src={BloodhoundSketch}
        alt="Bloodhound NFT Logo"
        className="w-64 h-auto mb-8"
      />

      {/* Title */}
      <h1 className="glitch text-6xl mb-8" data-text="BLOODHOUND NFT">
        BLOODHOUND CLUB
      </h1>

      {/* Connect Wallet Button */}
      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="text-green-400 text-xl">Wallet Connected! NFT Verified ✅</p>
      )}
    </div>
  );
}

export default App;
