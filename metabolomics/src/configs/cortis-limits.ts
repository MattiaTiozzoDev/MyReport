export type CortisStatus = 'low' | 'normal' | 'high';

export const CORTIS_LIMITS = {
  '1': { inf: 3, sup: 6 },
  '2': { inf: 4, sup: 10 },
  '3': { inf: 3, sup: 6 },
  '4': { inf: 0.8, sup: 3.5 },
  '5': { inf: 0.1, sup: 2.5 },
};

export function getCortisStatus(
  id: string,
  value: unknown,
): CortisStatus | null {
  const limit = CORTIS_LIMITS[id];
  const num = Number(value);
  if (!limit || value == null || isNaN(num)) return null;
  if (num < limit.inf) return 'low';
  if (num > limit.sup) return 'high';
  return 'normal';
}
