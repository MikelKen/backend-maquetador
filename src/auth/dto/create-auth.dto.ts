import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateAuthDto {
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  name: string;

  @IsEmail({}, { message: 'El correo no es valido' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
