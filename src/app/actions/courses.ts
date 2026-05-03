"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export async function getTeacherCourseStats(teacherId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch courses created by this teacher
    const { data: courses, error: courseErr } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("created_by", teacherId);

    if (courseErr) throw courseErr;
    if (!courses || courses.length === 0) return { success: true, data: [] };

    const courseIds = courses.map((c: any) => c.id);

    // 2. Fetch enrollment counts for these courses
    const { data: enrollments, error: enrollErr } = await supabaseAdmin
      .from("enrollments")
      .select("course_id")
      .in("course_id", courseIds);

    if (enrollErr) throw enrollErr;

    // 3. Map them together
    const stats = courses.map((course: any) => ({
      ...course,
      studentCount: enrollments?.filter((e: any) => e.course_id === course.id).length || 0
    }));

    return { success: true, data: stats };
  } catch (error: any) {
    console.error("Error fetching teacher stats:", error);
    return { success: false, error: error.message };
  }
}
