export interface FormattedError {
    errors: ErrorObject[];
  }
  
  export interface ErrorObject {
    message: string;
    field?: string;
  }
  
  export interface GenericError {
    error: Error;
    errorCode: number;
  }