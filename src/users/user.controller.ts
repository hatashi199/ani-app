import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from './guards/user-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	@Post('/register')
	register(@Body() createUserDto: RegisterUserDto) {
		return this.userService.register(createUserDto);
	}

	@Post('/login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.userService.login(loginUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string, @Request() req: Request) {
		//TODO: Que pueda visualizar el usuario sólo el autenticado.
		return this.userService.findOne(id);
	}

	@UseGuards(AuthGuard)
	@Patch('edit/:id')
	editOne(@Param('id') id: string, @Body() editUserDto: EditUserDto) {
		return this.userService.editOne(id, editUserDto);
	}

	@Patch('delete/:id')
	remove(@Param('id') id: string, @Body() deleteUserDto: DeleteUserDto) {
		return this.userService.removeOne(id, deleteUserDto);
	}
}
