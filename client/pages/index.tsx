import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Whiteboard = dynamic(() => import('../components/Whiteboard'), {
  ssr: false
})

export default function Home() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Online Whiteboard</h1>
      <Whiteboard />
    </div>
  )
}