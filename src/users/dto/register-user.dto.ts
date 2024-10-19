import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
	@IsString({ message: `'name' debe ser una cadena de caracteres` })
	name: string;

	@IsString({ message: `'last_name' debe ser una cadena de caracteres` })
	last_name: string;

	@IsString({ message: `'username' debe ser una cadena de caracteres` })
	username: string;

	@IsEmail({}, { message: `'email' debe tener un formato válido` })
	email: string;

	@IsDate({ message: `'birth_date' debe ser una instancia de Date` })
	@Type(() => Date)
	birth_date: Date;

	@MinLength(8, { message: `'password' debe contener al menos 8 caracteres` })
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
		{
			message: `'password' debe contener al menos una letra (mayúscula y minúscula), un número y un caracter especial`
		}
	)
	password: string;
}
