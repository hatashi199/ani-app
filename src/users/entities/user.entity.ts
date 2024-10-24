import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	last_name: string;

	@Prop({ unique: true, required: true })
	username: string;

	@Prop({ unique: true, required: true })
	email: string;

	@Prop({ required: true })
	birth_date: Date;

	@Prop({ default: null })
	avatar: string | null;

	@Prop({
		minlength: 8,
		required: true
	})
	password?: string;

	@Prop()
	description: string;

	@Prop({ type: [String], default: ['user'] })
	role: string[];

	@Prop({ default: true })
	isActive: boolean;

	@Prop({ default: null })
	resetPassCode: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
