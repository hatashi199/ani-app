import {
	CanActivate,
	ExecutionContext,
	Injectable,
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
			throw new UnauthorizedException('No existe un bearer token');
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SEED
			});
			console.log(payload);

			request['user'] = payload;

			const { id: userId } = request.params;

			if (payload.id !== userId)
				throw new UnauthorizedException(
					'No tienes permisos para visualizar la información'
				);
		} catch (error) {
			throw error;
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
