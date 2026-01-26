"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface StatCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function useCountUp(end: number, duration: number = 2) {
  const count = useMotionValue(0);
  const rounded = useSpring(count, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    count.set(end);
  }, [count, end]);

  return rounded;
}

export function StatCounter({ end, suffix = "", duration = 2 }: StatCounterProps) {
  const count = useCountUp(end, duration);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = count.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [count]);

  return (
    <motion.span className="font-playfair text-4xl md:text-5xl font-bold text-[#D4AF37]">
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

interface StatsSectionProps {
  attendees: number;
  raised: number;
  years: number;
}

export function StatsSection({ attendees, raised, years }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <StatCounter end={attendees} suffix="+" />
        <div className="text-lg md:text-xl text-[#f5f5f5]/80 mt-2">Attendees</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <StatCounter end={raised} suffix="K" />
        <div className="text-lg md:text-xl text-[#f5f5f5]/80 mt-2">Raised</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <StatCounter end={years} />
        <div className="text-lg md:text-xl text-[#f5f5f5]/80 mt-2">Years Impact</div>
      </motion.div>
    </div>
  );
}
