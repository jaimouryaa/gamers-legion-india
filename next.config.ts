import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB request body cap, which is far
      // below what the media upload action needs (images up to 20MB,
      // videos up to 40MB — see app/admin/(protected)/games/upload-action.ts).
      // Set comfortably above the largest allowed file to leave room for
      // multipart/form-data overhead.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
