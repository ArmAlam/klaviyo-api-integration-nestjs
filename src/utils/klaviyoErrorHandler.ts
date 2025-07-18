import { HttpException, HttpStatus } from '@nestjs/common';

export const handleKlaviyoError = (error: any): never => {
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors.map((err) => ({
      code: err.code,
      title: err.title,
      message: err.detail,
    }));

    throw new HttpException(
      {
        success: false,
        message: 'Failed to fetch event count',
        error: errors,
      },
      error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  throw new HttpException(
    {
      success: false,
      message: 'Failed to fetch event count',
      error: [
        {
          code: 'unknown_error',
          title: 'Unknown Error',
          message: error.message || 'An unknown error occurred',
        },
      ],
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
