import { ethers } from 'ethers'

export const contractAddress = '0x90Dd104d7eCce18929d0A8a069B9b2a0BB562666'
export const sepoliaChainId = 11155111n
export const blockchainNetworkName = 'Sepolia'
export const contractExplorerUrl = `https://sepolia.etherscan.io/address/${contractAddress}`

export const getTxExplorerUrl = (txHash) =>
  txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : ''

const abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'candidateId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getRecord',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'candidateId',
        type: 'string',
      },
    ],
    name: 'getRecordCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'records',
    outputs: [
      {
        internalType: 'string',
        name: 'hash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'candidateId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'hash',
        type: 'string',
      },
    ],
    name: 'storeRecord',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'candidateId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'hash',
        type: 'string',
      },
    ],
    name: 'verifyRecord',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const createBlockchainError = (message, code) => {
  const error = new Error(message)
  error.code = code
  return error
}

const ensureEthereum = () => {
  if (!window.ethereum) {
    throw createBlockchainError('MetaMask is not installed. Please install MetaMask to continue.', 'NO_METAMASK')
  }

  return window.ethereum
}

const ensureSepolia = async (provider) => {
  const network = await provider.getNetwork()
  if (network.chainId !== sepoliaChainId) {
    throw createBlockchainError('Wrong network. Please switch MetaMask to Sepolia testnet.', 'WRONG_NETWORK')
  }
}

const getProvider = async () => {
  const ethereum = ensureEthereum()
  const provider = new ethers.BrowserProvider(ethereum)
  await ensureSepolia(provider)
  return { ethereum, provider }
}

const getWriteContract = async () => {
  const { ethereum, provider } = await getProvider()
  await ethereum.request({ method: 'eth_requestAccounts' })
  const signer = await provider.getSigner()
  return new ethers.Contract(contractAddress, abi, signer)
}

const getReadContract = async () => {
  const { provider } = await getProvider()
  return new ethers.Contract(contractAddress, abi, provider)
}

export const storeHash = async (candidateId, hash, onStatusChange) => {
  onStatusChange?.({
    status: 'waiting_approval',
    message: 'Waiting for MetaMask approval...',
  })

  const contract = await getWriteContract()
  const tx = await contract.storeRecord(candidateId, hash)

  onStatusChange?.({
    status: 'pending',
    message: 'Transaction pending...',
    txHash: tx.hash,
  })

  await tx.wait()

  onStatusChange?.({
    status: 'confirmed',
    message: 'Transaction confirmed ✅',
    txHash: tx.hash,
  })

  return {
    txHash: tx.hash,
    timestamp: new Date().toISOString(),
  }
}

export const verifyHash = async (candidateId, hash) => {
  const contract = await getReadContract()
  return contract.verifyRecord(candidateId, hash)
}

export const getAttestationRecordCount = async (candidateId) => {
  const contract = await getReadContract()
  const count = await contract.getRecordCount(candidateId)
  return Number(count)
}

export const getAttestationRecord = async (candidateId, index) => {
  const contract = await getReadContract()
  const [hash, timestamp] = await contract.getRecord(candidateId, index)

  return {
    hash,
    timestamp: Number(timestamp),
  }
}

export const getLatestAttestation = async (candidateId) => {
  const count = await getAttestationRecordCount(candidateId)
  if (!count) return null

  const latestRecord = await getAttestationRecord(candidateId, count - 1)

  return {
    ...latestRecord,
    count,
  }
}
