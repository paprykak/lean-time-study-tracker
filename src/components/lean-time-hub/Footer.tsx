import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 mt-8">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        Designed for Operations by Patryk Korpyta |{' '}
        <a
          href="https://patrykkorpyta.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          patrykkorpyta.pl
        </a>
      </div>
    </footer>
  );
};

export default Footer;
