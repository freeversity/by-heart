import {
  AWARED_PROB_EVEN,
  MASTERED_PROB_EVEN,
  UNKNOWN_PROB_EVEN,
} from '../consts/discovery';
import { Status } from '../db/db';

export function pickTermCategory({
  masteredCount,
  awaredCount,
  unknownCount,
  newCount,
}: {
  masteredCount: number;
  awaredCount: number;
  unknownCount: number;
  newCount: number;
}): Status | null {
  const totalAvailable = masteredCount + awaredCount + unknownCount + newCount;

  let masteredProb = Math.min(
    masteredCount / totalAvailable,
    MASTERED_PROB_EVEN,
  );
  let awaredProb = Math.min(awaredCount / totalAvailable, AWARED_PROB_EVEN);
  let unknownProb = Math.min(unknownCount / totalAvailable, UNKNOWN_PROB_EVEN);
  let newProb = Math.min(
    newCount / totalAvailable,
    1 - MASTERED_PROB_EVEN - AWARED_PROB_EVEN - UNKNOWN_PROB_EVEN,
  );

  const total = masteredProb + awaredProb + unknownProb + newProb;

  if (total < 1) {
    masteredProb /= total;
    awaredProb /= total;
    unknownProb /= total;
    newProb /= total;
  }

  const random = Math.random();

  if (random < masteredProb) {
    return Status.Mastered;
  }
  if (random < masteredProb + awaredProb) {
    return Status.Awared;
  }
  if (random < masteredProb + awaredProb + unknownProb) {
    return Status.Unknown;
  }
  return null;
}
