import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  public async userSignUp(registerUserDto: RegisterUserDto) {
    const { username, email, password } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserEntity();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;

    this.userRepo.create(user);
    try {
      return await this.userRepo.save(user);
    } catch (error) {
      throw new BadRequestException('Error saving user', error.message);
    }

    //   const token = this.jwtService.sign({ id: user._id });
    //   return { token };
    // }
  }

  public async userSignIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid Email or email not found',
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException({ message: 'Invalid Password' });
    }
    const token = this.jwtService.sign({ id: user.id });
    return { token, message: ' Login Successful!' };
  }
}
