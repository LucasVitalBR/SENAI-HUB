export interface ClassItem {
  date?: Date; // Only used when imported from Excel
  timeStart: string;
  timeEnd: string;
  subject: string;
  class: string;
  lab: string;
  students: number;
  instructor?: string;
}

export interface WeekSchedule {
  [dayIndex: number]: ClassItem[];
}

export interface UserProfile {
  name: string;
  role: string;
  tag: string;
  discipline: string;
  avatar: string;
  initials: string;
  schedule: {
    current: WeekSchedule;
    next: WeekSchedule;
  };
}

export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  urgency: 'high' | 'normal';
  time: string;
  author?: string;
}

export interface LabItem {
  name: string;
  cap: number;
  resp: string;
  status: 'ocupado' | 'livre';
  schedules: string[];
}

export interface SimulatedWeek {
  dates: number[];
  monthNum: number; // 0-indexed, 6 = Julho
  monthYear: string;
}

export interface ColumnMap {
  date: number;
  time: number;
  instructor: number;
  subject: number;
  class: number;
  room: number;
}
