'use client'

import dynamic from 'next/dynamic';
import React from 'react';

const ConnectAndSign = dynamic(() => import('@/app/ConnectAndSign'), {
  loading: () => <p className='loading' aria-busy="true">Loading...</p>,
  ssr: false,
})

function App() {

  return (
    <main>
      <ConnectAndSign />
    </main>
  )
}

export default App
