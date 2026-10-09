import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { HabitosService } from './habitos.service';
import { CrearHabitoDto } from './dto/crear-habito.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsuarioActual } from '../auth/usuario-actual.decorator';

@Controller('habitos')
@UseGuards(JwtAuthGuard)
export class HabitosController {
  constructor(private readonly habitosService: HabitosService) {}

  @Post()
  crear(
    @UsuarioActual() usuario: { id: number },
    @Body() dto: CrearHabitoDto,
  ) {
    return this.habitosService.crear(usuario.id, dto);
  }

  @Get()
  listar(@UsuarioActual() usuario: { id: number }) {
    return this.habitosService.listar(usuario.id);
  }
}