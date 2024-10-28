import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException('Se requiere un bearer token');
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SEED
			});

			request['user'] = payload;
		} catch (error) {
			const jwtExpired = new Error(error);

			if (jwtExpired.message.includes('TokenExpiredError: jwt expired')) {
				throw new BadRequestException('Token caducado', error);
			}

			throw error;
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
