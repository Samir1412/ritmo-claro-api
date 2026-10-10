import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async obtener(id: number, usuarioId: number) {
    const habito = await this.prisma.habito.findUnique({
      where: { id },
    });

    if (!habito) {
      throw new NotFoundException('Hábito no encontrado');
    }

    if (habito.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para acceder a este hábito');
    }

    return habito;
  }
}