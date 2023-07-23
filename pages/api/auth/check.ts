import { AUTH_COOKIE } from '>lib/constants';
import { Auth } from '>types';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'GET': {
      const authenticated = getCookie(AUTH_COOKIE, { req, res });

      if (!authenticated) {
        return res.status(401).json({
          message: Auth.Unauthorized,
        });
      }

      return res.status(200).json({ message: Auth.Authorized });
    }
    default: {
      return res.status(405).json({
        message: 'Method not allowed',
      });
    }
  }
}
