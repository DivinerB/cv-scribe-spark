
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Save, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CvPreviewProps {
  cvContent: string;
  setCvContent: React.Dispatch<React.SetStateAction<string>>;
  onPromptUpdate: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const CvPreview: React.FC<CvPreviewProps> = ({
  cvContent,
  setCvContent,
  onPromptUpdate,
  onSave,
  isLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleDownloadPDF = async () => {
    if (!cvRef.current || !cvContent) {
      toast({
        title: "Error",
        description: "No CV content to download",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your CV"
      });

      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('tailored-cv.pdf');

      toast({
        title: "Success",
        description: "Your CV has been downloaded as PDF"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Tailored CV</CardTitle>
            <CardDescription>
              {isEditing ? "Edit directly or " : "Preview your CV and make changes if needed"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Done
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {isEditing ? (
            <textarea
              className="w-full h-[300px] p-4 border rounded-md resize-none"
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
            />
          ) : (
            <div 
              ref={cvRef}
              className="w-full h-[300px] overflow-auto p-4 border rounded-md bg-white whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: cvContent.replace(/\n/g, '<br/>') }}
            />
          )}
          {!cvContent && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-cv-muted">
              Your CV will appear here after generation
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80">
              <div className="h-8 w-8 rounded-full border-4 border-cv-primary border-t-transparent animate-spin mb-2"></div>
              <p className="text-cv-muted">Generating your CV...</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 w-full">
        <Button 
          className="w-full sm:w-auto" 
          onClick={onPromptUpdate}
          disabled={!cvContent || isLoading}
        >
          Improve with AI
        </Button>
        <Button 
          className="w-full sm:w-auto" 
          variant="outline" 
          onClick={handleDownloadPDF}
          disabled={!cvContent || isLoading}
        >
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
        <Button 
          className="w-full sm:w-auto" 
          variant="outline"
          onClick={onSave}
          disabled={!cvContent || isLoading}
        >
          <Save className="mr-2 h-4 w-4" /> Save CV
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CvPreview;
