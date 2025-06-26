import { withNextIntl } from './scripts/next/withNextIntl.mjs'
import { composePlugins } from './scripts/utils.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
}

const plugins = [withNextIntl]

export default composePlugins(...plugins)(nextConfig)
