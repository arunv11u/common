import mongoose, { ClientSession, FilterQuery, Model, PipelineStage } from "mongoose";
import { MongooseService } from './';
import { SortTypes, PaginatorTypes, SimplePaginatorOptions, PaginatorOptions } from '../types';
import { CollationOptions } from 'mongodb';

const mongooseService = MongooseService.getInstance();


export interface BasePaginatorService {
    simpleFind<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, options: SimplePaginatorOptions, session?: ClientSession, projection?: any, collationOptions?: CollationOptions): Promise<{ docs: DocType[], count: number }>;
    simpleAggregate<DocType>(collRef: Model<DocType>, query: PipelineStage[], options: SimplePaginatorOptions, session?: ClientSession, ignoreSoftDelete?: boolean): Promise<{ docs: any[], count: number }>;
    find<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>[], options: PaginatorOptions, session?: ClientSession, projection?: any): Promise<{ docs: DocType[], count: number }>;
    aggregate<DocType>(collRef: Model<DocType>, query: PipelineStage[], options: PaginatorOptions, session?: ClientSession): Promise<{ docs: any[], count: number }>;
};

export class PaginatorService implements BasePaginatorService {

    private static _instance: PaginatorService;
    private constructor() { };
    static getInstance(): PaginatorService {
        if (!PaginatorService._instance) PaginatorService._instance = new PaginatorService();

        return PaginatorService._instance;
    };

