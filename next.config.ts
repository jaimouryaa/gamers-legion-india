import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (project-specific bucket URLs)
      {
        protocol: "https",
        hostname: "pnhqmtahkolwmzqcfuok.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Allow any https image as a catch-all for externally-linked covers
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Media uploads (game cover/banner images and videos) go directly
      // from the browser to Supabase Storage now — not through a Server
      // Action — specifically because Vercel's serverless functions cap
      // request bodies at 4.5MB regardless of this setting, which broke
      // larger uploads in production. This limit only matters for the
      // remaining (small, text-only) Server Actions, so the default would
      // be plenty, but there's no downside to leaving some headroom.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
