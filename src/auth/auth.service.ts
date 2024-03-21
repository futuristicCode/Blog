import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SignupDto } from "./dto/signupDto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import * as speakeasy from "speakeasy";
import { MailerService } from "../mailer/mailer.service";
import { SigninDto } from "./dto/signinDto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDemandDto } from "./dto/resetPasswordDemandDto";
import { ResetPasswordConfirmationDto } from "./dto/resetPasswordConfirmationDto";
import { DeleteAccountDto } from "./dto/deleteAccountDto";

@Injectable()
export class AuthService {

  constructor(private readonly prismaService: PrismaService,
              private readonly mailerService: MailerService,
              private readonly jwtService: JwtService,
              private readonly configService: ConfigService) {
  }

  async signup(signupDto: SignupDto) {
    const { email, password, username } = signupDto;
    // ** Verify if the user is signed
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('User Already Exists ');
    // ** Hashed the Password
    const hash = await bcrypt.hash(password, 10);
    // ** Save the user on the Database
    await this.prismaService.user.create({ data: { email, username, password: hash } });
    // ** Send the mail to the comfirmetion
    await this.mailerService.sendSignupConfirmation(email);
    // ** Return the success response
    return { data: 'User created successfully' }
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    // ** Verify if the user is signed
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User Does Not Exists Or Not Found');
    // ** Verify if the password is correct or  Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password Does Not Match ');
    // ** Return the JWT token
    const payload = {
      sub: user.userId,
      email: user.email
    };
    const token = this.jwtService.sign(payload, {
      algorithm: "HS256",
      expiresIn: "2h",
      secret: this.configService.get("SECRET_KEY")
    });
    return {
      token, user: {
        username: user.username,
        email: user.email
      },
    };
  }


  async resetPasswordDemandDto(resetPasswordDemandDto: ResetPasswordDemandDto ) {
    const {email} = resetPasswordDemandDto;
    // ** Verify if the user is signed
    const user = await this.prismaService.user.findUnique({where:{email}});
    if (!user) throw new NotFoundException('User Does Not Exists / Not Found');
    const code = speakeasy.totp({
      secret : this.configService.get("OTP_CODE"),
      digits : 5,
      step: 60 * 15,
      encoding : "base32"
    })
    const url = "http://localhost:3000/auth/reset-password-comfirmation"
    await this.mailerService.sendResetPassword(email,url,code)
    return {data: "Reset Password mail has been sent"}

  }

  async resetPasswordConfirmationDto(resetPasswordConfirmationDto: ResetPasswordConfirmationDto){
    const {email,code,password} = resetPasswordConfirmationDto;
    const user = await this.prismaService.user.findUnique({where:{email}});
    if (!user) throw new NotFoundException('User Does Not Exists / Not Found');
    const isMatch = speakeasy.totp.verify({
      secret : this.configService.get("OTP_CODE"),
      token: code,
      digits : 5,
      step: 60 * 15,
      encoding : "base32"
    });
   if (!isMatch) throw new UnauthorizedException("Invalid / Expired Token")
    const hash = await bcrypt.hash(password,10)
    await this.prismaService.user.update({where:{email},data:{password:hash}})
    return {data: "Password has been updated"}
  }


  async deleteAccountDto(userId: number,deleteAccountDto: DeleteAccountDto){
   const {password} = deleteAccountDto;
   const user = await this.prismaService.user.findUnique({where: {userId}});
   if (!user) throw new NotFoundException("User Not Found")
    // ** Compare the password
    const isMatch = bcrypt.compare(password,user.password)
    if (!isMatch) throw new UnauthorizedException("Password does not match")
    await this.prismaService.user.delete({where:{userId}})
    return {data : "User Successfully Deleted"}
  }

}