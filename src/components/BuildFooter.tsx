import { Text } from '@mantine/core';

export default function BuildFooter() {
  return (
    <Text
      component="footer"
      aria-label="Build info"
      size="xs"
      c="dimmed"
      style={{
        position: 'fixed',
        right: '0.5rem',
        bottom: '0.5rem',
        pointerEvents: 'none',
      }}
    >
      {__BUILD_ENV__} · {__BUILD_VERSION__}
    </Text>
  );
}
