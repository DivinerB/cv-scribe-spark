
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
}

interface QuestionAnswerFormProps {
  onSave: (qa: QuestionAnswer[]) => void;
  initialQuestions?: QuestionAnswer[];
}

const QuestionAnswerForm: React.FC<QuestionAnswerFormProps> = ({ 
  onSave, 
  initialQuestions = [] 
}) => {
  const [questions, setQuestions] = useState<QuestionAnswer[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const { toast } = useToast();

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    const newId = Date.now().toString();
    setQuestions([...questions, { id: newId, question: newQuestion, answer: '' }]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAnswerChange = (id: string, answer: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, answer } : q));
  };

  const handleSave = () => {
    if (questions.length === 0) {
      toast({
        title: "No Questions",
        description: "Add some questions before saving",
        variant: "destructive"
      });
      return;
    }

    onSave(questions);
    toast({
      title: "Saved",
      description: "Your questions and answers have been saved"
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Application Questions</CardTitle>
        <CardDescription>
          Add common application questions and prepare your answers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Add a new question..." 
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddQuestion} size="sm">
            <Plus size={16} className="mr-1" /> Add
          </Button>
        </div>

        {questions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No questions added yet. Add questions above to get started.
          </div>
        )}

        {questions.map((q) => (
          <div key={q.id} className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-base">{q.question}</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleRemoveQuestion(q.id)}
              >
                <X size={16} />
              </Button>
            </div>
            <Textarea
              placeholder="Your answer..."
              value={q.answer}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={handleSave}
          disabled={questions.length === 0}
        >
          <Save className="mr-2 h-4 w-4" /> Save Answers
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionAnswerForm;
