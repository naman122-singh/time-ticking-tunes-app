
import { useEffect, useState } from 'react';

interface ClockProps {
  currentTime: Date;
}

export const Clock = ({ currentTime }: ClockProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-6xl font-mono text-center text-gray-800">--:--:--</div>;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="text-center space-y-4">
      <div className="text-6xl md:text-7xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
        {formatTime(currentTime)}
      </div>
      <div className="text-lg text-gray-600 font-medium">
        {formatDate(currentTime)}
      </div>
      <div className="text-sm text-gray-500">
        System Time
      </div>
    </div>
  );
};
