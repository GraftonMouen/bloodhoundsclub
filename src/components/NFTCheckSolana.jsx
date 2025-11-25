import { useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

export default function NFTCheckSolana({ walletAddress, mintAddress, onAccessGranted }) {
  useEffect(() => {
    if (!walletAddress) return;

    const checkNFT = async () => {
      try {
        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const ownerPublicKey = new PublicKey(walletAddress);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
        const ownsNFT = tokenAccounts.value.some(acc => acc.account.data.parsed.info.mint === mintAddress);
        if (ownsNFT) onAccessGranted();
      } catch (err) {
        console.error("Solana NFT check failed", err);
      }
    };

    checkNFT();
  }, [walletAddress]);
  return null;
}
