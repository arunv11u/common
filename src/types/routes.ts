import { Express } from 'express';

export interface Routes {
    listen(app: Express): void;
};
