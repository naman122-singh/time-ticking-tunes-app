
import { useState, useEffect } from 'react';
import { Clock } from '../components/Clock';
import { AlarmForm } from '../components/AlarmForm';
import { AlarmList } from '../components/AlarmList';
import { AlarmPopup } from '../components/AlarmPopup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Alarm {
  id: string;
  hour: number;
  minute: number;
  active: boolean;
  label?: string;
}

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [triggerredAlarm, setTriggerredAlarm] = useState<Alarm | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load alarms from localStorage on component mount
  useEffect(() => {
    const savedAlarms = localStorage.getItem('alarmClockAlarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  // Save alarms to localStorage whenever alarms change
  useEffect(() => {
    localStorage.setItem('alarmClockAlarms', JSON.stringify(alarms));
  }, [alarms]);

  // Check for triggered alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Only check at the start of each minute (when seconds = 0)
      if (currentSecond === 0) {
        alarms.forEach(alarm => {
          if (alarm.active && alarm.hour === currentHour && alarm.minute === currentMinute) {
            setTriggerredAlarm(alarm);
            playAlarmSound();
            showBrowserNotification(alarm);
          }
        });
      }
    };

    checkAlarms();
  }, [currentTime, alarms]);

  const playAlarmSound = () => {
    // Create audio context for alarm sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 2000);
  };

  const showBrowserNotification = (alarm: Alarm) => {
    if (Notification.permission === 'granted') {
      new Notification('⏰ Alarm Alert!', {
        body: `Alarm set for ${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`,
        icon: '/placeholder.svg'
      });
    }
  };

  // Request notification permission on first load
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addAlarm = (hour: number, minute: number, label?: string) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      hour,
      minute,
      active: true,
      label
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
      )
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const snoozeAlarm = () => {
    if (triggerredAlarm) {
      const newMinute = (triggerredAlarm.minute + 1) % 60;
      const newHour = newMinute === 0 ? (triggerredAlarm.hour + 1) % 24 : triggerredAlarm.hour;
      
      setAlarms(prev => 
        prev.map(alarm => 
          alarm.id === triggerredAlarm.id 
            ? { ...alarm, hour: newHour, minute: newMinute }
            : alarm
        )
      );
      setTriggerredAlarm(null);
    }
  };

  const dismissAlarm = () => {
    if (triggerredAlarm) {
      setAlarms(prev => 
        prev.map(alarm => 
          alarm.id === triggerredAlarm.id 
            ? { ...alarm, active: false }
            : alarm
        )
      );
      setTriggerredAlarm(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Alarm Clock</h1>
          <p className="text-gray-600">Your personal time management companion</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Clock currentTime={currentTime} />
          </CardContent>
        </Card>

        <Tabs defaultValue="alarms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alarms">My Alarms</TabsTrigger>
            <TabsTrigger value="add">Add Alarm</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alarms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Active Alarms ({alarms.filter(a => a.active).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlarmList 
                  alarms={alarms}
                  onToggle={toggleAlarm}
                  onDelete={deleteAlarm}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⏰ Set New Alarm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlarmForm onAddAlarm={addAlarm} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {triggerredAlarm && (
          <AlarmPopup
            alarm={triggerredAlarm}
            onSnooze={snoozeAlarm}
            onDismiss={dismissAlarm}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
