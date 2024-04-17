import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  ListItem,
  Center,
  Box,
} from '@mantine/core';
import { IconCircleCheck, IconHourglass } from '@tabler/icons-react';
import Link from 'next/link';
import ColorSchemeToggle from '~/components/colorSchemeToggle';
import { auth } from '~/lib/auth';
import classes from '~/app/page.module.css';

const iconProps = {
  style: { width: rem(15), height: rem(15) },
  stroke: 2,
};

function CompletedIcon() {
  return (
    <ThemeIcon size={24} radius="xl">
      <IconCircleCheck {...iconProps} />
    </ThemeIcon>
  );
}

function OngoingIcon() {
  return (
    <ThemeIcon color="yellow" size={24} radius="xl">
      <IconHourglass {...iconProps} />
    </ThemeIcon>
  );
}

export default async function Page() {
  const session = await auth();

  return (
    <Center h="100%">
      <Container size="md">
        <Group>
          <Box maw={rem(480)}>
            <Title className={classes.title} fw={900} lh={1.2}>
              A <span className={classes.highlight}>modern</span> file
              sharing/drop box application
            </Title>

            <Text c="dimmed" mt="md">
              Stores Files. Can use tags to organize/share them. Built with
              Next.js, AWS S3(changing to R2 soon) and Mantine.
            </Text>

            <List mt={30} spacing="sm" size="sm" icon={<CompletedIcon />}>
              <ListItem>
                <b>Share Files</b> - Allow anyone easily access your files
              </ListItem>
              <ListItem>
                <b>Easy Login</b> - Just a single password to login
              </ListItem>
              <ListItem icon={<OngoingIcon />}>
                <b>Auto remove files</b> - coming soon?
              </ListItem>
            </List>
            <Group mt={30}>
              {session?.user != null ? (
                <Button
                  component={Link}
                  href="/files"
                  radius="xl"
                  size="md"
                  className={classes.control}
                >
                  View Files
                </Button>
              ) : (
                <Button
                  component={Link}
                  href="/auth/signin"
                  radius="xl"
                  size="md"
                  className={classes.control}
                >
                  Login
                </Button>
              )}

              <Button
                component={Link}
                href="https://github.com/ickynavigator/filebox"
                target="_blank"
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Source code
              </Button>
              <ColorSchemeToggle />
            </Group>
          </Box>

          <Image
            src="/header-1.svg"
            className={classes.image}
            alt="Header 1"
            w={rem(376)}
            h={rem(356)}
          />
        </Group>
      </Container>
    </Center>
  );
}
