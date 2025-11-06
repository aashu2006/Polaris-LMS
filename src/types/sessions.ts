export interface ApiSession {
  id: number;
  session_datetime: string;
  duration: number | string;
  is_live?: boolean;
  status?: string;
  course_name?: string;
  course_id?: number;
  section_id?: number;
  venue?: string;
  session_type?: string;
  actual_faculty_id?: string;
  created_at?: string;
  rescheduled_date_time?: string | null;
  rescheduled_count?: number | null;
  [key: string]: any; // Allow additional properties
}

export interface UiSession {
  id: number;
  title: string;
  instructor: string;
  subject: string;
  date: string;
  time: string;
  status: 'live' | 'rescheduled' | 'upcoming' | 'completed';
  action: 'Join Now' | 'Calendar' | 'View';
  note?: string;
}

