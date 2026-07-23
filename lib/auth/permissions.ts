import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  client: ["read", "create", "update", "delete"],
  billing: ["read", "create", "refund"],
} as const;

export const accessControl = createAccessControl(statements);

export const adminRole = accessControl.newRole({
  ...adminAc.statements,
  client: ["read", "create", "update", "delete"],
  billing: ["read", "create", "refund"],
});

export const clientRole = accessControl.newRole({
  client: ["read"],
  billing: ["read", "create"],
});

export const salesRole = accessControl.newRole({
  client: ["read", "create", "update"],
  billing: ["read", "create"],
});

export const authRoles = {
  admin: adminRole,
  client: clientRole,
  sales: salesRole,
};
