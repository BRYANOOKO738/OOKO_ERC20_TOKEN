

# MyToken (OOKO) - ERC20 Token with React Client and Foundry Smart Contract

## Overview

This repository contains a full-stack decentralized application (dApp) featuring an ERC20 token smart contract called **MyToken (symbol: OK)** and a client-side application built with **Vite + React**. The smart contract is written in Solidity and uses **Foundry** for development, testing, and deployment.

---

## Features

* ERC20 token contract with minting to the owner at deployment (1,000,000 tokens).
* Users can **buy tokens by sending ETH** to the contract at a configurable token price.
* Owner can **withdraw accumulated ETH** from the contract.
* Owner can **update the token price**.
* Client-side React app interacts with the contract for buying tokens and displaying balances.
* Simple, fast, and modern frontend using Vite and React.

---


## Getting Started

### Prerequisites

Make sure you have the following installed:

* [Foundry](https://getfoundry.sh/) (for smart contract development and testing)
* [Node.js](https://nodejs.org/) (for running React client)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (package manager)

---

### Setting up the Smart Contract (Foundry)

1. Clone the repo:

   ```bash
   git clone https://github.com/BRYANOOKO738/OOKO_ERC20_TOKEN.git
   cd mytoken
   ```

2. Install Foundry (if not installed):

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

3. Compile the contract:

   ```bash
   forge build
   ```

4. Run tests:

   ```bash
   forge test
   ```

5. Deploy the contract to your preferred network (e.g., local Anvil, sepolia testnet) add the RPC_URL and PRIVATE_KEY to your .env file  :

   ```bash
   forge script script/MyCoin.s.sol:MyTokenScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
   ```

---
5. Deploy at this address :

   ```bash
   0xCaD0C8e13618101F34c63637e1c36185656483F4
   ```

---

### Running the React Client

1. Navigate to the client directory:

   ```bash
   cd Client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser at the URL provided (usually [http://localhost:5173](http://localhost:5173)).

---

### Interacting with the Contract via Client

* The client allows users to:

  * View their token balance.
  * Buy tokens by sending ETH.
  * View the current token price.
* The owner can also set the token price and withdraw accumulated ETH via the smart contract (owner actions may require additional UI or direct contract calls).

---

## Contract Details

* Contract name: `MyToken`
* Symbol: `OK`
* Total supply minted at deployment: 1,000,000 tokens (with 18 decimals)
* Token price: starts at 0.001 ETH per token (can be updated by owner)
* Users buy tokens by sending ETH to `buyTokens()` or sending ETH directly (fallback `receive()` function).
* Owner can withdraw ETH accumulated from token sales.

---

## Important Notes

* This contract does **not** include advanced features like pausing, blacklisting, or reentrancy protection. Use with caution.
* Make sure to secure your private keys and never expose them.
* The token price update and withdrawal functions are **restricted to the owner**.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any questions, issues, or contributions, please open an issue or submit a pull request.


