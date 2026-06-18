import { Container, Stack, Title } from '@mantine/core';
import type { ReactNode } from 'react';

export interface ReportPageProps {
  title: string;
  children: ReactNode;
}

export default function ReportPage({ title, children }: ReportPageProps) {
  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        <Title order={1}>{title}</Title>
        {children}
      </Stack>
    </Container>
  );
}
