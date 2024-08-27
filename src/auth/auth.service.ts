import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';

@Injectable()
export class AuthService {
  findAll
    () {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!user || !isValidPassword) return null;
    return user;
  }
  async login(user: any) {
    const payload = { username: user.email, sub: user._id, roles: user.role };
    await this.usersService.setOnline(user.email, true);
    return {

      user: {
        email: user.email,
        _id: user.id,
        name: user.name
      },
      access_token: this.jwtService.sign(payload),
    };
  }
  async logout(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException("Tài khoản không tồn tại.");
      }
      await this.usersService.setOnline(email, false);
      return { message: 'Đăng xuất thành công' };
    } catch (error) {
      throw new BadRequestException(`Lỗi khi đăng xuất: ${error.message}`);
    }
  }
  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto)
  }

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data)
  }

  retryAtive = async (data: string) => {
    return await this.usersService.retryAtive(data)
  }

  retryPassword = async (data: string) => {
    return await this.usersService.retryPassword(data)
  }
  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.changePassword(data)
  }


}