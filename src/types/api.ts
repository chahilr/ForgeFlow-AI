export type ApiSuccess<T> = {
  readonly data: T;
};

export type ApiErrorBody = {
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;
