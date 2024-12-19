import { UserRole } from "../../models/auth/user";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}
