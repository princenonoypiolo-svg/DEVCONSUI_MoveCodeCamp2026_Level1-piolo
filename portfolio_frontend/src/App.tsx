import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import PortfolioView from "./views/PortfolioView";
import "./App.css";
import { querySuiGraphql } from "./suiGraphql";

function App() {
  const account = useCurrentAccount();
  const [balance, setBalance] = useState("0.00");

  useEffect(() => {
    if (!account) {
      setBalance("0.00");
      return;
    }

    querySuiGraphql<{ address: { balance: { totalBalance: string } } }>(
      "mainnet",
      `query ($address: SuiAddress!) {
        address(address: $address) {
          balance(coinType: "0x2::sui::SUI") {
            totalBalance
          }
        }
      }`,
      { address: account.address },
    )
      .then((data) => {
        const totalBalance = data.address?.balance?.totalBalance ?? "0";
        setBalance((Number(totalBalance) / 1_000_000_000).toFixed(2));
      })
      .catch(() => setBalance("0.00"));
  }, [account]);

  const getSuiBalance = () => {
    return balance;
  };

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" autoClose={3000} hideProgressBar={false} />

      {/* HEADER */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/sui-logo.png" alt="Sui Logo" />
            <h1>Smart Contracts Code Camp Portfolio</h1>
          </div>
        </div>
      </header>

      {/* Wallet Status Banner */}
      {account && (
        <div className="wallet-banner">
          <div className="wallet-banner-content">
            <div className="wallet-info">
              <div className="wallet-dot"></div>
              <div>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>Wallet Connected</span>
                  <span style={{ color: "#64748b" }}>|</span>
                  <span style={{ color: "#cbd5e1" }}>
                    Balance: <strong>{getSuiBalance()} SUI</strong>
                  </span>
                </div>
                <div style={{ color: "#86efac", fontSize: "0.875rem", marginTop: "4px" }}>
                  {account.address.slice(0, 8)}...{account.address.slice(-6)}
                </div>
              </div>
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Viewing your portfolio</div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main>
        <PortfolioView />
      </main>
    </div>
  );
}

export default App;
