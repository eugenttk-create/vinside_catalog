const coordKey = (coords: [number, number, number, number]) => coords.join(",");

export const buildHoverTargetMap = (
  positions: {
    number: string | number;
    coordinates: [number, number, number, number];
  }[]
): Map<string, string> => {
  const numberToCoords = new Map<string, Set<string>>();
  for (const p of positions) {
    const k = String(p.number);
    if (!numberToCoords.has(k)) numberToCoords.set(k, new Set());
    numberToCoords.get(k)!.add(coordKey(p.coordinates));
  }

  const coordToNumbers = new Map<string, string[]>();
  for (const p of positions) {
    const ck = coordKey(p.coordinates);
    if (!coordToNumbers.has(ck)) coordToNumbers.set(ck, []);
    const arr = coordToNumbers.get(ck)!;
    const k = String(p.number);
    if (!arr.includes(k)) arr.push(k);
  }

  const result = new Map<string, string>();
  for (const [ck, numbers] of coordToNumbers.entries()) {
    const target = numbers.reduce((best, cur) => {
      const bestSize = numberToCoords.get(best)?.size ?? Infinity;
      const curSize = numberToCoords.get(cur)?.size ?? Infinity;
      return curSize < bestSize ? cur : best;
    });
    result.set(ck, target);
  }

  return result;
};
