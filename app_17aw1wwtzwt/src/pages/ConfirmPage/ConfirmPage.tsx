import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function ConfirmPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/5 flex flex-col items-center justify-center px-4 py-8"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="返回"
        className="absolute top-4 left-4 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>

      {/* Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="text-7xl mb-6"
        aria-hidden="true"
      >
        🥰
      </motion.div>

      {/* Confirmation text */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3"
      >
        太好啦！
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-muted-foreground text-base text-center mb-10"
      >
        那我们定个时间吧~
      </motion.p>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        onClick={() => navigate('/datetime')}
        aria-label="继续"
        className="px-12 py-3.5 rounded-full bg-primary text-primary-foreground text-lg font-semibold shadow-md hover:shadow-lg active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        继续
      </motion.button>
    </motion.div>
  );
}
