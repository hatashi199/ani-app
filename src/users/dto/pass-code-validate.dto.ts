import { IsString } from 'class-validator';

export class PassCodeValidateDto {
	@IsString({ message: `'resetPassCode' debe ser una cadena de caracteres` })
	resetPassCode: string;
}
