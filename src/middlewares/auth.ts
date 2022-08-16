import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { join } from 'path';
import { GenericValidationError, Nconf } from '..';
import { Model } from 'mongoose';
import { MongooseService, SSOService } from '../services';


const mongooseService = MongooseService.getInstance();


interface UserPayload {
    sub: string;
    azp: string;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
    typ: 'Bearer';
    realm_access: object;
    resource_access: object;
};

interface CurrentUser<T> {
    user: T;
};


interface AuthMiddleware {
    checkCurrentUser<T>(req: Request, User: Model<T>): Promise<Record<string, any>>;
    currentUser<T>(User: Model<T>): (req: Request, res: Response<any, CurrentUser<T>>, next: NextFunction) => {};
    checkCurrentStaff<T>(req: Request, Staff: Model<T>): Promise<Record<string, any>>;
    currentStaff<T>(Staff: Model<T>): (req: Request, res: Response<any, CurrentUser<T>>, next: NextFunction) => {};
    checkCurrentChannelStaff<ChannelStaff, ChannelStaffRole>(req: Request, ChannelStaff: Model<ChannelStaff>, ChannelStaffRole: Model<ChannelStaffRole>): Promise<Record<string, any>>;
    currentChannelStaff<ChannelStaff, ChannelStaffRole>(ChannelStaff: Model<ChannelStaff>, ChannelStaffRole: Model<ChannelStaffRole>): (req: Request, res: Response<any, CurrentUser<ChannelStaff>>, next: NextFunction) => {};
};

class AuthMiddleware implements AuthMiddleware {
    private static _instance: AuthMiddleware;

    private constructor() { };

    static getInstance(): AuthMiddleware {
        if (!AuthMiddleware._instance) AuthMiddleware._instance = new AuthMiddleware();

        return AuthMiddleware._instance;
    };
    /**
     * To config the keycloak with authorized user.
     * @param realm - The name of the realm
     * @param authUrl - The url of federated identity
     * @param clientId - Name of the client
     * @param clientSecret - The secret id of the client
     * @param username - Username of the admin
     * @param password - Password of the admin
     * @returns The keycloak config
     */
    private keycloakConfig(realm: string, authUrl: string, clientId: string, clientSecret: string, username: string, password: string) {
        const keycloak = require('keycloak-backend')({
            "realm": realm,
            "auth-server-url": authUrl,
            "client_id": clientId,
            "client_secret": clientSecret,
            "username": username,
            "password": password
        })
        return keycloak
    };
    /**
     * Decode the access token by the jsonwebtoken package.
     * @param accessToken - Access token from the header
     * @returns The decoded user payload
     */
    private decodeAccessToken(accessToken: string) {
        let decoded = jwt.decode(accessToken) as jwt.JwtPayload | null;
        if (!decoded) throw new GenericValidationError({ error: new Error('UNAUTHORISED'), errorCode: 401 });
        return decoded as UserPayload;
    };

    /**
     * Verify the access token with online by keycloak.
     * @param accessToken - Access token from the header
     * @returns The online verified user payload
     */
    private async verifyOnlineAccessToken(accessToken: string) {
        const nconf = Nconf.getInstance().nconf;
        const keycloak = this.keycloakConfig(nconf.get('realm'), nconf.get('AUTH_URL'), nconf.get('clientId'), nconf.get('CLIENT_SECRET'), nconf.get('ADMIN_NAME'), nconf.get('ADMIN_PASSWORD'));
        try {
            const verifiedToken = await keycloak.jwt.verify(accessToken);
            return verifiedToken.content as UserPayload;
        } catch (err: any) {
            throw new GenericValidationError({ error: new Error('UNAUTHORISED'), errorCode: 401 })
        };
    };

    /**
     * Verify the access token with offline by keycloak.
     * @param accessToken - Access token from the header
     * @returns The offline verified user payload
     */
    private async verifyOfflineAccessToken(accessToken: string) {
        const nconf = Nconf.getInstance().nconf;
        const keycloak = this.keycloakConfig(nconf.get('realm'), nconf.get('authUrl'), nconf.get('clientId'), nconf.get('clientSecret'), nconf.get('keycloakUsername'), nconf.get('keycloakPassword'));
        let cert = fs.readFileSync(join(__dirname, '../assets/keycloak/publicKey/public.pem'));
        try {
            const verifiedToken = await keycloak.jwt.verifyOffline(accessToken, cert);
            return verifiedToken.content as UserPayload;
        } catch (err: any) {
            throw new GenericValidationError({ error: new Error('UNAUTHORISED'), errorCode: 401 })
        };
    };


    async checkCurrentUser<T>(req: Request, User: Model<T>) {
        try {
            let userObj: Record<string, any> = {};

            let accessToken, token, payload;

            const bearerToken = req.header('Authorization');

            // Check if it is a bearer token
            if (bearerToken && bearerToken.startsWith('Bearer ')) {
                accessToken = bearerToken.substring(7, bearerToken.length);
            } else {
                accessToken = bearerToken;
            };
            
            if (!accessToken) throw new GenericValidationError({ error: new Error('UNAUTHORISED'), errorCode: 401 });

            // Get the decoded token
            token = this.decodeAccessToken(accessToken);

            const resource_access: Record<string, any> = token.resource_access;

            payload = await this.verifyOnlineAccessToken(accessToken);

            let user = await mongooseService.findOne(User, { email: payload.email });

            // let _user: any | null = null;
            if (user) {
                userObj = user.toJSON() as T;

                if (userObj.isDeleted) {
                    throw new GenericValidationError({ error: new Error(`INACTIVE`), errorCode: 401 });
                };

            } else {
                throw new GenericValidationError({ error: new Error(`You don't have access to make this request`), errorCode: 403 });
            };

            return userObj;
        } catch (error) {
            throw error;
        };
    };

