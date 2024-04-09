import type { Task } from "./Task";
import type { Widget } from "./Widget";
import type { Folder } from "./Folder";
import { Tag } from "./Tag";
import { User } from "./User";

export interface Engagement {
  readonly id: number,
  name: string,
  orgId?: number,
  dateCreated?: Date;
  access?: string;
  role?: string;
  tasks?: Task[];
  widgets?: Widget[];
  folders?: Folder[];
  tags?: Tag[];
  metadata?: {
    orgUsers: User[],
    orgOwnerPlan: string;
  };
};

export type GetEngagementsForOrgRequest = {
  orgId: string;
};