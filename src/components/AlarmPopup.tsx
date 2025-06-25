
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, X } from "lucide-react";
import type { Alarm } from '../pages/Index';

interface AlarmPopupProps {
  alarm: Alarm;
  onSnooze: () => void;
  onDismiss: () => void;
}

export const AlarmPopup = ({ alarm, onSnooze, onDismiss }: AlarmPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Make the popup flash for attention
    const flashInterval = setInterval(() => {
      document.body.style.backgroundColor = document.body.style.backgroundColor === 'rgb(239, 68, 68)' ? '' : 'rgb(239, 68, 68)';
    }, 500);

    return () => {
      clearInterval(flashInterval);
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleSnooze = () => {
    setIsVisible(false);
    setTimeout(onSnooze, 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <Card className={`w-full max-w-md mx-4 transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      } animate-pulse`}>
        <CardHeader className="text-center bg-red-500 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-2">
            <Bell className="w-8 h-8 animate-bounce" />
          </div>
          <CardTitle className="text-2xl font-bold">
            ⏰ ALARM ALERT!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <div className="text-4xl font-mono font-bold text-gray-800">
              {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
            </div>
            {alarm.label && (
              <div className="text-lg text-gray-600 font-medium">
                {alarm.label}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            Wake up time!
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSnooze}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
              size="lg"
            >
              😴 Snooze (1 min)
            </Button>
            
            <Button
              onClick={handleDismiss}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="lg"
            >
              <X className="w-4 h-4 mr-1" />
              Dismiss
            </Button>
          </div>

          <div className="text-xs text-gray-400 mt-4">
            Click snooze to delay by 1 minute or dismiss to turn off the alarm
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
