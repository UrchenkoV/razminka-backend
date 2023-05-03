import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findBy({ email, password });

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generateJwtToken(data: { id: number; email: string }) {
    const payload = { email: data.email, sub: data.id };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  async login(user: UserEntity) {
    return {
      ...user,
      accessToken: this.generateJwtToken(user),
    };
  }

  async register(dto: CreateUserDto) {
    const { password, ...user } = await this.userService.create(dto);

    return {
      ...user,
      accessToken: this.generateJwtToken(user),
    };
  }
}
