
import { supabase } from '@/integrations/supabase/client';

export interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
}

export const saveQuestionsToSupabase = async (questions: QuestionAnswer[]) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('User not authenticated');
  }
  
  const userId = userData.user.id;
  
  // Check if the user already has questions saved
  const { data: existingData, error: checkError } = await supabase
    .from('application_questions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (checkError && checkError.code !== 'PGSQL_NO_ROWS_RETURNED') {
    throw checkError;
  }
  
  // If the user already has questions, update them; otherwise, insert a new row
  let error;
  
  if (existingData) {
    const { error: updateError } = await supabase
      .from('application_questions')
      .update({
        questions_data: questions,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('application_questions')
      .insert({
        user_id: userId,
        questions_data: questions,
        updated_at: new Date().toISOString()
      });
      
    error = insertError;
  }
  
  if (error) throw error;
  
  return true;
};

export const getQuestions = async (): Promise<QuestionAnswer[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('User not authenticated');
  }
  
  const userId = userData.user.id;
  
  const { data, error } = await supabase
    .from('application_questions')
    .select('questions_data')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error && error.code !== 'PGSQL_NO_ROWS_RETURNED') throw error;
  
  return data?.questions_data || [];
};
