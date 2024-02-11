import type { Engagement } from './Engagement';

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
  access?: string;
};