import { ClientSession } from "mongoose";
import { CurrentUser } from "../middlewares";

export declare namespace CustomLocals {

  export interface ResponseLocals {
    session: ClientSession;
  }

  export interface CurrentUserLocals<T> extends CurrentUser<T> {
    session: ClientSession;
  }

};
