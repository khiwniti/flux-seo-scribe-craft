
import { useState } from 'react';
import { AutoGenHistoryEntry } from '../types';

export const useAutoGeneration = () => {
  const [autoGenEnabled, setAutoGenEnabled] = useState(false);
  const [autoGenFrequency, setAutoGenFrequency] = useState('weekly');
  const [autoGenTime, setAutoGenTime] = useState('09:00');
  const [autoGenDay, setAutoGenDay] = useState('monday');
  const [autoGenTopics, setAutoGenTopics] = useState('');
  const [autoGenKeywords, setAutoGenKeywords] = useState('');
  const [autoGenHistory, setAutoGenHistory] = useState<AutoGenHistoryEntry[]>([]);
  const [nextScheduledRun, setNextScheduledRun] = useState<Date | null>(null);

  const toggleAutoGeneration = () => {
    setAutoGenEnabled(!autoGenEnabled);
    
    if (!autoGenEnabled) {
      // Calculate next scheduled run
      const now = new Date();
      const nextRun = new Date(now);
      
      if (autoGenFrequency === 'daily') {
        nextRun.setDate(now.getDate() + 1);
      } else {
        nextRun.setDate(now.getDate() + 7);
      }
      
      const [hours, minutes] = autoGenTime.split(':');
      nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      setNextScheduledRun(nextRun);
    } else {
      setNextScheduledRun(null);
    }
  };

  return {
    autoGenEnabled,
    autoGenFrequency,
    setAutoGenFrequency,
    autoGenTime,
    setAutoGenTime,
    autoGenDay,
    setAutoGenDay,
    autoGenTopics,
    setAutoGenTopics,
    autoGenKeywords,
    setAutoGenKeywords,
    autoGenHistory,
    setAutoGenHistory,
    nextScheduledRun,
    toggleAutoGeneration
  };
};
