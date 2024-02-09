import { Request } from "express";

export interface CheckAuthRequest extends Request {
  userId?: number,
  userObject?: {};
}

export interface CheckEngagementAdminRequest extends Request {
  userId?: number,
  userObject?: {};
  engagementId?: number,
  orgId?: number;
}

export interface CheckEngagementMemberRequest extends Request {
  userId?: number,
  userObject?: {};
  engagementId?: number,
  orgId?: number;
}

export interface CheckOrgOwnerRequest extends Request {
  userId?: number,
  userObject?: {};
  ownedOrg?: {
    name: string,
    id: number;
  };
}