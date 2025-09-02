import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StreamWeave - Programmable Streaming + Storage Rails for Creators',
  description: 'Stream It. Own It. Earn It. - Decentralized creator platform powered by Filecoin',
  keywords: ['streaming', 'creators', 'filecoin', 'web3', 'decentralized', 'blockchain'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
