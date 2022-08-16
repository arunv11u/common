
export enum TaskStatus {
    PENDING = "PENDING",
    INACTIVE = "INACTIVE",
    COMPLETED = "COMPLETED"
};

export enum TaskType {
    STREAM = "STREAM",
    NOTIFICATION ="NOTIFICATION",
    DELETE_MARKER = "DELETE_MARKER"
};

export enum TaskSubType {
    VIDEO = "VIDEO",
    EVENT = "EVENT",
    USER = "USER"
};
