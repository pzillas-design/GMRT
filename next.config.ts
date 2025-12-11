import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gmrt.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gmrt.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      }
    ],
  },
};


export default nextConfig;
