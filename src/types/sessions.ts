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
  batch_id?: number;                    
  batch_name?: string;                  
  cohort?: string;                      
  faculty_name?: string;                
  course_code?: string;                 
  course_sections?: any;                
  [key: string]: any;                   
}

export interface UiSession {
  id: number;
  title: string;
  instructor: string;
  subject: string;
  date: string;
  time: string;
  status: 'live' | 'rescheduled' | 'upcoming' | 'completed';
  action: 'Join Now' | 'Go Live' | 'Calendar' | 'View';
  note?: string;
}