'use client'

import { useAccount } from 'wagmi'
import { signMessage } from '@wagmi/core'
import { useState } from 'react'
import { config } from '@/wagmi'
import { useSearchParams } from 'next/navigation'

function ConnectAndSign() {
  const searchParams = useSearchParams()
  const account = useAccount()
  const [isSigning, setIsSigning] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)
  const token = searchParams.get('id')

  async function getPayload() {

    const apiResult = await fetch("/api/payload", {
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
      const result = await signMessage(config, {
        message: 'hello world',
      })
      console.log(result)
      const { payload } = await getPayload()
      const message = payload.replace("%address%", account.address)

      const completeRes = await fetch('/api/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          address: account.address,
          signature: result,
          message
        })
      })

      const complete = await completeRes.json()

      if (complete.success) {
        setSuccess(true)
      } else {
        setSuccess(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSigning(false)
    }
  }

  if (success !== null) {
    return (
      success === true ? (
        <div className='info'>Verification successful - Please return to Discord</div>
      ) : (
        <div className='info'>Verification failed - Please check the console. Make sure the request isnt expired yet. </div>
      )
    )
  }

  return (
    <div>
      {/* @ts-ignore */}
      <ronin-button style={{
        '--rm-connect-btn-width': '160px',
        '--rm-connect-btn-font-family': 'inherit',
        '--rm-connect-btn-font-size': '0.95rem',
        '--rm-connect-btn-font-weight': '500',
        '--rm-connect-btn-border-radius': '0.4rem',
        '--rm-connect-btn-padding': '11px 13px',
        '--rm-connect-btn-bg-color': '#0d6efd',
        '--rm-connect-btn-bg-color-hover': '#0d6efde6',
        '--rm-connect-btn-color': '#fff'
      }} />

      {account.status === 'connected' && (
        <>
          <h1>Please click the button below</h1>
          <button type="button" className="button" onClick={() => sign()}>
            {isSigning ? 'Signing...' : 'Sign'}
          </button>
        </>
      )}
    </div>
  )
}

export default ConnectAndSign
