import { Form } from './_form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload',
};

function Page() {
  return <Form />;
}

export default Page;
