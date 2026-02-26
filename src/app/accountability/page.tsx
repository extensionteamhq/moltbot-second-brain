'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface AccountabilityEntry {
  date: string;
  checkin?: {
    workout?: { asked: boolean; response?: string };
    morning_reading?: { asked: boolean; response?: string };
  };
  checkinType?: string;
  response?: { bible?: string; gym?: string };
  [key: string]: unknown;
}

type ViewMode = 'week' | 'month';

export default function AccountabilityPage() {
  const [data, setData] = useState<AccountabilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  useEffect(() => {
    fetch('/api/accountability')
      .then(res => res.json())
      .then(json => {
        setData(json.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load accountability data:', err);
        setLoading(false);
      });
  }, []);

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Sunday
    return { start, end };
  };

  const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInRange = (start: Date, end: Date) => {
    const days: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const getEntryForDate = (dateStr: string): AccountabilityEntry | undefined => {
    return data.find(d => d.date === dateStr);
  };

  const parseResponse = (entry: AccountabilityEntry) => {
    // Handle different data formats
    if (entry.checkin?.morning_reading?.response) {
      return {
        bible: entry.checkin.morning_reading.response.toLowerCase().includes('yes') || 
               entry.checkin.morning_reading.response.toLowerCase().includes('✅') ||
               entry.checkin.morning_reading.response === 'Sup' ? true : false,
        gym: entry.checkin.workout?.response ? 
             (entry.checkin.workout.response.toLowerCase().includes('yes') || 
              entry.checkin.workout.response.toLowerCase().includes('✅') ||
              entry.checkin.workout.response === 'Sup' ? true : false) : null
      };
    }
    if (entry.response?.bible !== undefined || entry.response?.gym !== undefined) {
      return {
        bible: entry.response.bible,
        gym: entry.response.gym
      };
    }
    return { bible: null, gym: null };
  };

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTitle = () => {
    if (viewMode === 'week') {
      const { start, end } = getWeekRange(currentDate);
      const startMonth = start.toLocaleString('default', { month: 'short' });
      const endMonth = end.toLocaleString('default', { month: 'short' });
      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  };

  const getDisplayDays = () => {
    if (viewMode === 'week') {
      const { start, end } = getWeekRange(currentDate);
      return getDaysInRange(start, end);
    } else {
      const { start, end } = getMonthRange(currentDate);
      return getDaysInRange(start, end);
    }
  };

  const displayDays = getDisplayDays();

  const totals = displayDays.reduce((acc, day) => {
    const dateStr = formatDate(day);
    const entry = getEntryForDate(dateStr);
    const parsed = entry ? parseResponse(entry) : { bible: null, gym: null };
    
    if (parsed.bible === true) acc.bible++;
    if (parsed.gym === true) acc.gym++;
    
    return acc;
  }, { bible: 0, gym: 0 });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Accountability Grid</h1>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm bg-[var(--card)] hover:bg-[var(--border)] rounded-lg transition"
        >
          Today
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-[var(--card)] rounded-lg transition"
        >
          ← Prev
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[var(--card)] rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-md transition ${
                viewMode === 'week' ? 'bg-[var(--accent)] text-white' : ''
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-md transition ${
                viewMode === 'month' ? 'bg-[var(--accent)] text-white' : ''
              }`}
            >
              Month
            </button>
          </div>
          <span className="text-lg font-semibold">{getTitle()}</span>
        </div>

        <button
          onClick={() => navigate(1)}
          className="p-2 hover:bg-[var(--card)] rounded-lg transition"
        >
          Next →
        </button>
      </div>

      {/* Grid */}
      <div className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)]">
        <div className="grid grid-cols-8 border-b border-[var(--border)]">
          <div className="p-3 text-sm font-semibold text-[var(--muted)]">Day</div>
          <div className="p-3 text-sm font-semibold text-center">📖<br/>Bible/Reading</div>
          <div className="p-3 text-sm font-semibold text-center">🏋️<br/>Gym</div>
        </div>
        
        {displayDays.map((day, idx) => {
          const dateStr = formatDate(day);
          const entry = getEntryForDate(dateStr);
          const parsed = entry ? parseResponse(entry) : { bible: null, gym: null };
          const isToday = formatDate(new Date()) === dateStr;
          
          return (
            <div 
              key={dateStr} 
              className={`grid grid-cols-8 border-b border-[var(--border)] last:border-b-0 ${
                isToday ? 'bg-[var(--accent)]/10' : ''
              }`}
            >
              <div className="p-3 text-sm">
                <div className="font-medium">
                  {day.toLocaleString('default', { weekday: 'short' })}
                </div>
                <div className={`text-xs ${isToday ? 'text-[var(--accent)] font-bold' : 'text-[var(--muted)]'}`}>
                  {day.getDate()}
                </div>
              </div>
              <div className="p-3 flex items-center justify-center">
                {parsed.bible === true && <span className="text-green-500 text-xl">✅</span>}
                {parsed.bible === false && <span className="text-red-500 text-xl">❌</span>}
                {parsed.bible === null && <span className="text-[var(--muted)]">-</span>}
              </div>
              <div className="p-3 flex items-center justify-center">
                {parsed.gym === true && <span className="text-green-500 text-xl">✅</span>}
                {parsed.gym === false && <span className="text-red-500 text-xl">❌</span>}
                {parsed.gym === null && <span className="text-[var(--muted)]">-</span>}
              </div>
            </div>
          );
        })}

        {/* Totals Row */}
        <div className="grid grid-cols-8 bg-[var(--sidebar)] border-t-2 border-[var(--border)]">
          <div className="p-3 text-sm font-bold">TOTAL</div>
          <div className="p-3 text-center font-bold text-green-500">
            {totals.bible}/{displayDays.length}
          </div>
          <div className="p-3 text-center font-bold text-green-500">
            {totals.gym}/{displayDays.length}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm text-[var(--muted)]">
        <span>✅ = Completed</span>
        <span>❌ = Missed</span>
        <span>- = No data</span>
      </div>
    </div>
  );
}
