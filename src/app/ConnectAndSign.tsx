'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useSignMessage } from 'wagmi'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

function ConnectAndSign() {
  const searchParams = useSearchParams()
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessage } = useSignMessage()
  const [isSigning, setIsSigning] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)
  const token = searchParams.get('id')
  async function getPayload() {

    const apiResult = await fetch(process.env.NEXT_PUBLIC_API_HOST + "/api/payload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });

    return apiResult.json();
  }

  async function sign() {
    try {
      setIsSigning(true)

      const { payload } = await getPayload()
      const message = payload.replace("%address%", account.address)
      signMessage({
        message,
      }, {
        async onSuccess(signature) {

          const completeRes = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/api/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token,
              address: account.address,
              signature,
              message
            })
          })

          const complete = await completeRes.json()

          if (complete.success) {
            setSuccess(true)
          } else {
            setSuccess(false)
          }

        },
        onError: (error) => {
          console.error(error)
          setSuccess(false)
        }

      })
    } catch (error) {
      console.error(error)
    }
  }

  if (success !== null) {
    return (
      success === true ? (
        <div className='info'>Verification successful. Please get back to discord.</div>
      ) : (
          <div className='info'>Verification failed. Please check the console. Make sure the request isnt expired yet. </div>
      )
    )
  }

  if (account.status !== 'connected') {
    return (
      <>
        {/* @ts-ignore */}
        <ronin-button style={{
          '--rm-connect-btn-width': 'auto',
          '--rm-connect-btn-font-family': 'inherit',
          '--rm-connect-btn-font-size': '0.95rem',
          '--rm-connect-btn-font-weight': '500',
          '--rm-connect-btn-border-radius': '0.4rem',
          '--rm-connect-btn-padding': '11px 13px',
          '--rm-connect-btn-bg-color': '#0d6efd',
          '--rm-connect-btn-bg-color-hover': '#0d6efde6',
          '--rm-connect-btn-color': '#fff'
        }} />
      </>
    )
  }

  return (
    <>
      <div className='cta'>
        <h1>Please complete the verification of your wallet by clicking "Sign"</h1>
        <button type="button" className="button" onClick={() => sign()}>
          {isSigning ? 'Verifying...' : 'Sign'}
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
      )}
    </>
  )
}

export default ConnectAndSign
