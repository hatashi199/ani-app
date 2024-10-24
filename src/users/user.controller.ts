import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
	Request,
	UnauthorizedException
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthGuard } from './guards/user-auth.guard';
import { JwtService } from '@nestjs/jwt';
import {
	DeleteUserDto,
	EditUserDto,
	ForgotPassUserDto,
	LoginUserDto,
	RegisterUserDto
} from './dto';

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

	@UseGuards(UserAuthGuard)
	@Get()
	findAll(@Request() req: Request) {
		if (!req['user'].role.includes('admin')) {
			throw new UnauthorizedException(
				'No tienes permisos para visualizar la información'
			);
		}

		return this.userService.findAll();
	}

	@UseGuards(UserAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string, @Request() req: Request) {
		return this.userService.findOne(id);
	}

	@UseGuards(UserAuthGuard)
	@Patch('edit/:id')
	editOne(@Param('id') id: string, @Body() editUserDto: EditUserDto) {
		return this.userService.editOne(id, editUserDto);
	}

	@Patch('delete/:id')
	remove(@Param('id') id: string, @Body() deleteUserDto: DeleteUserDto) {
		return this.userService.removeOne(id, deleteUserDto);
	}

	@Post('/recover-pass')
	forgotPass(@Body() forgotPassUserDto: ForgotPassUserDto) {
		return this.userService.forgotPass(forgotPassUserDto);
	}
}
