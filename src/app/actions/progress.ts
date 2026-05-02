"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export async function updateProgress(userId: string, courseId: string, progress: number) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from("enrollments")
      .update({ 
        progress,
        last_accessed: new Date().toISOString()
      })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Progress update error:", error);
    return { success: false, error: error.message };
  }
}
