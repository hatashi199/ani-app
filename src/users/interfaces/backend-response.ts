export interface BackendResponse<T> {
	data: T;
	message: string;
	createdAt?: Date;
	deletedAt?: Date;
	token?: string;
}
