import { useEffect } from "react";
import axios from "axios";

export default function NFTCheckEthereum({ walletAddress, nftContractAddress, onAccessGranted }) {
  useEffect(() => {
    if (!walletAddress) return;

    const checkNFT = async () => {
      try {
        const apiKey = "YOUR_ALCHEMY_API_KEY";
        const url = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}/getNFTs/?owner=${walletAddress}&contractAddresses[]=${nftContractAddress}`;
        const res = await axios.get(url);
        if (res.data.ownedNfts?.length > 0) onAccessGranted();
      } catch (err) {
        console.error("Ethereum NFT check failed", err);
      }
    };

    checkNFT();
  }, [walletAddress]);
  return null;
}
