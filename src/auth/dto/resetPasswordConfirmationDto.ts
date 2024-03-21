import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasswordCorfirmationDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string
}