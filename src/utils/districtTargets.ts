import { DistrictInfo } from '../types';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtraData';

const CUSTOM_TARGETS_KEY = 'vidya_pravesh_custom_district_targets';

export function getCustomDistrictTargets(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CUSTOM_TARGETS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading custom district targets:', err);
    return {};
  }
}

export function saveCustomDistrictTarget(districtId: string, newTarget: number): Record<string, number> {
  const current = getCustomDistrictTargets();
  const updated = {
    ...current,
    [districtId]: Math.max(0, Math.round(newTarget)),
  };
  try {
    localStorage.setItem(CUSTOM_TARGETS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving district target:', err);
  }
  return updated;
}

export function saveAllCustomDistrictTargets(targetsMap: Record<string, number>): void {
  try {
    localStorage.setItem(CUSTOM_TARGETS_KEY, JSON.stringify(targetsMap));
  } catch (err) {
    console.error('Error saving all district targets:', err);
  }
}

export function resetCustomDistrictTargets(): void {
  try {
    localStorage.removeItem(CUSTOM_TARGETS_KEY);
  } catch (err) {
    console.error('Error resetting district targets:', err);
  }
}

/**
 * Returns MAHARASHTRA_DISTRICTS with custom totalSchoolsTarget overrides applied
 */
export function getEffectiveDistricts(): DistrictInfo[] {
  const customTargets = getCustomDistrictTargets();
  return MAHARASHTRA_DISTRICTS.map((dist) => {
    const customVal = customTargets[dist.id];
    const effectiveTarget = typeof customVal === 'number' && customVal >= 0 ? customVal : dist.totalSchoolsTarget;
    return {
      ...dist,
      totalSchoolsTarget: effectiveTarget,
    };
  });
}

/**
 * Calculates sum of all effective district targets across Maharashtra
 */
export function getEffectiveTotalStateTarget(): number {
  const districts = getEffectiveDistricts();
  return districts.reduce((sum, d) => sum + d.totalSchoolsTarget, 0);
}
