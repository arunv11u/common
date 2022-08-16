import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';
import { UserQuery } from 'keycloak-admin/lib/resources/users';
import UserRepresentation from 'keycloak-nodejs-admin-client/lib/defs/userRepresentation';
import { SSOConnect } from '..';
import { SSOAuth } from '../foundation';
import { SSOUserClient, SSOUserRole } from '../types';

interface SSODatabaseService {
    saveUser(userData: UserRepresentation): Promise<string>;
    updateUser(ssoId: string, query: any): Promise<void>;
    findUser(query: UserQuery): Promise<UserRepresentation[]>;
    findUserById(ssoId: string): Promise<UserRepresentation>;
    deleteUser(ssoId: string): Promise<void>;
    addUserRole(roleInfo: SSOUserRole): Promise<void>;
    listUserRole(roleInfo: SSOUserClient): Promise<RoleRepresentation[]>;
    deleteUserRole(roleInfo: SSOUserRole): Promise<void>;
    logoutUser(ssoId: string): Promise<void>;
};

class SSOService implements SSODatabaseService {

    private static _instance: SSOService;
    private _ssoConnect: SSOAuth;

    private constructor() {
        this._ssoConnect = SSOConnect.getInstance();
    };

    static getInstance(): SSOService {
        if (!SSOService._instance) SSOService._instance = new SSOService();

        return SSOService._instance;
    };

    /**
     * Save the user data initially.
     * @param userData 
     * @returns 
     */
    async saveUser(userData: UserRepresentation) {
        const ssoClient = this._ssoConnect.adminClient;
        const realmObj = { realm: this._ssoConnect.ssoRealmName };
        const keycloakUser = await ssoClient.users.create({ ...realmObj, ...userData });
        return keycloakUser.id;
    };

    /**
     * Get all the users that match the query
     * @param query 
     * @returns 
     */
    async findUser(query: UserQuery) {
        const ssoClient = this._ssoConnect.adminClient;
        const user = await ssoClient.users.find(query);
        return user;
    }

    /**
     * Get the user by the sso id
     * @param ssoId 
     * @returns 
     */
    async findUserById(ssoId: string) {
        const ssoClient = this._ssoConnect.adminClient;
        const user = await ssoClient.users.findOne({ id: ssoId });
        return user;
    }

    /**
     * Update the user based on the SSOId.
     * @param ssoId 
     * @param query 
     */
    async updateUser(ssoId: string, query: any) {
        const ssoClient = this._ssoConnect.adminClient;
        const user = await ssoClient.users.update({ id: ssoId }, query);
    }

    /**
     * Deleting the user based on id
     * @param ssoId - Unique user id from sso server
     */
    async deleteUser(ssoId: string) {
        const ssoClient = this._ssoConnect.adminClient;
        const user = await ssoClient.users.del({ id: ssoId });
    }

    /**
     * Add the client roles for user
     * @param roleInfo 
     */
    async addUserRole(roleInfo: SSOUserRole) {
        const ssoClient = this._ssoConnect.adminClient;
        const user = await ssoClient.users.addClientRoleMappings(roleInfo);
    }

    /**
     * List the client roles for user
     * @param roleInfo 
     */
    async listUserRole(roleInfo: SSOUserClient) {
        const ssoClient = this._ssoConnect.adminClient;
        const role = await ssoClient.users.listCompositeClientRoleMappings(roleInfo)
        return role;
    }

    /**
 * Delete the client roles for user
 * @param roleInfo 
 */
    async deleteUserRole(roleInfo: SSOUserRole) {
        const ssoClient = this._ssoConnect.adminClient;
        const user = await ssoClient.users.delClientRoleMappings(roleInfo)
    }

    async logoutUser(ssoId: string): Promise<void> {
        const ssoClient = this._ssoConnect.adminClient;
        
        await ssoClient.users.logout({ id: ssoId });
    };

};

export {
    SSOService,
    SSODatabaseService
};
