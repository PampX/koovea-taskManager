import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskAccessGuard } from './guards/task-access.guard';
import { TaskOwnerGuard } from './guards/task-owner.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAllForUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(TaskAccessGuard)
  findOne(@Request() req) {
    return req.task;
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(TaskAccessGuard)
  update(@Body() dto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(req.task._id.toString(), dto);
  }

  @Delete(':id')
  @UseGuards(TaskOwnerGuard)
  remove(@Request() req) {
    return this.tasksService.remove(req.task._id.toString());
  }
}