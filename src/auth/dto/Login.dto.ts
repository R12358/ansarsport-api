import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  identifier: string; // ایمیل یا شماره

  @IsString()
  password: string;
}
