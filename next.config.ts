import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  distDir: './dist',
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
