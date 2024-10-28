import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class UserAdminGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const request = context.switchToHttp().getRequest();

			const user = request['user'];

			if (!user) {
				throw new UnauthorizedException('Usuario no autenticado');
			}

			if (!user.role.includes('admin')) {
				throw new UnauthorizedException(
					'Se requieren permisos de administrador para realizar esta acción'
				);
			}

			return true;
		} catch (error) {
			throw error;
		}
	}
}
