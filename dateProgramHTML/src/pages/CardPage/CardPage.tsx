import { useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Loader2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { toast } from 'sonner';

const HEART_IMG =
  '/spark/app/app_17aw1wwtzwt/runtime/api/v1/storage/object/bucket_aadkmxpi7lqds_static/static%2Faadkmxg7gd4io_ve_miaoda';

function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 120;
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 35);
  ctx.bezierCurveTo(0, 12, -35, -25, -58, 12);
  ctx.bezierCurveTo(-82, 48, -35, 82, 0, 105);
  ctx.bezierCurveTo(35, 82, 82, 48, 58, 12);
  ctx.bezierCurveTo(35, -25, 0, 12, 0, 35);
  ctx.closePath();
  ctx.fillStyle = '#e91e63';
  ctx.fill();
  ctx.restore();
}

export default function CardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    date?: string;
    time?: string;
    menu?: { id: number; name: string; desc: string; emoji: string };
  } | null;

  const date = state?.date || '未选择';
  const time = state?.time || '未选择';
  const menu = state?.menu || null;

  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateAndSave = useCallback(async () => {
    setSaving(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('生成卡片失败');
        setSaving(false);
        return;
      }

      // Pink gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, 1440);
      gradient.addColorStop(0, '#fce4ec');
      gradient.addColorStop(0.4, '#f8bbd0');
      gradient.addColorStop(1, '#f48fb1');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1440);

      // Decorative dots
      ctx.fillStyle = 'rgba(233, 30, 99, 0.08)';
      for (let i = 0; i < 30; i++) {
        const dx = Math.random() * 1080;
        const dy = Math.random() * 1440;
        const dr = 20 + Math.random() * 40;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Heart
      drawHeart(ctx, 540, 300, 160);

      // Title
      ctx.fillStyle = '#880e4f';
      ctx.font = 'bold 72px "Noto Sans SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('我们的约会', 540, 520);

      // Divider line
      ctx.strokeStyle = 'rgba(233, 30, 99, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.moveTo(200, 580);
      ctx.lineTo(880, 580);
      ctx.stroke();
      ctx.setLineDash([]);

      // DATE
      ctx.fillStyle = '#4a1525';
      ctx.font = 'bold 48px "Noto Sans SC", sans-serif';
      ctx.fillText('📅  DATE', 540, 680);

      ctx.fillStyle = '#880e4f';
      ctx.font = '56px "Noto Sans SC", sans-serif';
      ctx.fillText(date, 540, 760);

      // TIME
      ctx.fillStyle = '#4a1525';
      ctx.font = 'bold 48px "Noto Sans SC", sans-serif';
      ctx.fillText('⏰  TIME', 540, 880);

      ctx.fillStyle = '#880e4f';
      ctx.font = '56px "Noto Sans SC", sans-serif';
      ctx.fillText(time, 540, 960);

      // MENU
      if (menu) {
        ctx.fillStyle = '#4a1525';
        ctx.font = 'bold 48px "Noto Sans SC", sans-serif';
        ctx.fillText('🍽️  MENU', 540, 1100);

        ctx.fillStyle = '#880e4f';
        ctx.font = '56px "Noto Sans SC", sans-serif';
        ctx.fillText(`${menu.emoji} ${menu.name}`, 540, 1180);

        ctx.fillStyle = '#6b2d3e';
        ctx.font = '36px "Noto Sans SC", sans-serif';
        ctx.fillText(menu.desc, 540, 1250);
      }

      // Footer
      ctx.fillStyle = 'rgba(136, 14, 79, 0.5)';
      ctx.font = '28px "Noto Sans SC", sans-serif';
      ctx.fillText('期待与你相见 ❤️', 540, 1380);

      // Export as blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) {
        toast.error('生成图片失败');
        setSaving(false);
        return;
      }

      // Try system share
      const file = new File([blob], '约会卡片.png', { type: 'image/png' });
      if (
        typeof navigator !== 'undefined' &&
        'share' in navigator &&
        'canShare' in navigator &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: '我们的约会',
            files: [file],
          });
          toast.success('分享成功！');
          setSaving(false);
          return;
        } catch {
          // Fall through to download
        }
      }

      // Download fallback
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '约会卡片.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('卡片已下载！');
    } catch (err) {
      toast.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }, [date, time, menu]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/5 flex flex-col items-center px-4 py-8"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="返回"
        className="absolute top-4 left-4 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>

      {/* Hidden canvas for offscreen rendering */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="max-w-sm w-full pt-12">
        {/* Heart illustration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <Image
            src={HEART_IMG}
            alt="爱心"
            className="w-24 h-24 rounded-3xl object-cover shadow-lg"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8"
        >
          我们的约会
        </motion.h1>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 space-y-5"
        >
          {/* DATE */}
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              📅
            </span>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                DATE
              </p>
              <p className="text-lg font-semibold text-foreground">{date}</p>
            </div>
          </div>

          {/* TIME */}
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              ⏰
            </span>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                TIME
              </p>
              <p className="text-lg font-semibold text-foreground">{time}</p>
            </div>
          </div>

          {/* MENU */}
          {menu && (
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {menu.emoji}
              </span>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  MENU
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {menu.name}
                </p>
                <p className="text-sm text-muted-foreground">{menu.desc}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Save button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          onClick={generateAndSave}
          disabled={saving}
          aria-label="保存卡片"
          className="w-full mt-8 py-3.5 rounded-full bg-[#f9a825] text-white text-lg font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9a825] flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              保存卡片
            </>
          )}
        </motion.button>

        <p className="text-xs text-muted-foreground text-center mt-3">
          点击保存，生成约会卡片图片
        </p>
      </div>
    </motion.div>
  );
}
