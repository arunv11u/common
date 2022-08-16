import { Topics } from "..";

export interface ImageConversionEvent {
    topic: Topics.IMAGE_CONVERSION_STARTED;
    data: {
        inputPath: string;
        outputPath: string;
        type: string;
    };
};
