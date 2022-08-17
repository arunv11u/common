import {  FilterQuery, PipelineStage, QueryOptions, UpdateQuery } from "mongoose";
import { AggregateOptions } from 'mongodb';

interface QueryOutput<F> {
    filter: FilterQuery<F>;
    options?: QueryOptions;
};

interface QueryAndUpdateOutput<F, U> {
    filter: FilterQuery<F>;
    updateQuery: UpdateQuery<U>;
    options?: QueryOptions;
};

interface AggregateQueryOutput<F> {
    filter: PipelineStage[];
    options?: AggregateOptions;
};

export {
    QueryOutput,
    QueryAndUpdateOutput,
    AggregateQueryOutput
};
