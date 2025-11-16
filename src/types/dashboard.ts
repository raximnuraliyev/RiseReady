import type { LucideProps } from 'lucide-react'
import { type ReactElement } from 'react'

export interface UserStats {
  focus: {
    totalSessions: number;
    streak: number;
  };
  wellbeing: {
    checkIns: number;
    streak: number;
  };
  skills: {
    total: number;
    inProgress: number;
  };
  career: {
    tasks: number;
    completed: number;
  };
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  type: 'calendar' | 'task';
}

export interface MetricCard {
  id: string;
  label: string;
  value: number;
  icon: (props: LucideProps) => ReactElement;
  accent: string;
}

export interface StatsCardProps {
  icon: ReactElement;
  title: string;
  value: string | number;
  path: string;
  color?: string;
}