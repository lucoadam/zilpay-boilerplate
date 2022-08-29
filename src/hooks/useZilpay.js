import { BN, units, Zilliqa } from "@zilliqa-js/zilliqa";
import appConstants from "appConstants";
import { useEffect, useState } from "react";

export const useZilpay = () => {
  const { network } = appConstants;
  const [zilPay, setZilPay] = useState(
    (typeof window !== "undefined" && window.zilPay) || ""
  );
  const [wallet, setWallet]= useState({})
  const [errorMessage, setErrorMessage] = useState(null);
  const zilliqa = new Zilliqa(
    network === "testnet"
      ? "https://dev-api.zilliqa.com"
      : "https://api.zilliqa.com"
  );

  useEffect(()=>{
    setTimeout(()=>{
        console.log(window.zilPay)
        setZilPay(window.zilPay)
    },600)
  }, [])

  useEffect(() => {
    setZilPay(window.zilPay);
    if (window.zilPay) {
      setTimeout(async () => {
        const walletDetail = window.localStorage.getItem("wallet-address");
        if (walletDetail) {
          localStorage.setItem("zilchill-zp", true);
        }
      }, 1000);
    }
  }, [zilPay]);

  const connectWallet = async () =>
    new Promise((resolve, reject) => {
      if (!zilPay) {
        reject(new Error("Zilpay Not Found"));
      }
      if (zilPay.wallet.net !== network) {
        reject(new Error("Network Mismatch"));
      }
      zilPay.wallet.connect().then((isConnect) => {
        if (isConnect) {
            setWallet(zilPay.wallet.defaultAccount)
          window.localStorage.setItem(
            "wallet-address",
            JSON.stringify(zilPay.wallet.defaultAccount)
          );
          resolve(zilPay.wallet.defaultAccount);
        } else {
          reject(new Error("User Rejected"));
        }
      });
    });

  const getContractState = async (contractAddress) => {
    if (zilPay) {
      if (zilPay.wallet.net !== network) {
        throw new Error("Network Mismatch");
      }
      await zilPay.wallet.connect();
      const contract = zilPay.contracts.at(contractAddress);
      return contract.getState();
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error("Zilpay Not Found"));
      });
    }
  };

  const callTransaction = async (
    contractAddress,
    transition,
    params,
    amount,
    gasLimit
  ) => {
    if (zilPay) {
      await zilPay.wallet.connect();
      if (zilPay.wallet.net !== network) {
        throw new Error("Network Mismatch");
      }
    }
    const contract = zilPay.contracts.at(contractAddress);
    const gasPrice = units.toQa("2000", units.Units.Li);
    const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
    const isGasSufficient = gasPrice.gte(new BN(minGasPrice.result));
    if (!isGasSufficient) {
      throw new Error("Gas not Sufficient");
    }
    await connectWallet();
    return contract.call(transition, params, {
      amount: amount
        ? units.toQa(amount.toString(), units.Units.Zil)
        : units.toQa("0", units.Units.Zil),
      gasPrice,
      gasLimit: gasLimit || 2500,
    });
  };

  const signMessage = async (message) => {
    if (zilPay) {
      await zilPay.wallet.connect();
      if (zilPay.wallet.net !== network) {
        throw new Error("Network Mismatch");
      }

      const signed = await window.zilPay.wallet.sign(message);
      return signed;
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error("Zilpay Not Found"));
      });
    }
  };

  return {
    getContractState,
    connectWallet,
    callTransaction,
    errorMessage,
    signMessage,
    setErrorMessage,
    wallet
  };
};
