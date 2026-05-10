export const metadata = {
  title: 'AETHER OS | Mission Control',
  description: 'Autonomous Multi-Agent Intelligence System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#000', color: '#fff', fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  )
}
