import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rekener Grill – Pizza & Kebab Klein Reken',
  description: 'Bestell Pizza, Kebab, Pasta und mehr. Lieferservice für Klein Reken, Lembeck, Groß Reken.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#FDF8F0' }}>{children}</body>
    </html>
  )
}
