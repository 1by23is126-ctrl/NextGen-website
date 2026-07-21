import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PageLoader = memo(function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-101%" }}
          transition={{ duration: 1.1, ease: [0.77, 0, 0.18, 1] }}
          className="fixed inset-0 z-[100] bg-[#171717] text-white flex items-center justify-center"
          data-testid="page-loader"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="block w-2 h-2 bg-[#C8A46A]"
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="font-serif text-2xl md:text-3xl tracking-tight"
            >
              NextGen <span className="italic text-[#C8A46A]">Interiors</span>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
              className="h-px bg-[#C8A46A] w-[200px] origin-center"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default PageLoader;
