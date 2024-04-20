import type { Metadata } from 'next';
import { getTagsCached } from '~/actions/tags';
import { Form } from './_form';

export const metadata: Metadata = {
  title: 'Upload',
};

async function Page() {
  const tags = await getTagsCached();

  return <Form tags={tags} />;
}

export default Page;
