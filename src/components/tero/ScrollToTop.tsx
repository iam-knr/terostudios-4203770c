import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.85 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollUp}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-parchment bg-ink text-cream shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-vermillion hover:border-vermillion/30 hover:shadow-[0_8px_30px_rgba(232,57,14,0.35)]"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
