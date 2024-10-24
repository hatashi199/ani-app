import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';

@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URI),
		MailerModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
