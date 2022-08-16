
import mongoose, { Model, ClientSession, FilterQuery, HydratedDocument, UpdateQuery, SaveOptions, QueryOptions, Document, UpdateWithAggregationPipeline, PipelineStage } from 'mongoose';
import { AggregateOptions, UpdateResult, CollationOptions } from 'mongodb';
import { MongooseConnect } from '../foundation';

interface DatabaseService {
    findById<DocType>(collRef: Model<DocType>, id: string, projection?: Record<string, any>, options?: QueryOptions, session?: ClientSession): Promise<mongoose.HydratedDocument<DocType> | null>;
    findOne<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, projection?: Record<string, any>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null>;
    find<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, projection?: Record<string, any>, options?: QueryOptions, sort?: Record<string, number>, skip?: number, limit?: number, session?: ClientSession, collationOptions?: CollationOptions): Promise<HydratedDocument<DocType>[]>;
    save<DocType>(docRef: HydratedDocument<DocType>, options?: SaveOptions): Promise<DocType | Document<unknown, any, DocType> & { _id: mongoose.Types.ObjectId }>;
    findByIdAndUpdate<DocType>(collRef: Model<DocType>, id: string, updateQuery: UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null>;
    findOneAndUpdate<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, updateQuery: UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null>;
    updateOne<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, updateQuery: UpdateWithAggregationPipeline | UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<UpdateResult>;
    updateMany<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, updateQuery: UpdateWithAggregationPipeline | UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<UpdateResult>;
    aggregate<DocType>(collRef: Model<DocType>, pipeline?: PipelineStage[], options?: AggregateOptions, session?: ClientSession): Promise<any[]>;
    countDocuments<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<number>;
    insertMany<DocType>(collRef: Model<DocType>, docs: DocType[], options?: mongoose.InsertManyOptions & { rawResult: true }): Promise<mongoose.HydratedDocument<DocType, {}, {}>[]>;
    findOneAndDelete<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null>;
};

class MongooseService implements DatabaseService {

    private static _instance: MongooseService;
    private constructor() { };

    static getInstance(): MongooseService {
        if (!MongooseService._instance) MongooseService._instance = new MongooseService();

        return MongooseService._instance;
    };

    private async _reconnectIfDisconnected(): Promise<void> {
        const mongooseConnect = MongooseConnect.getInstance();
        const dbConnectionString = mongooseConnect.dbConnectionString;

        if (mongoose.connection.readyState !== 1) await mongoose.connect(dbConnectionString);
    };

    /**
     * Get a mongoose document by id
     * @param collRef 
     * @param id 
     * @param projection 
     * @param options 
     * @param session 
     * @returns 
     */
    async findById<DocType>(collRef: Model<DocType>, id: string, projection?: Record<string, any>, options?: QueryOptions, session?: ClientSession): Promise<mongoose.HydratedDocument<DocType> | null> {
        await this._reconnectIfDisconnected();

        const _query = collRef.findById(id, projection, options);
        if (session) _query.session(session);

        return await _query;
    };

    /**
     * Get a mongoose document for the requested filter query 
     * @param collRef 
     * @param query 
     * @param projection
     * @param options
     * @param session 
     * @returns 
     */
    async findOne<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, projection?: Record<string, any>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null> {
        await this._reconnectIfDisconnected();

        const _query = collRef.findOne(query, projection, options);
        if (session) _query.session(session);

        return await _query;
    };

