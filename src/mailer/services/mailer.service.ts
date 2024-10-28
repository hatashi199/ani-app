import { BadRequestException, Injectable } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';
import { MailData } from '../interfaces/mail-data.interface';
import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
	constructor() {}

	async sendMail(mailData: MailData, recoverCode?: string): Promise<boolean> {
		try {
			const apiInstance = new Brevo.TransactionalEmailsApi();

			apiInstance.setApiKey(
				Brevo.TransactionalEmailsApiApiKeys.apiKey,
				process.env.BREVO_APIKEY
			);

			const templatePath = path.join(
				__dirname,
				'../../../src/mailer/templates/reset-pass.template.html'
			);

			let emailTemplate = readFileSync(templatePath, 'utf8');

			emailTemplate = emailTemplate.replace('{{CODE}}', recoverCode);
			emailTemplate = emailTemplate.replace(
				'{{CURRENT_YEAR}}',
				new Date().getFullYear().toString()
			);

			const sendSmtpEmail = new Brevo.SendSmtpEmail();

			sendSmtpEmail.sender = { email: mailData.sender };
			sendSmtpEmail.to = [{ email: mailData.to }];
			sendSmtpEmail.subject = mailData.subject;
			sendSmtpEmail.htmlContent = emailTemplate;

			await apiInstance.sendTransacEmail(sendSmtpEmail);

			return true;
		} catch (error) {
			throw new BadRequestException('Error al enviar el email', error);
		}
	}
}
