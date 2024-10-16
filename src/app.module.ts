import { Module } from '@nestjs/common';
import { UserModule } from './auth/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URI)
	],
	controllers: [],
	providers: []
})
export class AppModule {}