    /**
     * Get all matched mongoose documents for the requested filter query 
     * @param collRef 
     * @param query
     * @param projection
     * @param options
     * @param sort 
     * @param skip
     * @param limit 
     * @param session 
     * @returns 
     */
    async find<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, projection?: Record<string, any>, options?: QueryOptions, sort?: Record<string, number>, skip?: number, limit?: number, session?: ClientSession, collationOptions?: CollationOptions, distinct?: string): Promise<HydratedDocument<DocType>[]> {
        await this._reconnectIfDisconnected();

        const _query = collRef.find(query, projection, options);
        if (sort) _query.sort(sort);
        if (skip) _query.skip(skip);
        if (limit) _query.limit(limit);
        if (collationOptions) _query.collation(collationOptions);
        if (session) _query.session(session);
        if (distinct) _query.distinct(distinct);

        return await _query;
    };

    /**
     * Saving a mongoose document
     * @param docRef 
     * @param options 
     * @returns 
     */
    async save<DocType>(docRef: HydratedDocument<DocType>, options?: SaveOptions): Promise<DocType | Document<unknown, any, DocType> & { _id: mongoose.Types.ObjectId }> {
        await this._reconnectIfDisconnected();

        return await docRef.save(options);
    };

    /**
     * Finding a document by an id and updating its info.
     * @param collRef
     * @param id
     * @param updateQuery
     * @param options
     * @param session
     * @returns
     */
    async findByIdAndUpdate<DocType>(collRef: Model<DocType>, id: string, updateQuery: UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null> {
        await this._reconnectIfDisconnected();

        const _query = collRef.findByIdAndUpdate(id, updateQuery, options);
        if (session) _query.session(session);

        return await _query;
    };

    /**
     * Finding a document by some key and updating its info.
     * @param collRef 
     * @param query 
     * @param updateQuery 
     * @param options
     * @param session 
     * @returns 
     */
    async findOneAndUpdate<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, updateQuery: UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null> {
        await this._reconnectIfDisconnected();

        const _query = collRef.findOneAndUpdate(query, updateQuery, options);
        if (session) _query.session(session);

        return await _query;
    };

    /**
     * Updating a document of a collection.
     * @param collRef 
     * @param query 
     * @param updateQuery 
     * @param options 
     * @param session 
     * @returns 
     */
    async updateOne<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, updateQuery: UpdateWithAggregationPipeline | UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<UpdateResult> {
        await this._reconnectIfDisconnected();

        const _query = collRef.updateOne(query, updateQuery, options);
        if (session) _query.session(session);

        return await _query;
    };

    /**
     * Updating many documents of a collection.
     * @param collRef 
     * @param query 
     * @param updateQuery 
     * @param options 
     * @param session 
     * @returns 
     */
    async updateMany<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, updateQuery: UpdateWithAggregationPipeline | UpdateQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<UpdateResult> {
        await this._reconnectIfDisconnected();

        const _query = collRef.updateMany(query, updateQuery, options);
        if (session) _query.session(session);

        return await _query;
    };

    /**
     * Mongoose aggregation queries
     * @param collRef 
     * @param pipeline 
     * @param options 
     * @returns 
     */
    async aggregate<DocType>(collRef: Model<DocType>, pipeline?: PipelineStage[], options?: AggregateOptions, session?: ClientSession, ignoreSoftDelete?: boolean): Promise<any[]> {
        await this._reconnectIfDisconnected();

        const _query = collRef.aggregate(pipeline, options);
        if (ignoreSoftDelete) _query.option({ ignoreSoftDelete: true })
        if (session) _query.session(session);

        return await _query;
    };

    /**
     * Counts the number of documents that matches the query
     * @param collRef 
     * @param query 
     * @param options 
     * @param session 
     * @returns 
     */
    async countDocuments<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<number> {
        await this._reconnectIfDisconnected();

        const _query = collRef.countDocuments(query, options);
        if (session) _query.session(session);

        return await _query;
    };

    async insertMany<DocType>(collRef: Model<DocType>, docs: DocType[], options?: mongoose.InsertManyOptions & { rawResult: true }): Promise<mongoose.HydratedDocument<DocType, {}, {}>[]> {
        await this._reconnectIfDisconnected();

        const _query = collRef.insertMany(docs, options);

        return await _query;
    };

    async findOneAndDelete<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<DocType> | null> {
        await this._reconnectIfDisconnected();

        const _query = collRef.findOneAndDelete(query, options);
        if (session) _query.session(session);

        return await _query;
    };

};

export {
    DatabaseService,
    MongooseService
};

