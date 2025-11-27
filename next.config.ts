import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.myrepublic.co.id',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'iconlogovector.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'instagram.fmlg9-1.fna.fbcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.promomyrepublicjogja.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
