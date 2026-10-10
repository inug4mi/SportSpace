import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @Matches(/^[a-zA-Z0-9._%+-]+@udea\.edu\.co$/, {
    message: 'El registro está limitado a correos institucionales @udea.edu.co.',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'La contraseña debe contener al menos letras y números.',
  })
  password: string;
}