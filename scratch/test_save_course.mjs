import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key) process.env[key.trim()] = value.join('=').trim();
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testFinalSave() {
  console.log('\n=== FINAL SAVE TEST (matching frontend exactly) ===\n');

  const modules = [
    {
      id: 'new-m1',
      title: 'Introduction to Nigerian Tax',
      isOpen: true,
      lessons: [
        { id: 'new-l1', title: 'Welcome', type: 'video', duration: '5:00', isFree: true, content: { videoUrl: '', videoNotes: '' } }
      ]
    }
  ];

  // Compute totalSeconds exactly like the frontend does
  const totalSeconds = modules.reduce((acc, m) => {
    return acc + m.lessons.reduce((lAcc, l) => {
      const parts = (l.duration || '0:00').split(':').map(Number);
      if (parts.length === 2) return lAcc + parts[0] * 60 + parts[1];
      if (parts.length === 3) return lAcc + parts[0] * 3600 + parts[1] * 60 + parts[2];
      return lAcc;
    }, 0);
  }, 0);

  const payload = {
    title: 'Test Course: Nigerian Tax Basics',
    description: 'A test course about Nigerian tax fundamentals.',
    created_by: 'dd3eb937-417e-44ba-93ef-d776347d5ab6', // teacher auth ID
    status: 'draft',
    difficulty_level: 'Beginner',
    estimated_duration: totalSeconds, // INTEGER now, not string
    outlines: modules.map(m => m.title), // array of strings
    learning_objectives: [],             // empty array
    content: JSON.stringify({
      category_id: 'pit',
      price: 0,
      image_url: '',
      lessons_count: 1,
      subtitle: 'Learn Nigerian tax basics',
      currency: 'NGN',
      modules: modules,
    }),
  };

  console.log('estimated_duration (seconds):', totalSeconds);
  console.log('outlines:', payload.outlines);
  console.log('\nSending insert...');

  const { data, error } = await supabase.from('courses').insert(payload).select().single();

  if (error) {
    console.error('\n❌ STILL FAILING:', error.message, '|', error.details, '|', error.hint);
  } else {
    console.log('\n✅ SUCCESS! Course ID:', data.id, '\nTitle:', data.title);
    console.log('The save logic is working correctly!');
    await supabase.from('courses').delete().eq('id', data.id);
    console.log('(Test record cleaned up)');
  }
}

testFinalSave();
