/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost", // For local development
      "your-production-domain.com", // Your actual production domain
      "example.com", // Example domain from your error
      "images.unsplash.com", // Common image hosting service
      // Add any other domains you need here
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows all HTTPS domains (use with caution)
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        aws4: false,
      };
    }
    return config;
  },
};

export default nextConfig;
