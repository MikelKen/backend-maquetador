import { IsEmail } from 'class-validator';

export class SingInDto {
  @IsEmail({}, { message: 'El correo no es valido' })
  email: string;

  password: string;
}
