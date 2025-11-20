export const metadata = {
  title: 'Gilson Farma API',
  description: 'Backend API para Gilson Farma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
