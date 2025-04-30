
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-cv-border bg-white">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-cv-primary" />
          <span className="font-bold text-xl text-cv-text">CV Scribe</span>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-cv-muted hover:text-cv-text"
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/saved')}
            className="text-cv-muted hover:text-cv-text"
          >
            Saved CVs
          </Button>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button variant="default" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
