
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  setJobDescription,
  onAnalyze,
  isLoading
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
        <CardDescription>
          Paste the job description to tailor your CV accordingly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste job description here..."
          className="h-[300px] resize-none"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onAnalyze} 
          disabled={!jobDescription.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? 'Analyzing...' : 'Generate Tailored CV'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobDescriptionInput;
