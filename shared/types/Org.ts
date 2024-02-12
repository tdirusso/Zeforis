import { User } from "./User";

export type Org = {
  readonly id: number,
  name?: string,
  brandColor: '#3365f6',
  logo?: string,
  ownerId?: number;
};

export type OrgUsersMap = {
  [key: number]: User;
};