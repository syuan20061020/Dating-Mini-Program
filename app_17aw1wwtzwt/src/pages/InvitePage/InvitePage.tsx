import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';

const NO_TEXTS = ['不要', '再想想嘛', '点不到我', '真的不要吗'];

const HEART_IMG =
  '/spark/app/app_17aw1wwtzwt/runtime/api/v1/storage/object/bucket_aadkmxpi7lqds_static/static%2Faadkmwojlquag_ve_miaoda';

function getCornerPos(
  idx: number,
  containerRect: DOMRect,
  btnWidth: number,
  btnHeight: number,
) {
  const pad = 10;
  const cw = containerRect.width;
  const ch = containerRect.height;

  switch (idx) {
    case 0:
      return { left: pad, top: pad };
    case 1:
      return { left: cw - btnWidth - pad, top: pad };
    case 2:
      return { left: cw - btnWidth - pad, top: ch - btnHeight - pad };
    case 3:
      return { left: pad, top: ch - btnHeight - pad };
    default:
      return { left: pad, top: pad };
  }
}

export default function InvitePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const [dontClicked, setDontClicked] = useState(false);
  const [cornerIndex, setCornerIndex] = useState(0);
  const [noTextIdx, setNoTextIdx] = useState(0);
  const [yesStyle, setYesStyle] = useState<React.CSSProperties>({});
  const [noStyle, setNoStyle] = useState<React.CSSProperties>({});
  const [animating, setAnimating] = useState(false);

  const calcCorner = useCallback(
    (idx: number) => {
      const container = containerRef.current;
      const noBtn = noBtnRef.current;
      if (!container || !noBtn) return {};
      const cRect = container.getBoundingClientRect();
      const bRect = noBtn.getBoundingClientRect();
      return getCornerPos(idx, cRect, bRect.width, bRect.height);
    },
    [],
  );

  const handleYes = () => {
    navigate('/confirm');
  };

  const handleNo = () => {
    if (animating) return;

    const container = containerRef.current;
    const yesBtn = yesBtnRef.current;
    const noBtn = noBtnRef.current;
    if (!container || !yesBtn || !noBtn) return;

    const cRect = container.getBoundingClientRect();

    if (!dontClicked) {
      const yRect = yesBtn.getBoundingClientRect();
      const nRect = noBtn.getBoundingClientRect();

      setYesStyle({
        position: 'absolute',
        left: yRect.left - cRect.left,
        top: yRect.top - cRect.top,
        zIndex: 50,
      });
      setNoStyle({
        position: 'absolute',
        left: nRect.left - cRect.left,
        top: nRect.top - cRect.top,
      });

      setDontClicked(true);
      setAnimating(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const corner = getCornerPos(
            0,
            cRect,
            noBtn.getBoundingClientRect().width,
            noBtn.getBoundingClientRect().height,
          );
          setYesStyle({
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            transition: 'all 360ms ease',
          });
          setNoStyle({
            position: 'absolute',
            ...corner,
            transition: 'all 360ms ease',
          });
          setCornerIndex(0);
          setTimeout(() => setAnimating(false), 360);
        });
      });
    } else {
      const diagonalMap: Record<number, number> = { 0: 2, 1: 3, 2: 0, 3: 1 };
      const preferred = diagonalMap[cornerIndex];
      const nextCorner =
        preferred !== undefined && preferred !== cornerIndex
          ? preferred
          : (cornerIndex + 1) % 4;

      setNoTextIdx((prev) => (prev + 1) % NO_TEXTS.length);
      setAnimating(true);

      requestAnimationFrame(() => {
        const corner = getCornerPos(
          nextCorner,
          container.getBoundingClientRect(),
          noBtn.getBoundingClientRect().width,
          noBtn.getBoundingClientRect().height,
        );
        setNoStyle((prev) => ({
          ...prev,
          ...corner,
          transition: 'all 360ms ease',
        }));
        setCornerIndex(nextCorner);
        setTimeout(() => setAnimating(false), 360);
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (!dontClicked) return;
      const corner = calcCorner(cornerIndex);
      setNoStyle((prev) => ({
        ...prev,
        ...corner,
        transition: 'none',
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dontClicked, cornerIndex, calcCorner]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/5 flex flex-col items-center justify-center px-4 py-8 select-none"
    >
      {/* Illustration area */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Dashed circle */}
        <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-primary/25 animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-36 h-36 rounded-full border border-dashed border-primary/20 animate-[spin_15s_linear_infinite_reverse]" />

        {/* Sparkles */}
        <span
          className="absolute text-xl animate-pulse"
          style={{ top: -8, right: 20 }}
          aria-hidden="true"
        >
          ✨
        </span>
        <span
          className="absolute text-lg animate-pulse"
          style={{ bottom: 10, left: 16, animationDelay: '0.5s' }}
          aria-hidden="true"
        >
          ✨
        </span>

        {/* Heart image */}
        <Image
          src={HEART_IMG}
          alt="爱心插画"
          className="relative z-10 w-28 h-28 rounded-3xl object-cover shadow-lg"
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
        可以和我一起约会吗？
      </h1>
      <p className="text-muted-foreground text-sm md:text-base text-center mb-10">
        我已经准备好啦，就等你点头~
      </p>

      {/* Button area */}
      <div
        ref={containerRef}
        className="w-full min-h-[210px] relative"
        style={{ maxWidth: 400 }}
      >
        {!dontClicked ? (
          <div className="flex items-center justify-center gap-6 h-full min-h-[210px]">
            <button
              ref={yesBtnRef}
              onClick={handleYes}
              aria-label="愿意"
              className="px-10 py-3.5 rounded-full bg-primary text-primary-foreground text-lg font-semibold shadow-md hover:shadow-lg active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              愿意
            </button>
            <button
              ref={noBtnRef}
              onClick={handleNo}
              aria-label="不要"
              className="px-10 py-3.5 rounded-full bg-card text-foreground border border-border text-lg font-medium shadow-sm hover:shadow-md active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              不要
            </button>
          </div>
        ) : (
          <>
            <button
              ref={yesBtnRef}
              onClick={handleYes}
              aria-label="愿意"
              style={yesStyle}
              className="px-12 py-4 rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-lg hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              愿意
            </button>
            <button
              ref={noBtnRef}
              onClick={handleNo}
              aria-label={NO_TEXTS[noTextIdx]}
              style={noStyle}
              className="px-8 py-3 rounded-full bg-card text-foreground border border-border text-base font-medium shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary whitespace-nowrap"
            >
              {NO_TEXTS[noTextIdx]}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
