import { Topics, TaskType, TaskSubType } from "../";

export interface TaskCancelEvent {
    topic: Topics.TASK_CANCEL;
    data: {
        taskId: string;
        type: TaskType;
        subType: TaskSubType;
        payload?: any;
    };
};
