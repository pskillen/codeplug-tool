import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { Anchor, List, Text, Title } from '@mantine/core';

function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

const components: Components = {
  p: ({ children }) => (
    <Text size="sm" mb="sm">
      {children}
    </Text>
  ),
  h2: ({ children }) => (
    <Title order={3} mt="md" mb="xs">
      {children}
    </Title>
  ),
  h3: ({ children }) => (
    <Title order={4} mt="sm" mb="xs">
      {children}
    </Title>
  ),
  a: ({ href, children }) => {
    if (href && isInternalPath(href)) {
      return (
        <Anchor component={Link} to={href} size="sm">
          {children}
        </Anchor>
      );
    }
    return (
      <Anchor href={href} size="sm" target="_blank" rel="noopener noreferrer">
        {children}
      </Anchor>
    );
  },
  ul: ({ children }) => <List size="sm" mb="sm" withPadding children={children} />,
  li: ({ children }) => <List.Item>{children}</List.Item>,
};

export interface HelpMarkdownProps {
  content: string;
}

export default function HelpMarkdown({ content }: HelpMarkdownProps) {
  if (!content.trim()) return null;
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
