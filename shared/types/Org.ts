import { User } from "./User";

export type Org = {
  readonly id: number,
  name: string,
  brandColor: string,
  logo?: string,
  ownerId?: number;
};

export type OrgUsersMap = {
  [key: number]: User;
};