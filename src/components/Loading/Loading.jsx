import React from 'react'
import './Loading.css'

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <div className="loader"></div>
    </div>
  )
}
