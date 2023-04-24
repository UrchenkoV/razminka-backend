import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UsersService } from 'src/users/users.service';
import { lang } from 'src/utils/lang/lang';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const data = { id: payload.sub, email: payload.email };

    const user = await this.usersService.findByCond(data);

    if (!user) {
      throw new UnauthorizedException(lang.ru.forbidden);
    }

    const { password, ...userData } = user;

    return userData;
  }
}
