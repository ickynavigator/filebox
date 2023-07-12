import prisma from '>lib/prisma';
import { IFileReturn, isIFile } from '>types/File';
import { IFile } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Queries {
  POST: {
    query: Record<string, never>;
    body: BetterOmit<IFile, 'id'>;
  };
  GET: {
    query: {
      pageSize: string;
      pageNumber: string;
      noPaginate: string;
      param: string;
      keyword: string;
    };
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
      return isIFile(body);
    }
    case 'GET': {
      return true;
    }
    default: {
      return false;
    }
  }
};

const isParam = <M extends keyof Queries>(
  query: unknown,
  method: M,
): query is Queries[M]['query'] => {
  if (typeof query !== 'object' || query === null) {
    return false;
  }

  switch (method) {
    case 'POST': {
      return true;
    }
    case 'GET': {
      return (
        'pageSize' in query &&
        'pageNumber' in query &&
        'noPaginate' in query &&
        'param' in query &&
        'keyword' in query
      );
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
      try {
        if (!isBody(req.body, req.method)) {
          return res.status(400).json({
            error: 'Invalid Body',
          });
        }

        const file = req.body;

        const newFile = await prisma.iFile.create({
          data: file,
        });

        return res.status(201).json(newFile);
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while saving' });
      }
    }
    case 'GET': {
      try {
        if (!isParam(req.query, req.method)) {
          return res.status(400).json({
            error: 'Invalid Parameters',
          });
        }

        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.pageNumber) || 1;
        const noPaginate = !(Boolean(req.query.noPaginate) ?? true);
        const param = String(req.query.param) || '';
        const regOpt = 'gim';

        let keyword = [{}];

        if (req.query.keyword) {
          const kwSearch = { $regex: req.query.keyword, $options: regOpt };

          keyword = [
            { name: kwSearch },
            { description: kwSearch },
            { url: kwSearch },
          ];

          const specificQuery: { [k: string]: typeof kwSearch } = {};

          if (param) {
            specificQuery[param] = kwSearch;
            keyword.push({ ...specificQuery });
          }
        }

        const result: IFileReturn = { files: [] };

        if (noPaginate) {
          result.files = await prisma.iFile.findMany({
            where: {
              OR: keyword,
            },
            take: pageSize,
            skip: pageSize * (page - 1),
          });

          const count = await prisma.iFile.count({
            where: {
              OR: keyword,
            },
          });

          result.page = page;
          result.pages = Math.ceil(count / pageSize);
        } else {
          result.files = await prisma.iFile.findMany({
            where: {
              OR: keyword,
            },
          });
        }

        if (result.files.length === 0) {
          return res.status(200).json({ error: 'No files found' });
        }

        return res.status(200).json(result);
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while saving' });
      }
    }
    default: {
      return res.status(405).json({
        message: 'Method not allowed',
      });
    }
  }
}
