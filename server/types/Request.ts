import { Engagement } from "../../shared/types/Engagement";
import { Org } from "../../shared/types/Org";

declare global {
  namespace Express {
    interface Request {
      userId: number,
      org: Org;
      orgId: number;
      engagementId: number;
      engagement: Engagement;
    }
  }
} 