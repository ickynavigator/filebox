import dbConnect from '>lib/mongodb';
import File from '>models/File';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  switch (req.method) {
    case 'PUT': {
      try {
        const { id } = req.query;
        const file = await File.findById(id);

        if (!file) {
          return res.status(404).json({ error: 'File not found' });
        }

        const updatedFile = await File.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        return res.status(200).json(updatedFile);
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while saving' });
      }
    }
    case 'GET': {
      try {
        const { id } = req.query;
        const file = await File.findById(id);

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
        const { id } = req.query;
        const file = await File.findById(id);

        if (!file) {
          return res.status(404).json({ error: 'File not found' });
        }

        await File.findByIdAndDelete(id);

        return res.status(200).json({ message: 'File deleted' });
      } catch (err: unknown) {
        console.error(err);

        return res
          .status(500)
          .json({ error: 'An error occurred while deleting' });
      }
    }
    default: {
      return res.status(405).json({
        message: 'Method not allowed',
      });
    }
  }
}
