import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
	@IsString()
	username?: string;

	@IsEmail()
	email?: string;

	@MinLength(8)
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
	)
	password: string;
}
