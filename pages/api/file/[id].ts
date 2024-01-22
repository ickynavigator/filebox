import prisma from '>lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Queries {
  PUT: {
    query: {
      id: string;
    };
  };
  GET: {
    query: {
      id: string;
    };
  };
  DELETE: {
    query: {
      id: string;
    };
  };
}

const isParam = <M extends keyof Queries>(
  param: unknown,
  method: M,
): param is Queries[M]['query'] => {
  if (typeof param !== 'object' || param === null) {
    return false;
  }

  switch (method) {
    case 'PUT': {
      return 'id' in param;
    }
    case 'GET': {
      return 'id' in param;
    }
    case 'DELETE': {
      return 'id' in param;
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
    case 'PUT': {
      try {
        if (!isParam(req.query, req.method)) {
          return res.status(400).json({
            error: 'Invalid Parameters',
          });
        }

        const { id } = req.query;

        const file = await prisma.iFile.findUnique({
          where: {
            id,
          },
        });

        if (!file) {
          return res.status(404).json({ error: 'File not found' });
        }

        const updatedFile = await prisma.iFile.update({
          where: {
            id,
          },
          data: {
            ...req.body,
          },
        });

        return res.status(200).json(updatedFile);
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while updating the file' });
      }
    }
    case 'GET': {
      try {
        if (!isParam(req.query, req.method)) {
          return res.status(400).json({
            error: 'Invalid Parameters',
          });
        }

        const { id } = req.query;
        const file = await prisma.iFile.findUnique({
          where: {
            id,
          },
        });

        if (!file) {
          return res.status(404).json({ error: 'File not found' });
        }

        return res.status(200).json(file);
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while fetching file' });
      }
    }
    case 'DELETE': {
      try {
        if (!isParam(req.query, req.method)) {
          return res.status(400).json({
            error: 'Invalid Parameters',
          });
        }

        const { id } = req.query;
        const file = await prisma.iFile.findUnique({
          where: {
            id,
          },
        });

        if (!file) {
          return res.status(404).json({ error: 'File not found' });
        }

        await prisma.iFile.delete({
          where: {
            id,
          },
        });

        return res.status(200).json({ message: 'File deleted' });
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while deleting the file' });
      }
    }
    default: {
      return res.status(405).json({
        message: 'Method not allowed',
      });
    }
  }
}
