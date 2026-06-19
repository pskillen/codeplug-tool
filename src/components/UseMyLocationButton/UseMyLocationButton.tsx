import { Button, Stack, Text } from '@mantine/core';
import { useGeolocation } from '../../hooks/useGeolocation.ts';

export interface UseMyLocationButtonProps {
  onLocation: (lat: number, lon: number) => void;
  disabled?: boolean;
}

export default function UseMyLocationButton({ onLocation, disabled }: UseMyLocationButtonProps) {
  const { requestLocation, loading, error, accuracyMeters } = useGeolocation();

  const handleClick = async () => {
    const result = await requestLocation();
    if (result) {
      onLocation(result.lat, result.lon);
    }
  };

  return (
    <Stack gap={4}>
      <Button
        type="button"
        variant="light"
        loading={loading}
        disabled={disabled}
        onClick={() => void handleClick()}
      >
        Use my location
      </Button>
      {error ? (
        <Text size="sm" c="red">
          {error}
        </Text>
      ) : null}
      {!error && accuracyMeters != null && Number.isFinite(accuracyMeters) ? (
        <Text size="xs" c="dimmed">
          ±{Math.round(accuracyMeters)} m
        </Text>
      ) : null}
    </Stack>
  );
}
