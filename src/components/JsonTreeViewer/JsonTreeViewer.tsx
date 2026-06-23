import JsonView from '@uiw/react-json-view';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { Paper, ScrollArea } from '@mantine/core';

export interface JsonTreeViewerProps {
  value: unknown;
}

function toJsonViewValue(data: unknown): object {
  if (data !== null && typeof data === 'object') {
    return data as object;
  }
  return { value: data };
}

export default function JsonTreeViewer({ value }: JsonTreeViewerProps) {
  return (
    <Paper withBorder p="md">
      <ScrollArea.Autosize mah="70vh" type="auto">
        <JsonView
          value={toJsonViewValue(value)}
          style={githubDarkTheme}
          collapsed={2}
          displayDataTypes={false}
        />
      </ScrollArea.Autosize>
    </Paper>
  );
}
