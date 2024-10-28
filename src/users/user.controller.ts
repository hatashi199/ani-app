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
import {
	DeleteUserDto,
	EditUserDto,
	PassCodeDto,
	LoginUserDto,
	RegisterUserDto,
	PassCodeValidateDto,
	ResetPassDto
} from './dto';
import { UserAdminGuard } from './guards/user-admin.guard';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(UserAuthGuard, UserAdminGuard)
	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@UseGuards(UserAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string, @Request() req: Request) {
		if (req['user'].id !== id && !req['user'].role.includes('admin'))
			throw new UnauthorizedException(
				'No tienes permisos para realizar esta acción'
			);
		return this.userService.findOne(id);
	}

	@Post('/register')
	register(@Body() createUserDto: RegisterUserDto) {
		return this.userService.register(createUserDto);
	}

	@Post('/login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.userService.login(loginUserDto);
	}

	@Post('/recover-pass')
	passCode(@Body() passCodeDto: PassCodeDto) {
		return this.userService.passCode(passCodeDto);
	}

	@Post('/pass-code-validate')
	passCodeValidate(@Body() passCodeValidateDto: PassCodeValidateDto) {
		return this.userService.passCodeValidate(passCodeValidateDto);
	}

	@Patch('/reset-pass')
	resetPass(@Body() resetPassDto: ResetPassDto) {
		return this.userService.resetPass(resetPassDto);
	}

	@UseGuards(UserAuthGuard)
	@Patch('edit/:id')
	editOne(
		@Param('id') id: string,
		@Body() editUserDto: EditUserDto,
		@Request() req: Request
	) {
		if (req['user'].id !== id)
			throw new UnauthorizedException(
				'No tienes permisos para realizar esta acción'
			);
		return this.userService.editOne(id, editUserDto);
	}

	@UseGuards(UserAuthGuard, UserAdminGuard)
	@Patch('delete/:id')
	remove(@Param('id') id: string, @Body() deleteUserDto: DeleteUserDto) {
		return this.userService.removeOne(id, deleteUserDto);
	}
}
