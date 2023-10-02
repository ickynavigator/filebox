import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const { files: data } = await import('./files.json');

  const response = await prisma.iFile.createMany({ data });

  // eslint-disable-next-line no-console
  console.log(response);
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
