import { useMemo, useState, useEffect } from 'react'
import abi from '../abi/abi.json'
import { ethers } from 'ethers'

const CONTRACT = '0x'
const RPC = 'https://rpc.ankr.com/eth'
const MINT_PRICE = 0
const MINT_MAX = 100

const PARAMS = [
  {
    chainId: '0x' + (1).toString(16),
    chainName: 'Ethereum',
    rpcUrls: [RPC],
    blockExplorer: ['https://etherscan.io/'],
  },
]

const defaultProvider = new ethers.JsonRpcProvider(RPC)
const defaultContract = new ethers.Contract(CONTRACT, abi, defaultProvider)

const latestMintName = 'Dogs'

export const MintSection = () => {
  const [connected, setConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [totalSupply, setTotalSupply] = useState(0)
  const [isPublicMintEnabled, setIsPublicMintEnabled] = useState(false)

  const isSoldOut = totalSupply >= MINT_MAX
  const isMintable = !isSoldOut && isPublicMintEnabled

  const contract = useMemo(() => {
    if (!connected) return
    if (!provider) return
    if (!signer) return
    const contract = new ethers.Contract(CONTRACT, abi, signer)
    return contract
  }, [connected, provider, signer])

  const connect = async () => {
    if (!window.ethereum) return
    return window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(async () => {
        setConnected(true)
        setProvider(new ethers.JsonRpcProvider(window.ethereum))
        setSigner(
          await new ethers.JsonRpcProvider(window.ethereum)
            .getSigner()
            .then((r) => r),
        )
      })
  }

  const preConnect = async () => {
    if (!window.ethereum) return
    await window.ethereum
      .request({ method: 'eth_accounts' })
      .then(async (r) => {
        setConnected(!!r[0])
        setProvider(new ethers.JsonRpcProvider(window.ethereum))
        setSigner(
          await new ethers.JsonRpcProvider(window.ethereum)
            .getSigner()
            .then((r) => r),
        )
      })
  }

  const mint = async () => {
    await contract.functions
      .mint()
      .then((r) => {
        setTotalSupply((totalSupply) => totalSupply + 1)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const fetchTotalSupply = async () => {
    await defaultContract.functions.totalSupply().then((r) => {
      setTotalSupply(parseFloat(r[0].toString()))
    })
  }

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: PARAMS[0].chainId }],
      })
    } catch (switchError) {
      console.log(switchError)
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: PARAMS,
        })
      } catch (addError) {
        console.log(addError)
      }
    }
  }

  const handleConnect = async () => {
    await connect()
  }

  const handleMint = async () => {
    await handleConnect().then(async () => {
      await switchNetwork().then(async () => {
        await mint()
      })
    })
  }

  const fetchIsPublicMintEnabled = async () => {
    await defaultContract.functions
      .isPublicMintEnabled()
      .then((r) => setIsPublicMintEnabled(r[0]))
  }

  useEffect(() => {
    fetchTotalSupply()
    fetchIsPublicMintEnabled()
    preConnect()
  }, [])
  return (
    <div id="mint" className="p-5 py-20 bg-black flex flex-col mx-auto my-auto">
      <div className="container mx-auto">
        <h2>Mint</h2>
        <p className="mb-5">
          Mint our latest NFT collection, <strong>{latestMintName}</strong>.
        </p>
        <div
          className="bg-slate-900 bg-opacity-75 backdrop-blur-xl p-5 rounded-xl border-2 mx-auto"
          style={{ width: 700 }}
        >
          <div className="p-1 font-extrabold">
            Mint BOGA {latestMintName} ({totalSupply}/{MINT_MAX})
          </div>
          <div className="rounded-xl flex flex-col gap-3">
            <span className="absolute mt-3 ml-3">Price (ETH)</span>
            <input
              type="text"
              className="w-full rounded-xl p-3 bg-slate-700 text-right"
              placeholder="Price"
              value={'Free'}
              disabled
            />
            {isMintable && (
              <button
                onClick={handleMint}
                className={`bg-white text-slate-900 ${
                  isMintable && 'bg-green-500'
                }`}
              >
                Mint
              </button>
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
  )
}
