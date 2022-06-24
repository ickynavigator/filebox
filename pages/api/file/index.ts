import dbConnect from '>lib/mongodb';
import File from '>models/File';
import { IFile, IFileReturn } from '>types/File';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  switch (req.method) {
    case 'POST': {
      try {
        const file = req.body;

        const newFile = new File<IFile>(file);
        const savedFile = await newFile.save();

        return res.status(201).json(savedFile);
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while saving' });
      }
    }
    case 'GET': {
      try {
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
          result.files = await File.find({ $or: keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

          const count = await File.countDocuments({ $or: keyword });

          result.page = page;
          result.pages = Math.ceil(count / pageSize);
        } else {
          result.files = await File.find({ $or: keyword });
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
