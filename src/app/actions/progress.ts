"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export async function updateProgress(userId: string, courseId: string, progress: number) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from("enrollments")
      .upsert({ 
        user_id: userId,
        course_id: courseId,
        progress,
        last_accessed: new Date().toISOString(),
        status: 'enrolled'
      }, { onConflict: 'user_id,course_id' });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Progress update error:", error);
    return { success: false, error: error.message };
  }
}
