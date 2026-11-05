/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/portfolio",
        destination: "/#portfolio",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;


