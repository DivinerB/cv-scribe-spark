
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import JobDescriptionInput from '@/components/cv/JobDescriptionInput';
import CvPreview from '@/components/cv/CvPreview';
import CvPromptModal from '@/components/cv/CvPromptModal';
import { generateCvFromJobDescription, improveCvWithPrompt } from '@/services/openai';
import { saveCvToSupabase } from '@/services/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [cvContent, setCvContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [cvTitle, setCvTitle] = useState('');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    try {
      const generatedCv = await generateCvFromJobDescription(jobDescription);
      setCvContent(generatedCv);
      toast({
        title: "CV Generated Successfully",
        description: "Your CV has been tailored based on the job description.",
      });
    } catch (error) {
      console.error("Error generating CV:", error);
      toast({
        title: "Error",
        description: "Failed to generate CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptUpdate = async (prompt: string) => {
    if (!cvContent || !prompt) return;

    setIsLoading(true);
    setIsPromptModalOpen(false);
    
    try {
      const improvedCv = await improveCvWithPrompt(cvContent, prompt);
      setCvContent(improvedCv);
      toast({
        title: "CV Updated Successfully",
        description: "Your CV has been improved based on your prompt.",
      });
    } catch (error) {
      console.error("Error improving CV:", error);
      toast({
        title: "Error",
        description: "Failed to improve CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!cvContent) return;
    setIsSaveModalOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!cvContent || !cvTitle) return;

    setIsLoading(true);
    setIsSaveModalOpen(false);
    
    try {
      await saveCvToSupabase({
        title: cvTitle,
        content: cvContent,
        job_description: jobDescription,
      });
      toast({
        title: "CV Saved Successfully",
        description: "Your CV has been saved to your account.",
      });
    } catch (error) {
      console.error("Error saving CV:", error);
      toast({
        title: "Error",
        description: "Failed to save CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cv-text mb-2">CV Scribe</h1>
          <p className="text-cv-muted max-w-2xl mx-auto">
            Generate tailored CVs using AI. Paste a job description, and our AI will create a customized CV highlighting your relevant skills and experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <JobDescriptionInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
          <CvPreview
            cvContent={cvContent}
            setCvContent={setCvContent}
            onPromptUpdate={() => setIsPromptModalOpen(true)}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>

      <CvPromptModal
        isOpen={isPromptModalOpen}
        setIsOpen={setIsPromptModalOpen}
        onSubmit={handlePromptUpdate}
        isLoading={isLoading}
      />

      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Save Your CV</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter CV title"
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm} disabled={!cvTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
