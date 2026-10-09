import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { EstadoHabito, Frecuencia } from '../../generated/prisma/client';

export class CrearHabitoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsEnum(EstadoHabito)
  estado?: EstadoHabito;

  @IsOptional()
  @IsEnum(Frecuencia)
  frecuencia?: Frecuencia;
}