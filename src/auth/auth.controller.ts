import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { register } from 'module';
import { CreateAuthDto, CodeAuthDto, ChangePasswordAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}
  @Post("login")
  @Public()
  @ResponseMessage("Fetch Login")
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  @Public()
  async logout(@Body('email') email: string) {
    return this.authService.logout(email);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() data: CodeAuthDto) {
    return this.authService.checkCode(data);
  }


  @Post('retry-active')
  @Public()
  retryActive(@Body("email") email: string) {
    return this.authService.retryAtive(email);
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body("email") email: string) {
    return this.authService.retryPassword(email);
  }
  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
      .sendMail({
        to: 'doduytoann@gmail.com',
        from: 'noreply@nestjs.com',
        subject: 'Testing Nest MailerModule ✔',
        text: 'welcome',
        template: 'register',
        context: {
          name: 'Duy Toan',
          activationCode: 123456789
        }
      })
    return 'OK';
  }
}
