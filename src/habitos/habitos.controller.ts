import { Controller, Post, Get, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HabitosService } from './habitos.service';
import { CrearHabitoDto } from './dto/crear-habito.dto';
import { ActualizarHabitoDto } from './dto/actualizar-habito.dto';
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

  @Get(':id')
  obtener(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number },
  ) {
    return this.habitosService.obtener(id, usuario.id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number },
    @Body() dto: ActualizarHabitoDto,
  ) {
    return this.habitosService.actualizar(id, usuario.id, dto);
  }

  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number },
  ) {
    return this.habitosService.eliminar(id, usuario.id);
  }
}