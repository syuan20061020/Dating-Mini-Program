import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { MENU_ITEMS } from '@/data/menu';

export default function MenuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { date?: string; time?: string } | null;

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (item: (typeof MENU_ITEMS)[0]) => {
    setSelectedId(item.id);
    setTimeout(() => {
      navigate('/card', {
        state: {
          date: state?.date || '',
          time: state?.time || '',
          menu: item,
        },
      });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/5 px-4 py-8"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="返回"
        className="absolute top-4 left-4 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>

      <div className="max-w-lg mx-auto pt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2"
        >
          想吃什么？
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-muted-foreground text-sm text-center mb-8"
        >
          选一个你最想吃的吧~
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          {MENU_ITEMS.map((item, i) => {
            const isSelected = selectedId === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(item);
                  }
                }}
                aria-label={`选择${item.name}`}
                aria-pressed={isSelected}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? 'bg-primary/15 border-primary shadow-md'
                    : 'bg-card border-border/50 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Check icon when selected */}
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </span>
                )}

                <span className="text-3xl mb-2" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="text-sm font-semibold text-foreground text-center leading-tight">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground text-center mt-1 leading-tight">
                  {item.desc}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
