import React from 'react';

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Lean Time Study Tracker
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
