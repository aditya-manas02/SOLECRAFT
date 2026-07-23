/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Turn off strict mode to prevent double component mount during Three.js canvas setup
  eslint: {
    // Disabling ESLint during production builds since this is a pure JS project
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
