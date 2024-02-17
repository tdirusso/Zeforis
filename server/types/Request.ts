import { User } from "../../shared/types/User";

declare global {
  namespace Express {
    interface Request {
      userId: number,
      user: User,
      ownedOrg: {
        name: string,
        id: number;
      };
      engagementId: number;
      orgId: number;
    }
  }
}