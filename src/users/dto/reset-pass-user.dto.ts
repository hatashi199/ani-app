import { IsEmail, Matches, MinLength } from 'class-validator';

export class ResetPassUserDto {
	@IsEmail({}, { message: `'email' debe tener un formato válido` })
	email: string;

	@MinLength(8, { message: `'password' debe contener al menos 8 caracteres` })
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
		{
			message: `'password' debe contener al menos una letra (mayúscula y minúscula), un número y un caracter especial`
		}
	)
	resetPassCode: string;
}
