import { Request, Response, NextFunction } from 'express';
import { Model } from "mongoose";
import { GenericValidationError } from '../errors';
import { MongooseService } from '../services';
const mongooseService = MongooseService.getInstance();

interface ChannelAccessMiddleware {
    _checkChannelAccess<ApprovedChanelType, RoleType>(request: Request, approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>, user: Record<string, any>): Promise<Record<string, any>>;
    checkChannelAccess<ApprovedChanelType, RoleType>(approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>): (req: Request, res: Response, next: NextFunction) => {};
    _checkChannelAccessByChannelStaff<ApprovedChanelType, RoleType>(request: Request, approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>, user: Record<string, any>): Promise<Record<string, any>>;
    checkChannelAccessByChannelStaff<ApprovedChanelType, RoleType>(approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>): (req: Request, res: Response, next: NextFunction) => {};
};

class ChannelAccessMiddleware implements ChannelAccessMiddleware {
    private static _instance: ChannelAccessMiddleware;

    private constructor() { };

    static getInstance(): ChannelAccessMiddleware {
        if (!ChannelAccessMiddleware._instance) ChannelAccessMiddleware._instance = new ChannelAccessMiddleware();

        return ChannelAccessMiddleware._instance;
    };

    async _checkChannelAccess<ApprovedChanelType, RoleType>(req: Request, approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>, user: Record<string, any>) {
        try {
            if (!user) throw new GenericValidationError({ error: new Error(`checkChannelAccess middleware depends on auth middleware.`), errorCode: 500 });

            const _role = await mongooseService.find(role, {}, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "value");

            let channelQuery: { ownedBy: string, _id?: string | undefined } = {
                ownedBy: user.id
            }

            if (req.header('channel-id')) {
                channelQuery._id = req.header('channel-id');
            }

            if (!_role.includes(user.role)) throw new GenericValidationError({ error: new Error(`You are using this middleware for some other type of users and not for the intended one.`), errorCode: 500 });

            //* Check the channel is available or not (or) the given channel Id is available for this user.
            const channel = await mongooseService.find(approvedChannel, channelQuery);
            const channelObj = (approvedChannel as any).jsonObj(channel) as (ApprovedChanelType[]);

            if (channelObj.length === 0) {
                throw new GenericValidationError({ error: new Error(`You don't have access to make this request.`), errorCode: 403 });
            };

            return {};
        } catch (error) {
            throw error;
        };
    };

    checkChannelAccess<ApprovedChanelType, RoleType>(approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>) {
        return async (req: Request, res: Response, next: NextFunction
        ) => {
            try {
                const user = res.locals.user;
                await this._checkChannelAccess(req, approvedChannel, role, user);

                next();
            } catch (error: any) {
                return next(error);
            };
        };
    };

    async _checkChannelAccessByChannelStaff<ApprovedChanelType, RoleType>(req: Request, approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>, user: Record<string, any>) {
        try {
            if (!user) throw new GenericValidationError({ error: new Error(`checkChannelAccessByChannelStaff middleware depends on auth middleware.`), errorCode: 500 });
            if (!user.approvedChannelId) throw new GenericValidationError({ error: new Error(`approvedChannelId is required for checkChannelAccessByChannelStaff middleware.`), errorCode: 500 });

            const _role = await mongooseService.find(role, {}, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "value");

            let channelQuery: { _id?: any } = {};

            // if (req.header('channel-id')) {
            //     if(!user.approvedChannelIds.some((ele: any) => ele.toString() === req.header('channel-id'))) throw new GenericValidationError({error: new Error(`You don't have access to the requested channel.`), errorCode: 400});

            //     channelQuery._id = { $in: user.approvedChannelIds };
            // };

            console.log("req.header('channel-id') :: user.approvedChannelId ::", req.header('channel-id'), user.approvedChannelId);
            if (req.header('channel-id')) {
                if (user.approvedChannelId.toString() !== req.header('channel-id')) throw new GenericValidationError({ error: new Error(`You don't have access to the requested channel.`), errorCode: 400 });

                channelQuery._id = { $eq: user.approvedChannelId };
            };

            if (!_role.includes(user.role)) throw new GenericValidationError({ error: new Error(`You are using this middleware for some other users and not for the intended one.`), errorCode: 500 });

            //* Check the channel is available or not (or) the given channel Id is available for this user.
            const channel = await mongooseService.findOne(approvedChannel, channelQuery);
            const channelObj = (approvedChannel as any).jsonObj(channel) as (ApprovedChanelType[]);
            
            console.log("channelObj :::", channelObj);
            if (!channelObj) throw new GenericValidationError({ error: new Error(`You don't have access to make this request.`), errorCode: 403 });

            return {};
        } catch (error) {
            console.log("_checkChannelAccessByChannelStaff :: error ::", error);
            throw error;
        };
    };

    checkChannelAccessByChannelStaff<ApprovedChanelType, RoleType>(approvedChannel: Model<ApprovedChanelType>, role: Model<RoleType>): (req: Request, res: Response, next: NextFunction) => {} {
        return async (req: Request, res: Response, next: NextFunction
        ) => {
            try {
                const user = res.locals.user;
                await this._checkChannelAccessByChannelStaff(req, approvedChannel, role, user);

                next();
            } catch (error: any) {
                return next(error);
            };
        };
    };

}

export {
    ChannelAccessMiddleware
};