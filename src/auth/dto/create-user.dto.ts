import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsString()
	name: string;

	@IsString()
	last_name: string;

	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsDate()
	@Type(() => Date)
	birth_date: Date;

	@MinLength(8)
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
	)
	password: string;
}
