import { type DefStatus, Status } from '../../db/db';

export function pickStatus(statuses?: DefStatus[]) {
  if (!statuses) return null;

  if (!statuses.length) return 'new';

  const statusesSet = new Set(statuses.map(({ status }) => status) ?? []);

  if (statusesSet.has(Status.Mastered)) return Status.Mastered;
  if (statusesSet.has(Status.Awared)) return Status.Awared;
  if (statusesSet.has(Status.Unknown)) return Status.Unknown;
  if (statusesSet.has(Status.Excluded)) return Status.Excluded;

  return null;
}
