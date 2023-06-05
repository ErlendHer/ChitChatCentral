export type Result<T> =
  T extends void ? | {
    success: true;
  }
  | {
    success: false;
    error: string;
  } :
  | {
    success: true;
    data: T;
  }
  | {
    success: false;
    error: string;
  };


export type ExecResult<T> =
  | {
    success: true;
    data: T;
  }
  | {
    success: false;
    error: string;
  };