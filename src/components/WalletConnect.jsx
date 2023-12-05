import React, { useEffect, useState } from 'react';
import {
  PublicKey,
  Transaction,
} from "@solana/web3.js";

// Create types
const DisplayEncoding = ["utf8", "hex"];

const PhantomEvent = ["disconnect", "connect", "accountChanged"];
const PhantomRequestMethod = [
  "connect",
  "disconnect",
  "signTransaction",
  "signAllTransactions",
  "signMessage",
];

// Create a provider interface (think of this as an object) to store the Phantom Provider
const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) return provider;
  }
};

function WalletConnect() {
  // State variables
  const [provider, setProvider] = useState(undefined);
  const [walletKey, setWalletKey] = useState(undefined);

  // useEffect hook to run on component mount
  useEffect(() => {
    const provider = getProvider();

    // Set the provider if it exists
    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  /**
   * @description Prompts user to connect wallet if it exists.
	 * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    const { solana } = window;
    // Check if phantom wallet exists
    if (solana) {
      try {
        // Connect wallet and get response which includes the wallet public key
        const response = await solana.connect();
        console.log('Wallet account:', response.publicKey.toString());
        // Update walletKey to be the public key
        setWalletKey(response.publicKey.toString());
      } catch (err) {
        // Handle rejection: { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  const disconnectWallet = async () => {
    const { solana } = window;

    //check if connected 
    if(connectWallet) {
      try {
        //Disconnect wallet
        const response = await solana.disconnect()
        setWalletKey(null)
      } catch (err) {
        console.log(err)
      }
    }
  }

  // HTML code for the app
  return (
    <div className="App">
      <header className="App-header">
        <h2>Connect to Phantom Wallet</h2>
    
      </header>
      {provider && !walletKey && (
        <button
          style={{
            fontSize: "16px",
            padding: "15px",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
      {provider && walletKey && 
        <p style={{color: "black"}}>Connected account: {walletKey} <button className='disconnect' onClick={disconnectWallet}>Disconnect</button>
        </p>
      }  

      {!provider && (
        <p>
          No provider found. Install{" "}
          <a href="https://phantom.app/">Phantom Browser extension</a>
        </p>
      )}
    </div>
  );
}

export default WalletConnect;
