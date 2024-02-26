import type { Engagement } from './Engagement';
import type { Org } from './Org';

export interface User {
  readonly id: number,
  firstName?: string | undefined,
  lastName?: string | undefined,
  email: string,
  dateCreated?: Date,
  plan?: string,
  subscriptionStatus?: string | null,
  adminOfEngagements?: Engagement[];
  memberOfEngagements?: Engagement[];
  memberOfOrgs?: Org[];
  access?: string;
  role?: string;
};