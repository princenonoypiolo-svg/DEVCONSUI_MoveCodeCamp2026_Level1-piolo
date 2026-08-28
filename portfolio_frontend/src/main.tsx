import React from 'react'
import ReactDOM from 'react-dom/client'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import App from './App'

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SuiClientProvider networks={networks} defaultNetwork="mainnet">
      <WalletProvider autoConnect={false} enableUnsafeBurner={false}>
        <App />
      </WalletProvider>
    </SuiClientProvider>
  </React.StrictMode>
)