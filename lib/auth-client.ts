import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { accessControl, authRoles } from "@/lib/auth/permissions";

export const authClient = createAuthClient({
  plugins: [adminClient({ ac: accessControl, roles: authRoles })],
});
