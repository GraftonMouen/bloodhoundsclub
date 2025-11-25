import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnectButton({ onConnect }) {
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
        onConnect(accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("MetaMask not detected!");
    }
  };

  return (
    <button
      className="bg-bloodred px-6 py-2 text-black font-bold rounded hover:opacity-80 transition"
      onClick={connectWallet}
    >
      {address ? `Connected: ${address.slice(0,6)}...${address.slice(-4)}` : "Connect Ethereum Wallet"}
    </button>
  );
}
