import { GenericValidationError } from '..';
import KcAdminClient from 'keycloak-admin';

export abstract class SSOAuth {
    abstract get adminClient(): KcAdminClient;
    abstract set adminClient(adminClient: KcAdminClient);
    abstract set adminName(name: string);
    abstract set adminPassword(name: string);
    abstract set ssoGrantType(type: 'client_credentials' | 'password');
    abstract set ssoClientName(name: string);
    abstract set ssoRealmName(name: string);
    abstract get ssoRealmName();
    abstract set ssoAuthRefreshTime(minutes: number);
    abstract auth(): Promise<boolean>;
    abstract refresh(): Promise<void>;
};

export class SSOConnect extends SSOAuth {
    private static _instance: SSOConnect;
    private isRequired: boolean = false;
    private _kcAdminClient: KcAdminClient | null = null;
    private _adminName: string | null = null;
    private _adminPassword: string | null = null;
    private _ssoGrantType: 'client_credentials' | 'password' | null = null;
    private _ssoClientName: string | null = null;
    private _ssoRealmName: string | null = null;
    private _ssoAuthRefreshTime: number | null = null;

    private constructor() {
        super();


    };

    static getInstance(): SSOConnect {
        if (!SSOConnect._instance) SSOConnect._instance = new SSOConnect();

        return SSOConnect._instance;
    };

    set adminClient(adminClient: KcAdminClient) {
        if (!this._kcAdminClient) this._kcAdminClient = adminClient;
        else throw new GenericValidationError({ error: new Error('_kcAdminClient cannot be changed once you set it'), errorCode: 500 });
    };

    get adminClient() {
        if (!this.isRequired || !this._kcAdminClient) throw new GenericValidationError({ error: new Error(`Cannot get kcAdminClient without setting it up`), errorCode: 500 });
        return this._kcAdminClient;
    };

    set adminName(name: string) {
        if (!this._adminName) this._adminName = name;
        else throw new GenericValidationError({ error: new Error('_adminName cannot be changed once you set it'), errorCode: 500 });
    };

    set adminPassword(password: string) {
        if (!this._adminPassword) this._adminPassword = password;
        else throw new GenericValidationError({ error: new Error('_adminPassword cannot be changed once you set it'), errorCode: 500 });
    };

    set ssoGrantType(type: 'client_credentials' | 'password') {
        if (!this._ssoGrantType) this._ssoGrantType = type;
        else throw new GenericValidationError({ error: new Error('_ssoGrantType cannot be changed once you set it'), errorCode: 500 });
    };

    set ssoClientName(name: string) {
        if (!this._ssoClientName) this._ssoClientName = name;
        else throw new GenericValidationError({ error: new Error('_ssoClientName cannot be changed once you set it'), errorCode: 500 });
    };

    get ssoRealmName() {
        if (!this.isRequired || !this._ssoRealmName) throw new GenericValidationError({ error: new Error(`Cannot get ssoRealmName without setting it up`), errorCode: 500 });
        return this._ssoRealmName;
    };

    set ssoRealmName(name: string) {
        if (!this._ssoRealmName) this._ssoRealmName = name;
        else throw new GenericValidationError({ error: new Error('_ssoRealmName cannot be changed once you set it'), errorCode: 500 });
    };

    set ssoAuthRefreshTime(minutes: number) {
        if (!this._ssoAuthRefreshTime) this._ssoAuthRefreshTime = minutes;
        else throw new GenericValidationError({ error: new Error('_ssoAuthRefreshTime cannot be changed once you set it'), errorCode: 500 });
    };

    async auth() {
        try {
            this.isRequired = true;
            if (!this._adminName) throw new GenericValidationError({ error: new Error(`Must set the admin name before trying to authenticate`), errorCode: 500 });
            if (!this._adminPassword) throw new GenericValidationError({ error: new Error(`Must set the admin password before trying to authenticate`), errorCode: 500 });
            if (!this._ssoGrantType) throw new GenericValidationError({ error: new Error(`Must set the admin grant type before trying to authenticate`), errorCode: 500 });
            if (!this._ssoClientName) throw new GenericValidationError({ error: new Error(`Must set the admin client name before trying to authenticate`), errorCode: 500 });
            if (!this._kcAdminClient) throw new GenericValidationError({ error: new Error(`Must call the getClient method before trying to authenticate`), errorCode: 500 });
            if (!this._ssoRealmName) throw new GenericValidationError({ error: new Error(`Must set the sso realm name before trying to refresh the SSO tokens`), errorCode: 500 });

            try {
                
                this._kcAdminClient.setConfig({
                    realmName: process.env['NODE_ENV'] === "staging" ? this._ssoRealmName : "master"
                });

                await this._kcAdminClient.auth({
                    username: this._adminName,
                    password: this._adminPassword,
                    grantType: this._ssoGrantType,
                    clientId: this._ssoClientName
                });
            } catch (error) {
                console.log("error: ::", error);
                throw new GenericValidationError({ error: new Error(`Keycloak authentication failed`), errorCode: 500 });
            };

            return true;
        } catch (error) {
            throw (error);
        };
    };

    async refresh() {

        if (!this._kcAdminClient) throw new GenericValidationError({ error: new Error(`Must call the getClient method before trying to refresh the SSO tokens`), errorCode: 500 });
        if (!this._ssoRealmName) throw new GenericValidationError({ error: new Error(`Must set the sso realm name before trying to refresh the SSO tokens`), errorCode: 500 });
        if (!this._ssoAuthRefreshTime) throw new GenericValidationError({ error: new Error(`Must set the sso auth refresh time before trying to refresh the SSO tokens`), errorCode: 500 });

        let refreshingToken = true;
        let retryCount = 0;
        while (refreshingToken) {
            try {
                this._kcAdminClient.setConfig({
                    realmName: process.env['NODE_ENV'] === "staging" ? this._ssoRealmName : "master"
                });

                await this.auth();

                refreshingToken = false;
                this._kcAdminClient.setConfig({
                    realmName: this._ssoRealmName
                });

            } catch (error) {
                retryCount++;
                console.log(`${retryCount} attempt for refreshing SSO token`);
            };
        };

        setTimeout(async () => {
            await this.refresh();
        }, this._ssoAuthRefreshTime * 60 * 1000);
    };
};