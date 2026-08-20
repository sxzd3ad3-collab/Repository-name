/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "3000-i0dg6a4zbik8bvv4zon67.e2b.app",
    "*.e2b.app",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
    outputFileTracingIncludes: {
      "/**": ["./prisma/prod.db"],
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
