import mongoose, { CallbackError } from 'mongoose';
import _lodash from 'lodash';
import { GenericValidationError } from '../';

export abstract class BaseMongooseSchemaService {
    abstract get transform(): (doc: any, ret: any) => any;
    abstract transformData(): {
        toJSON: {
            transform: (doc: any, ret: any) => any;
        };
        timestamps: {
            createdAt: string;
            updatedAt: string;
        };
    };
    abstract genDocId(): mongoose.Types.ObjectId;
    abstract createdByAndUpdatedBySave(this: mongoose.Query<any, any, {}, any>, next: (err: CallbackError | undefined) => void): void;
    abstract createdByAndUpdatedByUpdate(this: mongoose.Query<any, any, {}, any>, next: (err: CallbackError | undefined) => void): void;
    abstract initialVersion(this: mongoose.Document<any, any, any>, next: (err: CallbackError | undefined) => void): void;
    abstract versionUpdate(this: mongoose.Query<any, any, {}, any>, next: (err: CallbackError | undefined) => void): void;
    abstract excludeDeleteMiddleware(this: mongoose.Query<any, any, {}, any>, next: (err: CallbackError | undefined) => void): void;
    abstract excludeDeleteAggregateMiddleware(this: mongoose.Aggregate<any>, next: (err: CallbackError | undefined) => void): void;
};

export class MongooseSchemaService extends BaseMongooseSchemaService {

    private static _instance: MongooseSchemaService;
    private _transform: (doc: any, ret: any) => any;
    private constructor() {
        super();

        this._transform = (doc: any, ret: any) => {
            const id = doc._id;
            ret.id = id;

            delete ret._id;
            delete ret.__v;
            return ret;
        };
    };

    static getInstance(): MongooseSchemaService {
        if (!MongooseSchemaService._instance) MongooseSchemaService._instance = new MongooseSchemaService();

        return MongooseSchemaService._instance;
    };

    get transform() {
        return this._transform;
    };

    transformData() {
        return {
            toJSON: {
                transform: this._transform,
            },

            timestamps: {
                createdAt: 'creationDate',
                updatedAt: 'lastModifiedDate',
            }
        };
    };

    genDocId() {
        return new mongoose.Types.ObjectId();
    };


    createdByAndUpdatedBySave(this: mongoose.Query<any, any, {}, any>,
        next: (err: CallbackError | undefined) => void) {


        const locals: { user: Record<string, any> } = this.get('locals');
        const excludeLocals: boolean = this.get('excludeLocals');

        console.log("excludeLocals and locals in createdByAndUpdatedByUpdate ::", excludeLocals, locals);
        if (excludeLocals) return next(undefined);

        if (!locals) throw new GenericValidationError({ error: new Error(`locals is required field for createdByAndUpdatedBySave mongoose middleware fn`), errorCode: 500 });

        if (!locals.user.id) throw new GenericValidationError({ error: new Error(`locals.user.id doesn't exist in createdByAndUpdatedBySave mongoose middleware fn`), errorCode: 500 });

        this.set('createdBy', locals.user.id);
        this.set('updatedBy', locals.user.id);
        next(undefined);

    };

    createdByAndUpdatedByUpdate(this: mongoose.Query<any, any, {}, any>,
        next: (err: CallbackError | undefined) => void) {

        const locals: { user: Record<string, any> } = this.get('locals');
        const excludeLocals: boolean = this.get('excludeLocals');

        console.log("excludeLocals and locals in createdByAndUpdatedByUpdate ::", excludeLocals, locals);
        if (excludeLocals) return next(undefined);

        if (!locals) throw new GenericValidationError({ error: new Error(`locals is required field for createdByAndUpdatedByUpdate mongoose middleware fn`), errorCode: 500 });

        if (!locals.user.id) throw new GenericValidationError({ error: new Error(`locals.user.id doesn't exist in createdByAndUpdatedByUpdate mongoose middleware fn`), errorCode: 500 });

        //! Try handling if upsert query is passed.
        this.set('updatedBy', locals.user.id);
        next(undefined);
    };

    initialVersion(this: mongoose.Document<any, any, any>,
        next: (err: CallbackError | undefined) => void) {

        console.log("version in initialVersion :", this.get('__v'));
        if (!(this.get('__v') || this.get('__v') === 0)) {
            this.increment();
        };
        next(undefined);
    };

    versionUpdate(this: mongoose.Query<any, any, {}, any>,
        next: (err: CallbackError | undefined) => void) {

        console.log("version in versionUpdate ::", this.get('__v'));
        if (!(this.get('__v') || this.get('__v') === 0) && !this.getOptions().upsert) {
            this.update({}, { $inc: { __v: 1 } });
        };
        next(undefined);
    };


    excludeDeleteMiddleware(
        this: mongoose.Query<any, any, {}, any>,
        next: (err: CallbackError | undefined) => void
    ) {
        try {
            if (
                !(
                    JSON.stringify(this.getQuery().$or) ===
                    JSON.stringify([{ isDeleted: true }, { isDeleted: false }])
                ) &&
                !this.getQuery().isDeleted
                &&
                !(this.getQuery().$and?.some((ele) => (Object(ele).hasOwnProperty("isDeleted")) || (JSON.stringify(ele.$or) === JSON.stringify([{ isDeleted: true }, { isDeleted: false }]))))
            ) {
                this.where({ isDeleted: false });
            };

            next(undefined);
        } catch (error: any) {
            next(
                new Error(
                    `Error in excludeDeleteMiddleware fn, please contact support team to resolve this issue.`
                )
            );
        }
    };

    excludeDeleteAggregateMiddleware(
        this: any,
        next: (err: CallbackError | undefined) => void
    ) {
        try {
            // Get the current aggregation pipeline and prepend a `$match` that excludes all soft-deleted docs

            const options = this.options as any;
            if (options["ignoreSoftDelete"]) {
                return next(undefined);
            }
            this.pipeline().unshift({ $match: { isDeleted: false } });
            next(undefined);
        } catch (error) {
            next(
                new Error(
                    `Error in excludeDeleteAggregateMiddleware fn, please contact support team to resolve this issue.`
                )
            );
        };
    };
};
