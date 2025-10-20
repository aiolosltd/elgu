import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components/atoms/typography';
import { Button } from '@/components/atoms/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-grow items-center justify-center text-center py-12">
      {/* 404 Image */}
      <img
        src="/svg/404Error.svg"
        alt="404 Not Found"
        className="w-100 max-w-full mb-6"
      />

      {/* Text */}
      <Typography variant="h2" weight="bold" className="text-gray-800 mb-2" text='404 - Page Not Found' />
      
      <Typography as="p" className="text-gray-600 mb-2" text="The page you are looking for doesn't exist or has been moved." />

      {/* Back to home button */}
      <Button
        onClick={() => navigate('/')}
        variant="default" text="Go Back Home" />

    </div>
  );
};

export default NotFoundPage;
