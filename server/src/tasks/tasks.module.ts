import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskAccessGuard } from './guards/task-access.guard';
import { TaskOwnerGuard } from './guards/task-owner.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskAccessGuard, TaskOwnerGuard],
})
export class TasksModule {}