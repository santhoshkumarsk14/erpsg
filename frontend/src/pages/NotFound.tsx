import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Page not found
          </h2>
          <p className="mt-6 text-base text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-10 flex justify-center space-x-3">
            <Button onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              Go home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;