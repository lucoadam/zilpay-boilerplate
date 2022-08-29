import { useZilpay } from "hooks/useZilpay"
import { useState } from "react"

export default function App() {
  const { wallet,connectWallet, errorMessage , signMessage}= useZilpay()
  const [message, setMessage] = useState()
  const [signed, setSigned] = useState({})
  
  return (
    <div className="flex flex-col items-center px-10 py-10 w-full">
      <div>
      <button onClick={()=>{
        console.log("wallet")
        if(!wallet.bech32){
          connectWallet()
        .then(()=>{
          console.log('connected')
        })
        .catch((e)=>{
          console.log(e)
        })
        }
      }} className="bg-red-600 text-white px-4 py-3 rounded-md">
        {wallet.bech32 || "Connect Wallet"}
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <label>Message</label>
        <input className="border h-10 w-full" type="text" value={message} onChange={(e)=>setMessage(e.target.value)}/>

      <button
        onClick={()=>{
          signMessage(message)
          .then(signed=>{
            setSigned(signed)
          })
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-md">
        Sign
        </button>

      
      </div>
      <pre>
          {JSON.stringify(signed, null, 2)}
        </pre>
      <div className="text-error">
          {errorMessage}
      </div>
    </div>
  )
}