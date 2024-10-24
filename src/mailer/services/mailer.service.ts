import { BadRequestException, Injectable } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';
import { MailData } from '../interfaces/mail-data.interface';

@Injectable()
export class MailerService {
	constructor() {}

	async sendMail(mailData: MailData, template: string) {
		try {
			const apiKey = process.env.BREVO_APIKEY;

			const apiInstance = new Brevo.TransactionalEmailsApi();
			apiInstance.setApiKey(0, apiKey);

			await apiInstance.sendTransacEmail({
				sender: mailData.sender,
				to: mailData.to,
				subject: mailData.subject,
				htmlContent: template
			});

			return true;
		} catch (error) {
			throw new BadRequestException('Error al enviar el email');
		}
	}
}
