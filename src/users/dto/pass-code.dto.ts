import { IsEmail } from 'class-validator';

export class PassCodeDto {
	@IsEmail({}, { message: `'email' debe tener un formato válido` })
	email: string;
}
