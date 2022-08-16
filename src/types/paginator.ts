export enum SortTypes {
    ASC = 'ASC',
    DESC = 'DESC'
};

export enum PaginatorTypes {
    FORWARD = 'FORWARD',
    BACKWARD = 'BACKWARD'
};

export interface SimplePaginatorOptions {
    pageIndex: number;
    pageSize: number;
    sortType: SortTypes;
    sortField: string;
};

export interface PaginatorOptions {
    type: PaginatorTypes;
    pageSize: number;
    sortType: SortTypes;
    sortField: string;
    sortFieldValue?: string;
    startIndex?: string;
    endIndex?: string;
};
