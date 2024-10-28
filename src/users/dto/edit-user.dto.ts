import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
	@IsOptional()
	@IsString({ message: `'name' debe ser una cadena de caracteres` })
	name?: string;

	@IsOptional()
	@IsString({ message: `'last_name' debe ser una cadena de caracteres` })
	last_name?: string;

	@IsOptional()
	@IsString({ message: `'username' debe ser una cadena de caracteres` })
	username?: string;

	@IsOptional()
	@IsEmail({}, { message: `'email' debe tener un formato válido` })
	email?: string;

	@IsOptional()
	@IsDate({ message: `'birth_date' debe ser una instancia de Date` })
	@Type(() => Date)
	birth_date?: Date;

	@IsOptional()
	@IsString({ message: `'avatar' debe ser una cadena de caracteres` })
	avatar?: string;

	@IsOptional()
	@IsString({ message: `'description' debe ser una cadena de caracteres` })
	description?: string;
}
