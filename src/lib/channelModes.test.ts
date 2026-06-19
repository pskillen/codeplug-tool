import { describe, expect, it } from 'vitest';
import {
  CHANNEL_MODES,
  isAnalogMode,
  isDigitalMode,
  isDmrMode,
  mapLegacyChannelMode,
  mapModeToOpenGd77ChannelType,
  mapOpenGd77ChannelType,
  modeColor,
  modeFilterOptions,
  modeLabel,
} from './channelModes.ts';

describe('channelModes', () => {
  it('defines ten modes matching the reference doc', () => {
    expect(CHANNEL_MODES).toHaveLength(10);
    expect(CHANNEL_MODES.map((m) => m.id)).toEqual([
      'fm',
      'am',
      'ssb-usb',
      'ssb-lsb',
      'dmr',
      'ysf',
      'dstar',
      'm17',
      'tetra',
      'other',
    ]);
  });

  it('returns labels and colours', () => {
    expect(modeLabel('dmr')).toBe('DMR');
    expect(modeColor('fm')).toBe('#f0c419');
    expect(modeColor('dstar')).toBe('#7950f2');
    expect(modeColor('m17')).toBe('#12b886');
  });

  it('classifies analog and digital modes', () => {
    expect(isAnalogMode('fm')).toBe(true);
    expect(isAnalogMode('ssb-lsb')).toBe(true);
    expect(isAnalogMode('dmr')).toBe(false);
    expect(isDigitalMode('ysf')).toBe(true);
    expect(isDigitalMode('dstar')).toBe(true);
    expect(isDigitalMode('m17')).toBe(true);
    expect(isDigitalMode('fm')).toBe(false);
    expect(isDmrMode('dmr')).toBe(true);
    expect(isDmrMode('ysf')).toBe(false);
  });

  it('maps OpenGD77 channel types', () => {
    expect(mapOpenGd77ChannelType('Digital')).toBe('dmr');
    expect(mapOpenGd77ChannelType('Analogue')).toBe('fm');
    expect(mapOpenGd77ChannelType('Analog')).toBe('fm');
    expect(mapOpenGd77ChannelType('')).toBe('other');
  });

  it('maps modes back to OpenGD77 export wire values', () => {
    expect(mapModeToOpenGd77ChannelType('dmr')).toBe('Digital');
    expect(mapModeToOpenGd77ChannelType('fm')).toBe('Analogue');
    expect(mapModeToOpenGd77ChannelType('ysf')).toBe('Digital');
    expect(mapModeToOpenGd77ChannelType('dstar')).toBe('Digital');
    expect(mapModeToOpenGd77ChannelType('m17')).toBe('Digital');
    expect(mapModeToOpenGd77ChannelType('other')).toBe('other');
  });

  it('migrates legacy v2 mode values', () => {
    expect(mapLegacyChannelMode('analogue')).toBe('fm');
    expect(mapLegacyChannelMode('digital')).toBe('dmr');
    expect(mapLegacyChannelMode('other')).toBe('other');
    expect(mapLegacyChannelMode('dmr')).toBe('dmr');
    expect(mapLegacyChannelMode('unknown')).toBe('other');
  });

  it('provides filter options for all modes', () => {
    expect(modeFilterOptions()).toHaveLength(10);
    expect(modeFilterOptions().find((o) => o.value === 'dstar')?.label).toBe('D-STAR');
  });
});
