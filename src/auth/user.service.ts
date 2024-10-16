import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common';
import { CreateUserDto } from './dto/register-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { BackendResponse } from './interfaces/backend-response';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private user_model: Model<User>,
		private jwtService: JwtService
	) {}

	async register(
		createUserDto: CreateUserDto
	): Promise<BackendResponse<User>> {
		try {
			const { password, ...userData } = createUserDto;
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
			console.log(error);

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
			const { email, username } = loginUserDto;

			if (!email && !username) {
				throw new BadRequestException(
					'El usuario o el email debe ser proporcionado'
				);
			}

			if (username)
				return await this.isLoginValid(username, loginUserDto);
			if (email) return await this.isLoginValid(email, loginUserDto);
		} catch (error) {
			throw error;
		}
	}

	findAll() {
		return `This action returns all auth`;
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	}

	async isLoginValid(
		prop: string,
		loginUserDto: LoginUserDto
	): Promise<BackendResponse<string>> {
		try {
			const propLogIn = await this.user_model.findOne({ username: prop });
			if (!propLogIn) {
				throw new UnauthorizedException('Usuario/email incorrectos');
			}

			if (
				!bcryptjs.compareSync(loginUserDto.password, propLogIn.password)
			)
				throw new UnauthorizedException('Contraseña incorrecta');

			const { password: pass_temp, ...loginData } = propLogIn.toJSON();

			const token = this.getJWTToken({ id: propLogIn.id });

			return {
				data: loginData.username,
				message: 'Sesión iniciada',
				token
			};
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	getJWTToken(payload: JwtPayload) {
		const access_token = this.jwtService.sign(payload);
		return access_token;
	}
}
