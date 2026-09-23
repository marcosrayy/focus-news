import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b', // Dark background to match the theme
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#FF5A00" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="8" y="2" width="8" height="13" rx="4" />
          <path d="M4 10v2a8 8 0 0 0 8 8v3" />
          <path d="M20 10v2a8 8 0 0 1-5.5 7.6" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
