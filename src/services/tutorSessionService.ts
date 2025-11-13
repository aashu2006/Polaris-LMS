import { supabaseService } from '../lib/supabase';
import type { ClassSessionWithDetails, FacultySectionsMapping } from '../lib/supabase';

export class TutorSessionService {
  static async getSessionsForFaculty(facultyId: string): Promise<ClassSessionWithDetails[]> {
    try {
      const { data: facultySections, error: facultyError } = await supabaseService
        .from<FacultySectionsMapping>('faculty_sections_mapping')
        .select('section_id')
        .eq('faculty_id', facultyId);

      if (facultyError) throw facultyError;

      const sectionIds =
        (facultySections || [])
          .map((section) => section.section_id)
          .filter((sectionId): sectionId is number => typeof sectionId === 'number');

      if (sectionIds.length === 0) {
        return [];
      }

      const { data: sessions, error } = await supabaseService
        .from<ClassSessionWithDetails>('class_sessions')
        .select(`
          *,
          course_sections(
            id,
            course_id,
            batch_id,
            courses(
              id,
              course_name,
              course_code
            ),
            batches(
              id,
              batch_name,
              academic_year,
              semester
            ),
            faculty_sections_mapping(
              faculty_id
            )
          ),
          profiles!actual_faculty_id(
            id,
            name
          )
        `)
        .in('section_id', sectionIds)
        .eq('status', 'upcoming')
        .order('session_datetime', { ascending: true });

      if (error) throw error;

      const filteredSessions = (sessions || []).filter((session: any) => {
        if (!session.actual_faculty_id) {
          return true;
        }
        return session.actual_faculty_id === facultyId;
      });

      const enrichedSessions =
        filteredSessions.map((session: any) => {
          const section = session.course_sections;
          const course = section?.courses;
          const batch = section?.batches;

          if (!section || !course || !batch) {
            return null;
          }

          return {
            ...session,
            course_name: course.course_name,
            batch_name: batch.batch_name,
            faculty_name: session.profiles?.name || 'Assigned Faculty',
            section,
            course,
            batch,
          };
        }) || [];

      return enrichedSessions.filter(
        (session): session is ClassSessionWithDetails => session !== null,
      );
    } catch (error) {
      console.error('Error fetching faculty sessions:', error);
      throw error;
    }
  }
}

