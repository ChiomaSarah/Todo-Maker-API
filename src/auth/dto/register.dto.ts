import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/, {
    message:
      'Password is weak (at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and 8 characters long).',
  })
  password: string;
}
