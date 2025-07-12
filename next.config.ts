
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
        hostname: 'images.dog.ceo',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'restcountries.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'cataas.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.catbox.moe',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.waifu.pics',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.waifu.pics',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.trace.moe',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
