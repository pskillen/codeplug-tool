import { Table, Text, Title } from '@mantine/core';
import { getVarianceTable } from '../../content/help/radioVariance.ts';
import type { VarianceId } from '../../content/help/types.ts';

export interface FormatVarianceTableProps {
  varianceId: VarianceId;
}

export default function FormatVarianceTable({ varianceId }: FormatVarianceTableProps) {
  const table = getVarianceTable(varianceId);
  if (!table) return null;

  return (
    <>
      <Title order={5} mt="sm" mb="xs">
        {table.title}
      </Title>
      <Table striped withTableBorder withColumnBorders fz="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>OpenGD77</Table.Th>
            <Table.Th>DM32</Table.Th>
            <Table.Th>CHIRP</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {table.rows.map((row) => (
            <Table.Tr key={row.aspect}>
              <Table.Td>
                <Text fw={500} size="sm">
                  {row.aspect}
                </Text>
              </Table.Td>
              <Table.Td>{row.opengd77}</Table.Td>
              <Table.Td>{row.dm32}</Table.Td>
              <Table.Td>{row.chirp}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
