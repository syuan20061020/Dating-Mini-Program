import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return format(d, 'yyyy-MM-dd');
}

function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export default function DateTimePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingState = (location.state as { date?: string; time?: string }) || {};

  const tomorrow = useMemo(() => getTomorrow(), []);
  const today = useMemo(() => getToday(), []);

  const [date, setDate] = useState(existingState.date || tomorrow);
  const [time, setTime] = useState(existingState.time || '17:00');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!date) {
      setError('请选择约会日期');
      return;
    }
    if (date < today) {
      setError('约会日期不能早于今天哦~');
      return;
    }
    if (!time) {
      setError('请选择约会时间');
      return;
    }
    setError('');
    navigate('/menu', { state: { date, time } });
  };

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

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2"
      >
        选个时间吧
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-muted-foreground text-sm text-center mb-8"
      >
        你什么时候有空呢？
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-sm space-y-5"
      >
        {/* Date picker */}
        <div className="space-y-2">
          <label
            htmlFor="date-input"
            className="block text-sm font-medium text-foreground"
          >
            📅 约会日期
          </label>
          <input
            id="date-input"
            type="date"
            value={date}
            min={today}
            onChange={(e) => {
              setDate(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
          />
        </div>

        {/* Time picker */}
        <div className="space-y-2">
          <label
            htmlFor="time-input"
            className="block text-sm font-medium text-foreground"
          >
            ⏰ 约会时间
          </label>
          <input
            id="time-input"
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
          />
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          aria-label="继续"
          className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-lg font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mt-4"
        >
          继续
        </button>
      </motion.div>
    </motion.div>
  );
}
