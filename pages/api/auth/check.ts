import { AUTH_COOKIE } from '>lib/constants';
import { hashPassword } from '>lib/hash';
import { Auth } from '>types';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

const { PASSWORD } = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'GET': {
      const password = getCookie(AUTH_COOKIE, { req, res });

      if (typeof password !== 'string') {
        return res.status(401).json({
          message: Auth.Unauthorized,
        });
      }

      if (!PASSWORD) {
        return res.status(500).json({
          error: 'Internal Server Error',
        });
      }

      const compared = password === hashPassword(PASSWORD);

      if (!compared) {
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
