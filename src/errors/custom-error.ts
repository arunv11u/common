
export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(message: string) {
        super(message);

        // Only because we are deriving(creating a subclass) from a built in class
        Object.setPrototypeOf(this, CustomError.prototype);
    };

    abstract serializeErrors(): { message: string; field?: string }[];
};
