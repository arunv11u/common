import { RoleMappingPayload } from "keycloak-admin/lib/defs/roleRepresentation";

export interface SSOUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface SSOUserRole {
  id: string;
  clientUniqueId: string;
  roles: RoleMappingPayload[];
}

export interface SSOUserClient {
  id: string;
  clientUniqueId: string;
}