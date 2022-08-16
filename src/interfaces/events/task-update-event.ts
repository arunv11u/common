import { Topics, TaskType, TaskSubType } from "../";

export interface TaskUpdateEvent {
    topic: Topics.TASK_UPDATE;
    data: {
        taskId: string;
        type: TaskType;
        subType: TaskSubType;
        schedule?: Date;
        payload?: any;
    };
};
