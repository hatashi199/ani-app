import { IsEmail } from 'class-validator';

export class ForgotPassUserDto {
	@IsEmail({}, { message: `'email' debe tener un formato válido` })
	email: string;
}
