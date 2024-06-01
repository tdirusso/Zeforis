import type { Task } from "./Task";
import type { Widget } from "./Widget";
import type { Folder } from "./Folder";
import { Tag } from "./Tag";
import { User } from "./User";
import { Invitation } from "./Invitation";

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
  invitations?: Invitation[];
  isInviteLinkEnabled?: boolean;
  inviteLinkHash?: string;
  allowedInviteDomains?: string;
  metadata?: {
    orgUsers: User[],
    orgOwnerPlan: string;
  };
};

export type GetEngagementsForOrgRequest = {
  orgId: string;
};


export interface UpdateEngagementRequest {
  name?: string;
  isInviteLinkEnabled?: boolean;
  allowedInviteDomains?: string;
};