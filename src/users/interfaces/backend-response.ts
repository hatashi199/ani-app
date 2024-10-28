export interface BackendResponse<T> {
	data: T;
	message: string;
	token?: string;
}
