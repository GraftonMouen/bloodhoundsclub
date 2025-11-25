// src/App.jsx
import React, { useMemo, useEffect, useRef, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import BloodhoundLogo from "./assets/bloodhound-logo.png";
import CreepyMenuSound from "./assets/sounds/CreepyMenuSound.mp3";
import ButtonClickSound from "./assets/sounds/ButtonClick.mp3";

import "@solana/wallet-adapter-react-ui/styles.css";

const NFT_MINT_ADDRESS = "YOUR_NFT_MINT_ADDRESS_HERE"; // REPLACE THIS

// ----------------------------
// MAIN APP WRAPPER
// ----------------------------
export default function App() {
  const network = "devnet";
  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BloodhoundApp />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// ----------------------------
// ACTUAL APP CONTENT
// ----------------------------
function BloodhoundApp() {
  const wallet = useWallet();

  const backgroundAudioRef = useRef(null);
  const buttonClickAudioRef = useRef(null);
  const walletButtonRef = useRef(null);

  const [checkedNFT, setCheckedNFT] = useState(false);
  const [hasNFT, setHasNFT] = useState(false);

  // ----------------------------
  // BACKGROUND MUSIC (AUTO + FADE)
  // ----------------------------
  useEffect(() => {
    const startMusic = () => {
      const audio = backgroundAudioRef.current;
      if (!audio) return;

      audio.volume = 0;
      audio.loop = true;
      audio.play().catch(() => {});

      let target = 0.1;
      let duration = 5000;
      let step = target / (duration / 50);

      const fade = setInterval(() => {
        if (audio.volume < target) {
          audio.volume = Math.min(audio.volume + step, target);
        } else {
          clearInterval(fade);
        }
      }, 50);

      window.removeEventListener("click", startMusic);
    };

    window.addEventListener("click", startMusic);
    return () => window.removeEventListener("click", startMusic);
  }, []);

  // ----------------------------
  // BUTTON CLICK SOUND
  // ----------------------------
  useEffect(() => {
    if (!walletButtonRef.current) return;

    const button = walletButtonRef.current.querySelector("button");
    if (!button) return;

    const handleClick = () => {
      const clickAudio = buttonClickAudioRef.current;
      if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(() => {});
      }
    };

    button.addEventListener("click", handleClick);
    return () => button.removeEventListener("click", handleClick);
  }, [walletButtonRef.current]);

  // ----------------------------
  // NFT CHECK LOGIC
  // ----------------------------
  const checkNFT = async () => {
    if (!wallet.publicKey) return;

    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const nftMint = new PublicKey(NFT_MINT_ADDRESS);

      const accounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
      );

      const owns = accounts.value.some(({ account }) => {
        const info = account.data.parsed.info;
        return info.mint === nftMint.toString() && info.tokenAmount.uiAmount === 1;
      });

      setHasNFT(owns);
      setCheckedNFT(true);
    } catch (e) {
      console.error(e);
      setHasNFT(false);
      setCheckedNFT(true);
    }
  };

  // Trigger NFT check only after wallet connects
  useEffect(() => {
    if (wallet.connected) checkNFT();
  }, [wallet.connected]);

  // ----------------------------
  // SCREENS
  // ----------------------------
  const MainPage = () => (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      <img
        src={BloodhoundLogo}
        alt="Bloodhound Logo"
        className="w-[30vw] max-w-[350px] min-w-[150px] h-auto mb-4"
      />

      <h1
        className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
        style={{ textShadow: "0 0 10px red, 0 0 20px red" }}
      >
        BLOODHOUND CLUB
      </h1>

      <div ref={walletButtonRef} className="relative z-50">
        <WalletMultiButton className="wallet-adapter-button" />
      </div>
    </div>
  );

  const AccessDenied = () => (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-red-600 text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
        ACCESS DENIED
      </h1>

      <p className="text-white text-lg mb-6">You must own the NFT to enter Bloodhound Club.</p>

      <div ref={walletButtonRef} className="relative z-50">
        <WalletMultiButton className="wallet-adapter-button" />
      </div>
    </div>
  );

  // ----------------------------
  // RENDER LOGIC
  // ----------------------------
  return (
    <>
      <audio ref={backgroundAudioRef} src={CreepyMenuSound} />
      <audio ref={buttonClickAudioRef} src={ButtonClickSound} />

      {!wallet.connected ? <MainPage /> : checkedNFT ? (hasNFT ? <MainPage /> : <AccessDenied />) : <MainPage />}
    </>
  );
}

