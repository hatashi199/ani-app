import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { BackendResponse } from './interfaces/backend-response';
import {
	DeleteUserDto,
	EditUserDto,
	PassCodeDto,
	LoginUserDto,
	RegisterUserDto,
	PassCodeValidateDto,
	ResetPassDto
} from './dto';
import { MailerService } from 'src/mailer/services/mailer.service';
import { MailData } from 'src/mailer/interfaces/mail-data.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private user_model: Model<User>,
		private jwtService: JwtService,
		private mailerService: MailerService
	) {}

	async register(
		registerUserDto: RegisterUserDto
	): Promise<BackendResponse<User>> {
		try {
			const { password, ...userData } = registerUserDto;
			const newUser = new this.user_model({
				password: bcryptjs.hashSync(password, 10),
				...userData
			});

			await newUser.save();

			const { password: pass_temp, ...user } = newUser.toJSON();

			return {
				data: user,
				createdAt: new Date(),
				message: 'Usuario creado'
			};
		} catch (error) {
			if (error.code === 11000)
				throw new BadRequestException(
					'Ya existe una cuenta con ese email/usuario'
				);

			throw new InternalServerErrorException(
				'Error interno en el servidor'
			);
		}
	}

	async login(loginUserDto: LoginUserDto): Promise<BackendResponse<string>> {
		try {
			const { username, email, password } = loginUserDto;

			if (!email && !username) {
				throw new BadRequestException(
					'El usuario o el email debe ser proporcionado'
				);
			}

			if (email && username) {
				throw new BadRequestException(
					'No está permitido hacer inicio de sesión con email y usuario a la vez'
				);
			}

			const loginQuery = {
				...(username ? { username } : {}),
				...(email ? { email } : {})
			};

			const propLogin = await this.user_model.findOne(loginQuery);

			if (!propLogin) {
				throw new UnauthorizedException('Usuario/email incorrectos');
			}

			if (!bcryptjs.compareSync(password, propLogin.password))
				throw new UnauthorizedException('Contraseña incorrecta');

			const { password: pass_temp, ...loginData } = propLogin.toJSON();

			const token = this.getJWTToken({
				id: propLogin.id,
				role: propLogin.role
			});

			return {
				data:
					(username && loginData.username) ||
					(email && loginData.email),
				message: 'Sesión iniciada',
				token
			};
		} catch (error) {
			throw error;
		}
	}

	async findAll(): Promise<BackendResponse<User[]>> {
		const allUsers = await this.user_model.find();
		const finalData = allUsers.map((user) => {
			const { password, ...userData } = user.toJSON();
			return { ...userData };
		});

		return {
			data: finalData,
			message: 'Información enviada'
		};
	}

	async findOne(id: string): Promise<BackendResponse<User>> {
		const user = await this.user_model.findById(id);

		if (!user) throw new NotFoundException('No existe el usuario');
		if (!user.isActive) throw new NotFoundException('No existe el usuario');

		const { password, ...userData } = user.toJSON();
		return {
			data: userData,
			message: 'Información enviada'
		};
	}

	async editOne(
		id: string,
		editUserDto: EditUserDto
	): Promise<BackendResponse<User>> {
		try {
			await this.user_model.findByIdAndUpdate(id, editUserDto);

			const { data } = await this.findOne(id);

			return {
				data,
				message: 'Información del usuario actualizada'
			};
		} catch (error) {
			if (error.code === 404)
				throw new NotFoundException('No existe el usuario');
			throw new InternalServerErrorException(
				'Error Interno en el Servidor'
			);
		}
	}

	async passCode(passCodeDto: PassCodeDto): Promise<BackendResponse<null>> {
		try {
			const user = await this.user_model.findOne({
				email: passCodeDto.email
			});

			if (!user) throw new NotFoundException('No existe el usuario');
			if (!user.isActive)
				throw new NotFoundException('No existe el usuario');

			const mailData: MailData = {
				sender: 'alejandromf199.temp@gmail.com',
				to: user.email,
				subject: 'Prueba de email'
			};

			const resetPassCode = this.getJWTToken({
				id: user.id,
				role: user.role
			});

			await this.user_model.findByIdAndUpdate(user.id, { resetPassCode });
			await this.mailerService.sendMail(mailData, resetPassCode);

			return {
				data: null,
				message: 'Código de recuperación enviado a CORREO'
			};
		} catch (error) {
			throw error;
		}
	}

	async passCodeValidate(
		passCodeValidate: PassCodeValidateDto
	): Promise<BackendResponse<boolean>> {
		try {
			const user = await this.user_model.findOne({
				resetPassCode: passCodeValidate.resetPassCode
			});

			if (!user) throw new NotFoundException('No existe el usuario');
			if (!user.isActive)
				throw new NotFoundException('No existe el usuario');
			return {
				data: true,
				message: 'Código válido'
			};
		} catch (error) {
			throw error;
		}
	}

	async resetPass(
		resetPassDto: ResetPassDto
	): Promise<BackendResponse<boolean>> {
		try {
			const user = await this.user_model.findOne({
				email: resetPassDto.email
			});

			if (!user) throw new NotFoundException('No existe el usuario');
			if (!user.isActive)
				throw new NotFoundException('No existe el usuario');

			const isPassCodeValid = this.jwtService.verify(user.resetPassCode, {
				secret: process.env.JWT_SEED
			});

			if (!isPassCodeValid) {
				throw new BadRequestException('Token no válido o expirado');
			}

			await this.user_model.findOneAndUpdate(
				{ email: resetPassDto.email },
				{ password: bcryptjs.hashSync(resetPassDto.newPassword, 10) }
			);

			return {
				data: null,
				message: 'La contraseña ha sido actualizada correctamente'
			};
		} catch (error) {
			throw error;
		}
	}

	async removeOne(
		id: string,
		deleteUserDto: DeleteUserDto
	): Promise<BackendResponse<string>> {
		try {
			await this.user_model.findByIdAndUpdate(id, deleteUserDto);

			const { data } = await this.findOne(id);

			return {
				data: data.username,
				deletedAt: new Date(),
				message: `Usuario ${data.username} desactivado`
			};
		} catch (error) {
			if (error.code === 404)
				throw new NotFoundException('No existe el usuario');
			throw new InternalServerErrorException(
				'Error Interno en el Servidor'
			);
		}
	}

	// Helpers
	getJWTToken(payload: JwtPayload) {
		const access_token = this.jwtService.sign(payload);
		return access_token;
	}
}
