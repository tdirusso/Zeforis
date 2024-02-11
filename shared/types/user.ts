import type { Engagement } from './Engagement';
import type { Org } from './Org';

export type User = {
  readonly id: number,
  firstName?: string | undefined,
  lastName?: string | undefined,
  email: string,
  dateCreated?: Date,
  plan?: string,
  subscriptionStatus?: string,
  adminOfEngagements?: Engagement[];
  memberOfEngagements?: Engagement[];
  memberOfOrgs?: Org[];
  access?: string;
};