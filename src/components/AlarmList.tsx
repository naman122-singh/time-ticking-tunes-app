
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Alarm } from '../pages/Index';

interface AlarmListProps {
  alarms: Alarm[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlarmList = ({ alarms, onToggle, onDelete }: AlarmListProps) => {
  const handleToggle = (alarm: Alarm) => {
    onToggle(alarm.id);
    const newStatus = !alarm.active ? 'activated' : 'deactivated';
    toast({
      title: `Alarm ${newStatus}`,
      description: `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')} ${newStatus}`,
    });
  };

  const handleDelete = (alarm: Alarm) => {
    onDelete(alarm.id);
    toast({
      title: "Alarm Deleted",
      description: `Alarm for ${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')} has been removed`,
      variant: "destructive"
    });
  };

  if (alarms.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-medium mb-2">No alarms set</h3>
        <p>Add your first alarm to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alarms.map((alarm) => (
        <Card 
          key={alarm.id} 
          className={`transition-all duration-200 ${
            alarm.active 
              ? 'border-blue-200 bg-blue-50/50 shadow-sm' 
              : 'border-gray-200 bg-gray-50/50'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-gray-800">
                    {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
                  </div>
                  {alarm.label && (
                    <div className="text-sm text-gray-600 mt-1">
                      {alarm.label}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    alarm.active ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {alarm.active ? 'Active' : 'Inactive'}
                  </span>
                  <Switch
                    checked={alarm.active}
                    onCheckedChange={() => handleToggle(alarm)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(alarm)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center text-sm text-gray-500 mt-4">
        {alarms.filter(a => a.active).length} of {alarms.length} alarms active
      </div>
    </div>
  );
};
