import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SingInDto } from './dto/sing-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const exist = await this.userRepo.findBy({ email: createAuthDto.email });
    console.log('==========', exist);
    if (exist.length > 0)
      throw new ConflictException('El correo ya esta registrado');

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const user = this.userRepo.create({
      ...createAuthDto,
      password: hashedPassword,
    });
    return await this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('No se encontro el usuario');
    return user;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrador');
    Object.assign(user, updateAuthDto);
    return this.userRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrador');
    await this.userRepo.remove(user);
  }

  async signIn(signInDto: SingInDto) {
    const { email, password } = signInDto;

    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      access_token: token,
    };
  }
}
