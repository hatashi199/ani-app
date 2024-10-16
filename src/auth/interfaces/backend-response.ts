export interface BackendResponse<T> {
	data: T;
	message: string;
	createdAt?: Date;
	token?: string;
}
