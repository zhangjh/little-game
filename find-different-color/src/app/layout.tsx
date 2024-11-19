import './globals.css'

export const metadata = {
  title: '火眼金睛',
  description: '找出不同颜色的方块',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
