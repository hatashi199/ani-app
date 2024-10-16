import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './register-user.dto';

export class UpdateAuthDto extends PartialType(CreateUserDto) {}
