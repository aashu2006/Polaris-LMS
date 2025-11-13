import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zkvjvypydiyfblrrguuv.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprdmp2eXB5ZGl5ZmJscnJndXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTQxMDcsImV4cCI6MjA2OTM3MDEwN30.wYjol10tw_C_2W25p-OLZ04mdYzezS19chNyzaOxVt0';
const supabaseServiceRoleKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprdmp2eXB5ZGl5ZmJscnJndXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc5NDEwNywiZXhwIjoyMDY5MzcwMTA3fQ.VQk9FcmpB7Oe4bNxjNarqO9BDLx52lpibG6MpONqMdY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseService = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
  : supabase;

export interface Batch {
  id: number;
  batch_name: string;
  academic_year: string;
  semester: number;
  created_at: string;
  deleted_at?: string;
}

export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  target_semester?: number;
  created_at: string;
  deleted_at?: string;
}

export interface CourseSection {
  id: number;
  course_id: number;
  theory_hours: number;
  practical_hours: number;
  created_at: string;
  deleted_at?: string;
  batch_id?: number;
}

export interface ClassSession {
  id: number;
  section_id: number;
  batch_id?: number;
  session_datetime: string;
  duration?: number;
  venue?: string;
  title?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendance_token?: string;
  token_expires_at?: string;
  session_type: 'theory' | 'practical' | 'lab';
  actual_faculty_id?: string;
  created_at: string;
  session_location_coordinates?: any;
  platform?: 'academics_live_class' | 'external_lms' | 'other';
  external_lms_url?: string;
  external_lms_session_id?: string;
}

export interface Profile {
  id: string;
  name?: string;
  created_at: string;
  deleted_at?: string;
  phone_number?: string;
  fcm_token?: string;
  is_hosteller?: boolean;
  device_id?: string;
}

export interface FacultySectionsMapping {
  id: number;
  section_id: number;
  faculty_id: string;
  created_at: string;
}

export interface CourseSectionWithRelations extends CourseSection {
  courses?: Course;
  batches?: Batch;
  faculty_sections_mapping?: FacultySectionsMapping[];
}

export interface ClassSessionWithDetails extends ClassSession {
  course_name: string;
  batch_name: string;
  faculty_name: string;
  section: CourseSectionWithRelations;
  course: Course;
  batch: Batch;
  profiles?: Profile | null;
}

