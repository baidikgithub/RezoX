"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { Statistic, StatisticProps } from "antd";

interface AnimatedStatisticProps extends StatisticProps {
  value: number;
}

export default function AnimatedStatistic({
  value,
  ...props
}: AnimatedStatisticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Statistic
        {...props}
        value={value}
        formatter={() =>
          start ? (
            <CountUp end={value} duration={2} separator="," />
          ) : (
            "0"
          )
        }
      />
    </div>
  );
}
