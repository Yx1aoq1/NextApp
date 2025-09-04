import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['zh-Hans', 'en'],

  // Used when no locale matches
  defaultLocale: 'zh-Hans',
  localePrefix: 'as-needed',
})
