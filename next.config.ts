import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
