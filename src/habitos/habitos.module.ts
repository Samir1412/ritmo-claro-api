import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HabitosController } from './habitos.controller';
import { HabitosService } from './habitos.service';

@Module({
  imports: [PrismaModule],
  controllers: [HabitosController],
  providers: [HabitosService],
})
export class HabitosModule {}
