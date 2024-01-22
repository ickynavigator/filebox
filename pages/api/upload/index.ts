import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_PERSONAL_ACCESS_KEY,
  secretAccessKey: process.env.AWS_PERSONAL_SECRET_KEY,
  signatureVersion: 'v4',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST': {
      try {
        const { name, type } = req.body;

        const fileParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: name,
          Expires: 600,
          ContentType: type,
        };

        const url = await s3.getSignedUrlPromise('putObject', fileParams);

        return res.status(200).json({ url });
      } catch (err) {
        console.error(err);

        return res.status(500).json({ message: err });
      }
    }
    default: {
      return res.status(405).json({
        message: 'Method not allowed',
      });
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Set desired value here
    },
  },
};
