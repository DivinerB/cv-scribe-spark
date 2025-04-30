
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
  
  const { error } = await supabase
    .from('application_questions')
    .upsert({
      user_id: userId,
      questions_data: questions,
      updated_at: new Date().toISOString()
    });
    
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
    .single();
    
  if (error && error.code !== 'PGSQL_NO_ROWS_RETURNED') throw error;
  
  return data?.questions_data || [];
};
