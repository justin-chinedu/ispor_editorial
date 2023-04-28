export type RequestState = 'idle' | 'processing' | 'error' | 'success'
export type RequestType<T> = { state: RequestState, data: T, error?: string }
