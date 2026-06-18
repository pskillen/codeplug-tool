import { Anchor, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export interface NotFoundEntityProps {
  entityLabel: string;
  listPath: string;
}

export default function NotFoundEntity({ entityLabel, listPath }: NotFoundEntityProps) {
  return (
    <Stack gap="sm">
      <Text>{entityLabel} not found.</Text>
      <Anchor component={Link} to={listPath}>
        Back to list
      </Anchor>
    </Stack>
  );
}
