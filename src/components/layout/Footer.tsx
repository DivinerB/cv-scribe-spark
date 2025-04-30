
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-cv-border bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-cv-muted text-sm">
          <p>&copy; {new Date().getFullYear()} CV Scribe. All rights reserved.</p>
          <p className="mt-2">Create tailored CVs with AI assistance</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
