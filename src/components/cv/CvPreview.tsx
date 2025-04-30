
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Save, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { jsPDF } from "jspdf";
import ReactMarkdown from 'react-markdown';

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
  
  const handleDownloadPDF = () => {
    if (!cvContent) {
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

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      // Set document properties for better ATS compatibility
      pdf.setProperties({
        title: 'Professional CV',
        subject: 'Curriculum Vitae',
        creator: 'CV Scribe',
        keywords: 'cv, resume, professional'
      });
      
      // Split the content by lines
      const contentLines = cvContent.split('\n');
      
      // Set initial position
      let yPosition = 40;
      const xPosition = 40;
      const pageWidth = pdf.internal.pageSize.getWidth() - 80;
      
      // Add content to PDF
      let fontSize = 12;
      let isBold = false;
      
      contentLines.forEach((line) => {
        // Handle headings (lines starting with #)
        if (line.startsWith('# ')) {
          fontSize = 18;
          isBold = true;
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'bold');
          line = line.substring(2); // Remove the # prefix
        } else if (line.startsWith('## ')) {
          fontSize = 16;
          isBold = true;
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'bold');
          line = line.substring(3); // Remove the ## prefix
        } else if (line.startsWith('### ')) {
          fontSize = 14;
          isBold = true;
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'bold');
          line = line.substring(4); // Remove the ### prefix
        } else if (line.startsWith('**') && line.endsWith('**')) {
          // Handle bold text
          isBold = true;
          pdf.setFont('helvetica', 'bold');
          line = line.substring(2, line.length - 2); // Remove the ** markers
        } else {
          // Regular text
          if (isBold) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            fontSize = 12;
            isBold = false;
          }
        }
        
        // Skip empty lines but add spacing
        if (line.trim() === '') {
          yPosition += 10;
          return;
        }
        
        // Add text to PDF
        pdf.text(line, xPosition, yPosition);
        
        // Increase y position for the next line
        yPosition += fontSize + 4;
        
        // Check if we need to add a new page
        if (yPosition > pdf.internal.pageSize.getHeight() - 40) {
          pdf.addPage();
          yPosition = 40;
        }
      });

      // Save the PDF
      pdf.save('cv.pdf');

      toast({
        title: "Success",
        description: "Your ATS-friendly CV has been downloaded as PDF"
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
              className="w-full h-[300px] overflow-auto p-4 border rounded-md bg-white"
            >
              <ReactMarkdown>{cvContent}</ReactMarkdown>
            </div>
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
          <Download className="mr-2 h-4 w-4" /> Export ATS-friendly PDF
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
