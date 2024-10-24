import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './services/mailer.service';

@Module({
	providers: [MailerService],
	exports: [MailerService],
	imports: [ConfigModule.forRoot()]
})
export class MailerModule {}
