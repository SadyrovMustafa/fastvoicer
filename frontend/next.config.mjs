/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Workaround for unstable filesystem cache on this Windows setup.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
