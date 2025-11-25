import { useState } from "react";

export default function PhantomConnectButton({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectPhantom = async () => {
    const provider = window.solana;
    if (provider && provider.isPhantom) {
      try {
        const resp = await provider.connect();
        setWalletAddress(resp.publicKey.toString());
        onConnect(resp.publicKey.toString());
      } catch (err) {
        console.error("Phantom connect failed", err);
      }
    } else {
      alert("Phantom Wallet not detected!");
    }
  };

  return (
    <button
      className="bg-bloodred px-6 py-2 text-black font-bold rounded hover:opacity-80 transition"
      onClick={connectPhantom}
    >
      {walletAddress ? `Connected: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : "Connect Phantom"}
    </button>
  );
}
