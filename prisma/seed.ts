import { IFile, PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const path = './files.json';

  if (fs.existsSync(path)) {
    const { files } = (await import(path)) as { files: IFile[] };
    const response = await prisma.iFile.createMany({ data: files });
    // eslint-disable-next-line no-console
    console.log(response);
  } else {
    console.error('File not found');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
