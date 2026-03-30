
import React, { useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Number of bokeh circles
const NUM_CIRCLES = 24;

// Helper to get a random value in a range
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate initial state for each circle

function generateBokehCircles() {
  return Array.from({ length: NUM_CIRCLES }).map(() => ({
    size: rand(18, 78),
    opacity: rand(0.18, 0.55),
    blur: rand(1, 3),
    // Start at a random position
    top: rand(0, 90),
    left: rand(0, 90),
    delay: rand(0, 3),
    duration: rand(4, 7), // slower zoom
    type: Math.random() < 0.33 ? 'ring' : 'filled', // ~1/3 are rings
  }));
}


const GoldSpatter: React.FC = () => {
  const [circles, setCircles] = React.useState<Array<any> | null>(null);
  const [alreadyBigIndices, setAlreadyBigIndices] = React.useState<Set<number> | null>(null);

  React.useEffect(() => {
    const generated = generateBokehCircles();
    setCircles(generated);
    // Pick 3-5 random indices
    const count = Math.floor(rand(3, 6));
    const indices = Array.from({ length: generated.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setAlreadyBigIndices(new Set(indices.slice(0, count)));
  }, []);

  if (!circles || !alreadyBigIndices) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {circles.map((circle, i) => (
        <BokehCircle key={i} {...circle} alreadyBig={alreadyBigIndices.has(i)} />
      ))}
    </div>
  );
};

// Animated bokeh circle component



const BokehCircle: React.FC<{
  size: number;
  opacity: number;
  blur: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
  type?: 'filled' | 'ring';
  alreadyBig?: boolean;
}> = ({ size, opacity, blur, top, left, delay, duration, type = 'filled', alreadyBig }) => {
  // Use animation controls for smooth, continuous movement
  const controls = useAnimation();
  const [pos, setPos] = React.useState({ top, left });
  const [first, setFirst] = React.useState(true);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const animateToNew = () => {
      const next = {
        top: Math.max(0, Math.min(90, pos.top + rand(-8, 8))),
        left: Math.max(0, Math.min(90, pos.left + rand(-8, 8))),
        scale: 1.2, // less aggressive zoom
        opacity: 0,
      };
      controls.start({
        top: `${next.top}%`,
        left: `${next.left}%`,
        scale: 1.2,
        opacity: 0,
        transition: {
          duration,
          ease: 'easeInOut',
        },
      }).then(() => {
        // Reset to small/opaque at new position, then animate again
        setPos(next);
        controls.set({
          top: `${next.top}%`,
          left: `${next.left}%`,
          scale: 0,
          opacity,
        });
        timeout = setTimeout(animateToNew, 10); // next frame
      });
    };
    if (first) {
      controls.set({
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        scale: alreadyBig ? 1.2 : 0,
        opacity: alreadyBig ? 0 : opacity,
      });
      setFirst(false);
      // If alreadyBig, wait for the duration before animating, so it stays big/faded for a while
      timeout = setTimeout(animateToNew, (alreadyBig ? duration : delay) * 1000);
    } else {
      timeout = setTimeout(animateToNew, delay * 1000);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, duration, opacity, delay, pos.top, pos.left, alreadyBig]);

  return (
    <motion.div
      initial={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        scale: alreadyBig ? 1.2 : 0,
        opacity: alreadyBig ? 0 : opacity,
      }}
      animate={controls}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        ...(type === 'filled'
          ? {
              background:
                'radial-gradient(circle, #FFD700 0%, #B8860B 60%, transparent 100%)',
            }
          : {
              background: 'transparent',
              border: `${Math.max(0.5, size * 0.04)}px solid #FFD700`, // much thinner border
              boxShadow: `0 0 ${size * 0.18}px ${size * 0.04}px #FFD70055`,
            }),
        filter: `blur(${blur}px)`,
        pointerEvents: 'none',
      }}
    />
  );
};

export default GoldSpatter;
