import { motion } from "framer-motion";
import Image from "next/image";

const LoadingScreen = () => (
  <div className="min-h-screen bg-app flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl pulse-glow overflow-hidden"
      >
        <Image src="/logo.jpeg" alt="BilQuiz" width={112} height={112} priority className="h-full w-full object-cover" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-black text-white mb-3"
      >
        اختبر ذكائك الآن
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/50 text-lg mb-10"
      >
        جارٍ إعداد تجربة أسئلة احترافية...
      </motion.p>

      {/* Loading dots */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="h-2 w-2 rounded-full bg-emerald-400"
          />
        ))}
      </div>
    </div>
  </div>
);

export default LoadingScreen;
