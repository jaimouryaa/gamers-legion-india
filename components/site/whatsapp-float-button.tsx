"use client";

import { motion } from "framer-motion";
import { buildWhatsAppGeneralLink } from "@/lib/utils";

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="currentColor" aria-hidden="true">
      <path d="M12.01 2C6.48 2 2 6.48 2 12.01c0 1.98.53 3.83 1.46 5.43L2 22l4.7-1.42a9.96 9.96 0 0 0 5.3 1.53h.01c5.53 0 10.01-4.48 10.01-10.01C22.02 6.48 17.55 2 12.01 2Zm5.86 14.3c-.25.7-1.25 1.29-2.03 1.46-.55.12-1.26.21-3.66-.79-2.99-1.24-4.92-4.24-5.07-4.44-.15-.2-1.21-1.61-1.21-3.07 0-1.46.75-2.17 1.02-2.47.27-.3.58-.37.78-.37.2 0 .39.002.56.01.18.008.42-.07.66.5.25.6.84 2.06.91 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.66-.08.18-.2.76-.89.97-1.2.2-.3.4-.25.68-.15.28.1 1.78.84 2.08.99.3.15.5.22.58.35.07.13.07.75-.18 1.44Z" />
    </svg>
  );
}

export function WhatsAppFloatButton() {
  return (
    <motion.a
      href={buildWhatsAppGeneralLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_6px_24px_-4px_rgba(0,0,0,0.5)]"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
      <WhatsAppMark />
    </motion.a>
  );
}
