import { PaginatorTypes, SortTypes } from "../types";
import Joi from 'joi';

const paginatorTypePossibilities = Object.values(PaginatorTypes);
const sortTypePossibilities = Object.values(SortTypes);

const effectivePaginator = Joi.object()
    .keys({
        type: Joi.string().label("Paginator Type").valid(...paginatorTypePossibilities).optional().default(PaginatorTypes.FORWARD),
        startIndex: Joi.optional().label("Paginator Start Index"),
        endIndex: Joi.optional().label("Paginator End Index"),
        size: Joi.number().optional().default(0).label("Paginator Size"),
        sortField: Joi.string().optional().default('_id').label("Paginator Sort Field"),
        sortFieldValue: Joi.string().optional().label("Paginator Sort Field Value"),
        // Joi.string().when('startIndex', {
        //     is: Joi.exist(),
        //     then: Joi.string()
        //         .required()
        //         .label("Paginator Sort Field Value")
        //         .messages({
        //             'any.required': 'Paginator Sort Field Value is a required field, you can pick this value from the same document where you have picked the start index value.'
        //         }),
        //     otherwise: Joi.string().when('endIndex', {
        //         is: Joi.exist(),
        //         then: Joi.string()
        //             .required()
        //             .label("Paginator Sort Field Value")
        //             .messages({
        //                 'any.required': 'Paginator Sort Field Value is a required field, you can pick this value from the same document where you have picked the end index value.'
        //             }),
        //         otherwise: Joi.optional(),
        //     }),
        // }),
        sortType: Joi.string().valid(...sortTypePossibilities).optional().default(SortTypes.ASC).label("Paginator Sort Type"),
    })
    .required();


const paginator = Joi.object()
    .keys({
        size: Joi.number().default(0).optional().label("Paginator Size"),
        sortField: Joi.string().label("Paginator Sort Field").default('_id').optional(),
        sortType: Joi.string().default(SortTypes.ASC).label("Paginator Sort Type").valid(...sortTypePossibilities).optional(),
        pageIndex: Joi.number().label("Paginator Page Index").default(0).min(0).optional(),
    })
    .required();

export { paginator, effectivePaginator };
