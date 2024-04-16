import type { Metadata } from 'next';
import { Form } from './_form';

export const metadata: Metadata = {
  title: 'Upload',
};

function Page() {
  return <Form />;
}

export default Page;
