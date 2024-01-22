import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const files = await prisma.iFile.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  const obj = {
    files,
  };

  fs.writeFile('./prisma/files.json', JSON.stringify(obj, null, '\t'), err => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('Saved!');
  });
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
