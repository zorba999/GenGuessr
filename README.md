# 🌍 GenGuessr

> A multiplayer geography guessing game powered by **GenLayer Intelligent Contracts** and **Optimistic Democracy** on Bradbury Testnet.

## How it works

1. **Connect your wallet** (MetaMask / EVM wallet)
2. **Create or join a room** — instant, off-chain
3. **Read a mystery text** from anywhere in the world — 60 seconds to guess the country, language & year
4. **AI validators** on GenLayer score your answer via Optimistic Democracy consensus
5. **Earn XP** stored on-chain. No cheating possible!

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TailwindCSS, RainbowKit + wagmi |
| Wallet | EVM wallet (MetaMask, WalletConnect) |
| Room management | Off-chain (server-side in-memory store) |
| AI Scoring | GenLayer Intelligent Contract — Optimistic Democracy |
| Leaderboard | On-chain (GenLayer Bradbury Testnet) |

## Smart Contract

- **Network**: GenLayer Bradbury Testnet (chainId: 4221)
- **Contract**: `contracts/genguessr_v2.py`
- **Features**: `submit_guess`, `evaluate_round` (AI scoring), `get_leaderboard`

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# Fill in PRIVATE_KEY and NEXT_PUBLIC_CONTRACT_ADDRESS

# 3. Deploy contract (optional - contract already deployed)
npm run deploy-contract

# 4. Run development server
npm run dev
```

## Environment Variables

See `.env.example` for required variables.

## GenLayer Resources

- [GenLayer Docs](https://docs.genlayer.com)
- [Bradbury Explorer](https://explorer-bradbury.genlayer.com)
- [Faucet](https://testnet-faucet.genlayer.foundation)
