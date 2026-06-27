import { describe, expect, it } from 'vitest';
import {
  formatLatLon,
  pipelineGeocodeResponseStep,
  pipelineGeocoderStep,
  pipelineLocatorStep,
} from './searchPipeline.ts';

describe('searchPipeline', () => {
  it('formats lat/lon with hemisphere', () => {
    expect(formatLatLon(52.9225, -1.4746)).toBe('52.9225° N, 1.4746° W');
  });

  it('builds geocoder step with provider name', () => {
    expect(pipelineGeocoderStep('photon', 'no Mapbox token').text).toContain('Photon');
    expect(pipelineGeocoderStep('photon', 'no Mapbox token').text).toContain('no Mapbox token');
  });

  it('builds geocode response step', () => {
    const step = pipelineGeocodeResponseStep('photon', 'Derby, United Kingdom', 52.92, -1.48);
    expect(step.text).toContain('Photon');
    expect(step.text).toContain('Derby, United Kingdom');
    expect(step.text).toContain('52.9200° N');
  });

  it('builds locator conversion step', () => {
    expect(pipelineLocatorStep('io92').text).toContain('IO92');
  });
});
