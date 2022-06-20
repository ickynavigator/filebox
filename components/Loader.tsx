import { Center, Loader, MantineTheme } from '@mantine/core';

interface Props {
  loaderVariant?: MantineTheme['loader'];
}
const Index: React.FC<Props> = ({ loaderVariant = 'bars' }) => (
  <Center className="h-100">
    <Loader variant={loaderVariant} />
  </Center>
);

export default Index;
