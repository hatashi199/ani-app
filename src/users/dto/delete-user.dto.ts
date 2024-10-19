import { IsBoolean } from 'class-validator';

export class DeleteUserDto {
	@IsBoolean({ message: `'isActive' debe ser un booleano` })
	isActive: boolean;
}
