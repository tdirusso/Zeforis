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
  access?: string;
  role?: string;
  orgs?: Org[];
};

export interface RegisterRequest {
  googleCredential?: string,
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
};