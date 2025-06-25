
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface AlarmFormProps {
  onAddAlarm: (hour: number, minute: number, label?: string) => void;
}

export const AlarmForm = ({ onAddAlarm }: AlarmFormProps) => {
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [selectedMinute, setSelectedMinute] = useState<string>('');
  const [label, setLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHour || !selectedMinute) {
      toast({
        title: "Invalid Time",
        description: "Please select both hour and minute for the alarm.",
        variant: "destructive"
      });
      return;
    }

    const hour = parseInt(selectedHour);
    const minute = parseInt(selectedMinute);

    onAddAlarm(hour, minute, label || undefined);
    
    // Reset form
    setSelectedHour('');
    setSelectedMinute('');
    setLabel('');

    toast({
      title: "Alarm Added! ⏰",
      description: `Alarm set for ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    });
  };

  // Generate hour options (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate minute options (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hour">Hour (24-hour format)</Label>
          <Select value={selectedHour} onValueChange={setSelectedHour}>
            <SelectTrigger>
              <SelectValue placeholder="Select hour" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {hourOptions.map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {String(hour).padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minute">Minute</Label>
          <Select value={selectedMinute} onValueChange={setSelectedMinute}>
            <SelectTrigger>
              <SelectValue placeholder="Select minute" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {minuteOptions.map((minute) => (
                <SelectItem key={minute} value={minute.toString()}>
                  {String(minute).padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Alarm Label (Optional)</Label>
        <Input
          id="label"
          type="text"
          placeholder="e.g., Morning workout, Take medicine..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={50}
        />
      </div>

      <div className="text-center">
        <Button 
          type="submit" 
          className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
          disabled={!selectedHour || !selectedMinute}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Alarm
        </Button>
      </div>

      {selectedHour && selectedMinute && (
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            <strong>Preview:</strong> Alarm will ring at{' '}
            <span className="font-mono text-lg">
              {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
            </span>
            {label && <span className="text-blue-600"> - {label}</span>}
          </p>
        </div>
      )}
    </form>
  );
};
