import { Alert, Anchor } from '@mantine/core';
import BandPlanTable from '../../components/reference/BandPlanTable.tsx';
import { Page, PageHeader, PageSection } from '../../components/ui/index.ts';

const RSGB_BAND_PLAN_URL =
  'https://rsgb.services/public/bandplans/docs/240205_rsgb_band_plan_2024.pdf';

export default function BandPlan() {
  return (
    <Page>
      <PageHeader
        title="Band plan"
        description={
          <>
            UK Ofcom licence allocation ranges (not RSGB sub-band usage segments). Source:{' '}
            <Anchor href={RSGB_BAND_PLAN_URL} target="_blank" rel="noopener noreferrer">
              RSGB Band Plan (effective 1 Jan 2024)
            </Anchor>
            .
          </>
        }
      />

      <PageSection title="Allocation table">
        <BandPlanTable />
        <Alert color="gray" variant="light" mt="md">
          For programming convenience only. Not authoritative for on-air operation. Licence class,
          power, and geographic restrictions apply.
        </Alert>
      </PageSection>
    </Page>
  );
}
