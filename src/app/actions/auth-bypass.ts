'use server';

import { getSupabaseAdmin as getSafeAdmin } from '@/lib/supabase';

const ALLOWED_TEST_EMAILS = [
  'teacher_test@taxnigeria.com',
  'student_test@taxnigeria.com',
  'new_student@example.com'
];

/**
 * Bypasses OTP verification for authorized test accounts.
 */
export async function authBypass(email: string, type: 'magiclink' = 'magiclink', metadata?: any) {
  const isAllowed = ALLOWED_TEST_EMAILS.includes(email) || email.endsWith('@taxnigeria.com');
  
  if (!isAllowed) {
    return { error: "This email is not authorized for development bypass." };
  }

  try {
    const supabaseAdmin = getSafeAdmin();

    // 1. Check if user already exists
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    let user = users.find((u: any) => u.email === email);

    // 2. If user doesn't exist and it's a signup, create them
    if (!user) {
      const { data: { user: newUser }, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: metadata || { role: 'student' },
        password: Math.random().toString(36).slice(-12) // Random dummy password
      });
      if (createError) throw createError;
      user = newUser;
    } else {
      // Ensure existing user is confirmed
      await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });
    }

    // 3. Generate a login link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError) throw linkError;

    // 4. Extract the token
    const hashedToken = linkData.properties.hashed_token;

    if (!hashedToken) {
      throw new Error("Failed to generate bypass token.");
    }

    return { token: hashedToken, type: 'magiclink' };
  } catch (err: any) {
    console.error("Auth bypass error:", err);
    return { error: err.message || "Failed to bypass authentication." };
  }
}
