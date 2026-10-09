import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearHabitoDto } from './dto/crear-habito.dto';

@Injectable()
export class HabitosService {
  constructor(private prisma: PrismaService) {}

  async crear(usuarioId: number, dto: CrearHabitoDto) {
    return this.prisma.habito.create({
      data: {
        ...dto,
        usuarioId,
      },
    });
  }

  async listar(usuarioId: number) {
    return this.prisma.habito.findMany({
      where: { usuarioId },
    });
  }
}