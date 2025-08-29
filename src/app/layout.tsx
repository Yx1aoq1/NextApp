import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import '@/styles/globals.css'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Script src="/lib/ogvjs-1.9.0/ogv.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}
