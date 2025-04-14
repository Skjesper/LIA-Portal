'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import StudentProfileView from '@/components/Profile/Student/Student';

export default async function StudentProfilePage(props) {
  const params = await props.params;
  // Get the student ID from params
  const id = params.id;

  // Create a properly initialized cookie store
  const cookieStore = await cookies();
  
  // Create Supabase client with the cookie store
  const supabase = createServerComponentClient({ 
    cookies: () => cookieStore 
  });

  // Fetch the student data
  const { data: student, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !student) {
    return <div>Student hittades inte.</div>;
  }

  return <StudentProfileView student={student} />;
}