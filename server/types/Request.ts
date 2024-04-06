import { Org } from "../../shared/types/Org";

declare global {
  namespace Express {
    interface Request {
      userId: number,
      org: Org;
      orgId: number;
      engagementId: number;
      engagementName: string;
    }
  }
}