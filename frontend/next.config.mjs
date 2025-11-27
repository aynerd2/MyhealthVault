/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['health-vault-documents.s3.amazonaws.com'],
  },
};

export default nextConfig;