    async simpleFind<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>, options: SimplePaginatorOptions, session?: ClientSession, projection?: any, collationOptions?: CollationOptions): Promise<{ docs: DocType[], count: number }> {
        const sort: Record<string, any> = {},
            skipCount = options.pageIndex > 0 ? options.pageIndex * options.pageSize : 0;

        if (options.sortType === SortTypes.ASC) sort[options.sortField] = 1;
        else sort[options.sortField] = -1;

        const docs = await mongooseService.find(collRef, query, projection, undefined, sort, skipCount, options.pageSize, session, collationOptions) as DocType[];
        const count = await mongooseService.countDocuments(collRef, query, undefined, session);

        return { docs, count };
    };

    async simpleAggregate<DocType>(collRef: Model<DocType>, query: PipelineStage[], options: SimplePaginatorOptions, session?: ClientSession, ignoreSoftDelete?: boolean): Promise<{ docs: any[], count: number }> {

        let sort: { $sort: Record<string, any> } = { $sort: {} },
            skipCount = options.pageIndex > 0 ? options.pageIndex * options.pageSize : 0;

        if (options.sortType === SortTypes.ASC) sort['$sort'][options.sortField] = 1;
        else sort['$sort'][options.sortField] = -1;


        const docsSnapshotQuery = [];
        if (options.pageSize)
            docsSnapshotQuery.push({ $skip: skipCount }, { $limit: options.pageSize });

        //* Projection query handling.
        let projectionQuery: PipelineStage.Project[] = [];
        if (query.length && ((query[query.length - 1]) as any).$project) projectionQuery = query.splice(query.length - 1, 1) as PipelineStage.Project[];

        const pipelineQuery = [
            ...query,
            { ...sort },
            ...projectionQuery,
            {
                $facet: {
                    docs: [
                        ...docsSnapshotQuery,
                        { $group: { _id: null, docsArr: { $push: '$$ROOT' } } },
                    ],
                    count: [{ $group: { _id: null, count: { $sum: 1 } } }],
                }
            },
            {
                $project: {
                    docs: {
                        $ifNull: [
                            {
                                $arrayElemAt: ['$docs.docsArr', 0],
                            },
                            [],
                        ],
                    },
                    count: { $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0] },
                }
            },
        ];

        const documentSnapshots = await mongooseService.aggregate(collRef, pipelineQuery, undefined, session, ignoreSoftDelete);
        const docs = documentSnapshots[0].docs;
        const count = documentSnapshots[0].count;

        return { docs, count };
    };

    async find<DocType>(collRef: Model<DocType>, query: FilterQuery<DocType>[], options: PaginatorOptions, session?: ClientSession, projection?: any): Promise<{ docs: DocType[], count: number }> {
        const sort: Record<string, any> = {}, inputQuery: any[] = [];

        if (options.type === PaginatorTypes.FORWARD) {
            if (options.sortType === SortTypes.ASC) {
                if (options.sortField !== '_id') {
                    sort[options.sortField] = 1;
                    sort['_id'] = 1;
                } else sort['_id'] = 1;
            } else {
                if (options.sortField !== '_id') {
                    sort[options.sortField] = -1;
                    sort['_id'] = -1;
                } else sort['_id'] = -1;
            };
        } else {
            if (options.sortType === SortTypes.ASC) {
                if (options.sortField !== '_id') {
                    sort[options.sortField] = -1;
                    sort['_id'] = -1;
                } else sort['_id'] = -1;
            } else {
                if (options.sortField !== '_id') {
                    sort[options.sortField] = 1;
                    sort['_id'] = 1;
                } else sort['_id'] = 1;
            };
        };

        if (
            options.sortField &&
            options.sortFieldValue &&
            options.sortFieldValue !== 'undefined' &&
            options.sortFieldValue !== 'null'
        ) {
            const sortFieldObj: Record<string, any> = {};
            sortFieldObj[options.sortField] = { $eq: options.sortFieldValue };
            inputQuery.push({ $or: [{ $and: [sortFieldObj] }] });
        };

        let indexName: 'startIndex' | 'endIndex', operator: '$gt' | '$lt';
        if (options.type === PaginatorTypes.FORWARD) {
            indexName = "startIndex";
            if (options.sortType === SortTypes.ASC) operator = "$gt";
            else operator = "$lt";
        } else {
            indexName = "endIndex";
            if (options.sortType === SortTypes.ASC) operator = "$lt";
            else operator = "$gt";
        };

        if (options.startIndex || options.endIndex) {
            const _matchQuery: Record<string, any> = { _id: {} };
            _matchQuery._id[operator] = new mongoose.Types.ObjectId(options[indexName]);
            if (
                options.sortField &&
                options.sortFieldValue &&
                options.sortFieldValue !== 'undefined' &&
                options.sortFieldValue !== 'null'
            ) {
                const _matchQueryObj: Record<string, any> = {};
                _matchQueryObj[options['sortField']] = {};
                _matchQueryObj[options['sortField']][operator] = options.sortFieldValue;
                inputQuery[0].$or.unshift(_matchQueryObj);
                inputQuery[0].$or[1].$and.push(_matchQuery);
            } else inputQuery.push(_matchQuery);
        };

        let finalQuery: Record<string, any> = {};
        if ([...inputQuery, ...query].length) finalQuery = { $and: [...inputQuery, ...query] };

        const docs = await mongooseService.find(collRef, finalQuery, projection, undefined, sort, undefined, options.pageSize, session) as DocType[];

        if (options.type === PaginatorTypes.BACKWARD) docs.reverse();

        let countFinalQuery: Record<string, any> = {};
        if (query.length) countFinalQuery = { $and: [...query] };

        const count = await mongooseService.countDocuments(collRef, countFinalQuery, undefined, session);

        return { docs, count };
    };

    async aggregate<DocType>(collRef: Model<DocType>, query: PipelineStage[], options: PaginatorOptions, session?: ClientSession): Promise<{ docs: any[], count: number }> {
        let sort: { $sort: Record<string, any> } = { $sort: {} }, inputQuery: any[] = [];


        if (options.type === PaginatorTypes.FORWARD) {
            if (options.sortType === SortTypes.ASC) {
                if (options.sortField !== '_id') {
                    sort['$sort'][options.sortField] = 1;
                    sort['$sort']['_id'] = 1;
                } else sort['$sort']['_id'] = 1;
            } else {
                if (options.sortField !== '_id') {
                    sort['$sort'][options.sortField] = -1;
                    sort['$sort']['_id'] = -1;
                } else sort['$sort']['_id'] = -1;
            };
        } else {
            if (options.sortType === SortTypes.ASC) {
                if (options.sortField !== '_id') {
                    sort['$sort'][options.sortField] = -1;
                    sort['$sort']['_id'] = -1;
                } else sort['$sort']['_id'] = -1;
            } else {
                if (options.sortField !== '_id') {
                    sort['$sort'][options.sortField] = 1;
                    sort['$sort']['_id'] = 1;
                } else sort['$sort']['_id'] = 1;
            };
        };

        if (
            options.sortField &&
            options.sortFieldValue &&
            options.sortFieldValue !== 'undefined' &&
            options.sortFieldValue !== 'null'
        ) {
            inputQuery.push({
                $or: [
                    {
                        $and: [
                            { $eq: [`$${options['sortField']}`, options.sortFieldValue] },
                        ],
                    },
                ],
            });
        };

        let indexName: 'startIndex' | 'endIndex', operator: '$gt' | '$lt';
        if (options.type === PaginatorTypes.FORWARD) {
            indexName = "endIndex";
            if (options.sortType === SortTypes.ASC) operator = "$gt";
            else operator = "$lt";
        } else {
            indexName = "startIndex";
            if (options.sortType === SortTypes.ASC) operator = "$lt";
            else operator = "$gt";
        };

        if (options.startIndex || options.endIndex) {
            const _matchQuery: Record<string, any> = { };
            _matchQuery[operator] = ['$_id', new mongoose.Types.ObjectId(options[indexName])];

            if (
                options.sortField &&
                options.sortFieldValue &&
                options.sortFieldValue !== 'undefined' &&
                options.sortFieldValue !== 'null'
            ) {
                const _matchQueryObj: Record<string, any> = {};
                _matchQueryObj[operator] = [`$${options['sortField']}`, options.sortFieldValue];
                inputQuery[0].$or.unshift(_matchQueryObj);
                inputQuery[0].$or[1].$and.push(_matchQuery);
            } else inputQuery.push(_matchQuery);
        };

        const pipelineQuery = [];
        const docsSnapshotQuery = [];
        if (options.pageSize) docsSnapshotQuery.push({ $limit: options.pageSize });

        pipelineQuery.push(
            ...query,
            { ...sort },
            {
                $facet: {
                    docs: [
                        { $match: { $expr: { $and: [...inputQuery] } } },
                        ...docsSnapshotQuery,
                        { $group: { _id: null, docsArr: { $push: '$$ROOT' } } },
                    ],
                    count: [{ $group: { _id: null, count: { $sum: 1 } } }],
                },
            },
            {
                $project: {
                    docs: {
                        $ifNull: [
                            {
                                $arrayElemAt: ['$docs.docsArr', 0],
                            },
                            [],
                        ],
                    },
                    count: { $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0] },
                },
            }
        );

        console.log("pipelineQuery :::", JSON.stringify(pipelineQuery));

        const documentSnapshots = await mongooseService.aggregate(collRef, pipelineQuery, undefined, session);

        if (options.type === PaginatorTypes.BACKWARD) documentSnapshots[0].docs.reverse();

        const docs = documentSnapshots[0].docs;
        const count = documentSnapshots[0].count;

        return { docs, count };
    };

};