    /**
     * To authenticate the user by access token, and verify with our database. If the user doesn't exists, create the user and return the user details.
     * @param User - Mongoose model for user
     * @returns 
     */
    currentUser<T>(User: Model<T>) {
        return async (req: Request, res: Response<any, CurrentUser<T>>, next: NextFunction
        ) => {
            try {
                const user = await this.checkCurrentUser(req, User) as any;
                res.locals.user = user;

                next();
            } catch (error: any) {
                return next(error);
            }
        };
    };

    async checkCurrentStaff<T>(req: Request, Staff: Model<T>) {
        try {
            let accessToken, token, userObj = {};

            const bearerToken = req.header('Authorization');
            // Check if it is a bearer token
            if (bearerToken && bearerToken.startsWith('Bearer ')) {
                accessToken = bearerToken.substring(7, bearerToken.length);
            } else {
                accessToken = bearerToken;
            };

            if (!accessToken) throw new GenericValidationError({ error: new Error('UNAUTHORISED'), errorCode: 401 });

            // Get the decoded token
            token = this.decodeAccessToken(accessToken);

            // Check the Database, the staff is exists or not.
            let user = await mongooseService.findOne(Staff, { ssoId: token.sub });

            if (user) {
                const _userObj = (Staff as any).jsonObj(user) as any;
                if (_userObj.isDeleted) {
                    throw new GenericValidationError({ error: new Error(`INACTIVE`), errorCode: 401 });
                } else {
                    await this.verifyOnlineAccessToken(accessToken);
                    userObj = { ..._userObj };
                }
            } else {
                throw new GenericValidationError({ error: new Error(`You don't have access to make this request`), errorCode: 403 });
            };

            return userObj;
        } catch (error) {
            throw error;
        };
    };

    /**
     * To authenticate the user by access token, and verify with our database. If the user doesn't exists, create the user and return the user details.
     * @param User - Mongoose model for user
     * @returns 
     */
    currentStaff<T>(Staff: Model<T>) {
        return async (req: Request, res: Response<any, CurrentUser<T>>, next: NextFunction
        ) => {
            try {

                const staff = await this.checkCurrentStaff(req, Staff) as any;
                res.locals.user = staff;

                next();
            } catch (error: any) {
                return next(error);
            }
        };
    };

    async checkCurrentChannelStaff<ChannelStaff, ChannelStaffRole>(req: Request, ChannelStaff: Model<ChannelStaff>, ChannelStaffRole: Model<ChannelStaffRole>) {
        try {
            let accessToken, token, userObj = {};
            // NConf instance.
            const nconf = Nconf.getInstance().nconf;

            // SSO service instance.
            const ssoService = SSOService.getInstance();


            const bearerToken = req.header('Authorization');

            // Check if it is a bearer token
            if (bearerToken && bearerToken.startsWith('Bearer ')) {
                accessToken = bearerToken.substring(7, bearerToken.length);
            } else {
                accessToken = bearerToken;
            };

            if (!accessToken) throw new GenericValidationError({ error: new Error('UNAUTHORISED'), errorCode: 401 });

            // Get the decoded token
            token = this.decodeAccessToken(accessToken);

            const userQuery: Record<string, any> = { email: { $eq: token.email } };
            if (req.header('channel-id')) {
                userQuery.approvedChannelId = { $eq: req.header('channel-id') };
            };

            // Check the Database, the staff is exists or not.
            let user = await mongooseService.findOne(ChannelStaff, userQuery);
            if (user) {
                let _userObj = (ChannelStaff as any).jsonObj(user) as any;
                if (_userObj.isDeleted) {
                    throw new GenericValidationError({ error: new Error(`You don't have access to make this request.`), errorCode: 403 });
                } else {
                    const userPayload = await this.verifyOnlineAccessToken(accessToken);
                    userObj = { ..._userObj };
                }
            } else {
                throw new GenericValidationError({ error: new Error(`You don't have access to make this request.`), errorCode: 403 });
            };

            return userObj;
        } catch (error) {
            console.log("error :: in checkCurrentChannelStaff ::", error);
            throw error;
        };
    };

    /**
     * To authenticate the user by access token, and verify with our database. If the user doesn't exists, create the user and return the user details.
     * @param User - Mongoose model for user
     * @returns 
     */
    currentChannelStaff<ChannelStaff, ChannelStaffRole>(ChannelStaff: Model<ChannelStaff>, ChannelStaffRole: Model<ChannelStaffRole>) {
        return async (req: Request, res: Response<any, CurrentUser<ChannelStaff>>, next: NextFunction
        ) => {
            try {

                const channelStaff = await this.checkCurrentChannelStaff(req, ChannelStaff, ChannelStaffRole) as any;
                res.locals.user = channelStaff;

                next();
            } catch (error: any) {
                return next(error);
            }
        };
    };


};

export {
    UserPayload,
    CurrentUser,
    AuthMiddleware
};
