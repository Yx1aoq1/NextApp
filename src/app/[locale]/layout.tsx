import { PropsWithChildren } from 'react'

import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'

export default async function LocaleLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return <>{children}</>
}
