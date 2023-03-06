import { useMemo, useState, useEffect, useCallback, memo } from "react";
import abi from "../abi/abi.json";
import { ethers } from "ethers";
import {
  MINT_MAX,
  RPC,
  CONTRACT,
  MINT_PRICE,
  CHAIN_ID,
  CHAIN_NAME,
  BLOCK_EXPLORER,
  MINT_NAME,
} from "../constants/config";

const PARAMS = [
  {
    chainId: CHAIN_ID,
    chainName: CHAIN_NAME,
    rpcUrls: [RPC],
    blockExplorer: [BLOCK_EXPLORER],
  },
];

const defaultProvider = new ethers.providers.JsonRpcProvider(RPC);
const defaultContract = new ethers.Contract(CONTRACT, abi, defaultProvider);

declare var window: {
  ethereum: any;
};

export const MintSection = memo(() => {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [totalSupply, setTotalSupply] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const totalPrice = useMemo(
    () => (quantity * MINT_PRICE).toFixed(2),
    [quantity]
  );
  const [isPublicMintEnabled, setIsPublicMintEnabled] = useState(false);

  const isSoldOut = totalSupply >= MINT_MAX;
  const isMintable = !isSoldOut && isPublicMintEnabled;

  const contract = useMemo(() => {
    if (!connected) return;
    if (!provider) return;
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT, abi, signer);
    return contract;
  }, [connected, provider, signer]);

  const preConnect = async () => {
    if (!window?.ethereum) return;
    await window.ethereum
      .request({ method: "eth_accounts" })
      .then(async (r: any) => {
        setConnected(!!r[0]);
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
        setSigner(
          await new ethers.providers.Web3Provider(window.ethereum).getSigner()
        );
      });
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: PARAMS[0].chainId }],
      });
    } catch (switchError) {
      console.log(switchError);
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: PARAMS,
        });
      } catch (addError) {
        console.log(addError);
      }
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => (prev + 1 > MINT_MAX ? prev : prev + 1));
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev - 1 < 1 ? prev : prev - 1));
  };

  const handleConnect = async () => {
    if (!window.ethereum) return;
    return window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async () => {
        setConnected(true);
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
        setSigner(
          await new ethers.providers.Web3Provider(window.ethereum).getSigner()
        );
      });
  };

  const handleMint = async () => {
    await switchNetwork().then(async () => {
      await contract!.functions
        .mint(quantity, { value: ethers.utils.parseEther(totalPrice) })
        .then((r) => {
          setTotalSupply((totalSupply) => totalSupply + 1);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  const fetchTotalSupply = useCallback(async () => {
    const totalSupply = await defaultContract.functions
      .totalSupply()
      .then((r) => r[0]);
    setTotalSupply(totalSupply);
  }, []);

  const fetchIsPublicMintEnabled = useCallback(async () => {
    const isPublicMintEnabled = await defaultContract.functions
      .isPublicMintEnabled()
      .then((r) => r[0]);
    setIsPublicMintEnabled(isPublicMintEnabled);
  }, []);

  useEffect(() => {
    fetchTotalSupply();
    fetchIsPublicMintEnabled();
    preConnect();
  }, [fetchIsPublicMintEnabled, fetchTotalSupply]);

  return (
    <div id="mint" className="p-5 py-20 bg-black flex flex-col mx-auto my-auto">
      <div className="container mx-auto text-center">
        <h2>Mint</h2>
        <p className="mb-5">
          Mint our latest NFT collection, <strong>{MINT_NAME}</strong>.
        </p>
        <div
          className=" bg-opacity-75 backdrop-blur-xl p-5 rounded-xl border-2 mx-auto"
          style={{ width: 700 }}
        >
          <em>Drop Date: 4th March 2023, 14:00 UTC</em>
          <div className="p-1 font-extrabold">
            Mint BOGA {MINT_NAME} ({totalSupply}/{MINT_MAX})
          </div>
          <div className="rounded-xl flex flex-col gap-3">
            <span className="absolute mt-3 ml-3">Price (ETH)</span>
            <input
              type="text"
              className="w-full rounded-xl p-3 bg-slate-700 text-right"
              placeholder="Price"
              value={totalPrice}
              disabled
            />
            <div className="flex justify-between">
              <button className="bg-red-600" onClick={handleDecrement}>
                -
              </button>
              <span className="text-4xl font-extrabold">{quantity}</span>
              <button className="bg-green-600" onClick={handleIncrement}>
                +
              </button>
            </div>

            {connected ? (
              isMintable && (
                <button
                  onClick={handleMint}
                  className={`bg-white text-slate-900 ${
                    isMintable && "bg-green-500"
                  }`}
                >
                  Mint
                </button>
              )
            ) : (
              <button onClick={handleConnect}>Connect Wallet</button>
            )}

            <ul className="text-sm">
              <li>Network: {PARAMS[0].chainName}</li>
              <li>Price: {MINT_PRICE} ETH</li>
              <li>Contract: {CONTRACT}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
