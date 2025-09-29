import { NextRequest, NextResponse } from 'next/server';

declare module 'next' {
  // This is the default PageProps type that Next.js expects
  export type PageProps<T = any> = {
    params: { [key: string]: string | string[] };
    searchParams?: { [key: string]: string | string[] | undefined };
  };

  // For app router pages
  export interface Page<T = any> {
    (props: PageProps<T>): JSX.Element;
  }

  // For API routes
  export interface NextApiRequest extends NextRequest {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }

  export interface NextApiResponse<T = any> extends NextResponse {
    json: (body: T) => NextResponse<T>;
  }
}

// Extend the global NodeJS namespace for our custom types
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL?: string;
      // Add other environment variables here
    }
  }
}
