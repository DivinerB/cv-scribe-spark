
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCvsFromSupabase, type CvData } from '@/services/supabase';
import { FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SavedCVs = () => {
  const [cvs, setCvs] = useState<CvData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const fetchedCvs = await getCvsFromSupabase();
        setCvs(fetchedCvs);
      } catch (error) {
        console.error("Error fetching CVs:", error);
        toast({
          title: "Error",
          description: "Failed to load saved CVs.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCvs();
  }, [toast]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cv-text mb-2">Your Saved CVs</h1>
          <p className="text-cv-muted">Access and manage your previously created CVs</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-cv-primary border-t-transparent animate-spin"></div>
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-cv-border">
            <FileText className="mx-auto h-16 w-16 text-cv-muted" />
            <h2 className="mt-4 text-xl font-medium text-cv-text">No CVs found</h2>
            <p className="mt-2 text-cv-muted">You haven't saved any CVs yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/')}
            >
              Create a CV
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <Card key={cv.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="truncate">{cv.title}</CardTitle>
                  <CardDescription>Created: {formatDate(cv.created_at)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 overflow-hidden text-cv-muted text-sm">
                    <div dangerouslySetInnerHTML={{ 
                      __html: cv.content.substring(0, 200).replace(/\n/g, '<br/>') + '...' 
                    }} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate(`/cv/${cv.id}`)}>
                    View
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/edit/${cv.id}`)}>
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedCVs;
