import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SEED,
			signOptions: { expiresIn: '1h' }
		}),
		MailerModule
	]
})
export class UserModule {}
