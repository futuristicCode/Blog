import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { createTestAccount } from "nodemailer";

@Injectable()
export class MailerService {
  private async transport(){
    const testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
      host:'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
    return transporter
  }

  async sendSignupConfirmation(userEmail: string){
    (await this.transport()).sendMail({
      from: "blog@localhost.mr",
      to: userEmail,
      subject: "Account Confirmation",
      text: "Please confirm your account by clicking the link below",
      html: `<a href="http://localhost:3000/auth/confirm/${userEmail}">Confirm Account</a>`
    });
  }


  async sendResetPassword(userEmail: string, url: string, code: string){
    (await this.transport()).sendMail({
      from: "blog@localhost.mr",
      to: userEmail,
      subject: "Reset Password",
      text: "Please reset your password by clicking the link below",
      html: `
             <a href="${url}">Reset Password</a>
             <p>Secret code : <strong>${code}</strong></p>
             <p>Code will expire in 15 minutes</p>
            `,
    });
  }


}
