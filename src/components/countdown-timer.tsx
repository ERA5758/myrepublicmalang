
'use client';

import { useEffect, useState } from 'react';

type TimeUnitProps = {
  value: number;
  label: string;
};

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-bold text-primary tracking-tighter">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
  );
}

type CountdownTimerProps = {
  targetDate: string;
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!isClient) {
    return (
        <div className="grid grid-cols-4 gap-4 text-center">
            <TimeUnit value={0} label="Hari" />
            <TimeUnit value={0} label="Jam" />
            <TimeUnit value={0} label="Menit" />
            <TimeUnit value={0} label="Detik" />
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;
  
  const allUnits = [
    { value: days, label: "Hari" },
    { value: hours, label: "Jam" },
    { value: minutes, label: "Menit" },
    { value: seconds, label: "Detik" }
  ];

  const relevantUnits = days > 0 ? allUnits : allUnits.slice(1);

  if (days > 0) {
    return (
      <div className="grid grid-cols-4 gap-4 text-center">
        {relevantUnits.map(unit => <TimeUnit key={unit.label} value={unit.value} label={unit.label} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
        {relevantUnits.map(unit => <TimeUnit key={unit.label} value={unit.value} label={unit.label} />)}
    </div>
  );
}
