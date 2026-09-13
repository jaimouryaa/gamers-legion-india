"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  isDanger = true,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            className="glass-panel w-full max-w-sm rounded-2xl p-6"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isDanger ? "bg-danger/15 text-danger" : "bg-accent-primary/15 text-accent-primary"}`}>
              <AlertTriangle size={18} />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-text-primary">{title}</h3>
            <p className="mt-1.5 text-sm text-text-muted">{description}</p>
            <div className="mt-6 flex justify-end gap-2.5">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant={isDanger ? "danger" : "primary"} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
