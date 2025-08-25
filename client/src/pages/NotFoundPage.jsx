import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <p className="text-2xl mt-4 text-muted-foreground">Page Not Found</p>
      <p className="mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/">
        <Button className="mt-6">Go Back Home</Button>
      </Link>
    </div>
  );
};


export default NotFoundPage;
