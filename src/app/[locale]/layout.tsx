import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';

export interface LocaleLayoutProps {}
export default async function LocaleLayout({ children }: PropsWithChildren<LocaleLayoutProps>) {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return <>{children}</>;
}
