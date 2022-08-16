import { Topics, TaskType, TaskSubType } from "../";

export interface TaskCreateEvent {
    topic: Topics.TASK_CREATE;
    data: {
        taskId: string;
        type: TaskType;
        subType: TaskSubType;
        schedule: Date;
        payload?: any;
    };
};
