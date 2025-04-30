
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CvPromptModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const CvPromptModal: React.FC<CvPromptModalProps> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  isLoading
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Improve Your CV with AI</DialogTitle>
          <DialogDescription>
            Describe how you'd like to improve your CV, and our AI will make the changes.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="e.g. 'Make it more concise', 'Focus more on leadership skills', 'Add more technical details'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[150px]"
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? 'Processing...' : 'Improve CV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CvPromptModal;
