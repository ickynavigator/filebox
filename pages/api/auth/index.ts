import { AUTH_COOKIE } from '>lib/constants';
import { compareHash, hashPassword } from '>lib/hash';
import { Auth } from '>types';
import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

const { PASSWORD } = process.env;

interface Queries {
  POST: {
    query: Record<string, never>;
    body: {
      password: string;
    };
  };
  DELETE: {
    query: Record<string, never>;
    body: Record<string, never>;
  };
}

const isBody = <M extends keyof Queries>(
  body: unknown,
  method: M,
): body is Queries[M]['body'] => {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  switch (method) {
    case 'POST': {
      return 'password' in body;
    }
    case 'DELETE': {
      return true;
    }
    default: {
      return false;
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST': {
      if (!isBody(req.body, req.method)) {
        return res.status(400).json({
          error: 'Invalid Parameters',
        });
      }

      const { password } = req.body;

      if (!PASSWORD) {
        return res.status(500).json({
          error: 'Internal Server Error',
        });
      }

      const compared = compareHash(password, hashPassword(PASSWORD));

      if (!compared) {
        return res.status(401).json({
          message: Auth.Unauthorized,
        });
      }

      setCookie(AUTH_COOKIE, hashPassword(password), {
        req,
        res,
        httpOnly: true,
        maxAge: 60 * 60,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json({
        message: Auth.Authorized,
      });
    }
    case 'DELETE': {
      if (!isBody(req.query, req.method)) {
        return res.status(400).json({
          error: 'Invalid Parameters',
        });
      }

      setCookie(AUTH_COOKIE, '', {
        req,
        res,
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json({
        message: 'Logged out succesfully',
      });
    }
    default: {
      return res.status(405).json({
        message: 'Method not allowed',
      });
    }
  }
}
