import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(dto: CreateTaskDto, userId: string): Promise<TaskDocument> {
    return this.taskModel.create({
      ...dto,
      owner: userId,
      assignees: [...(dto.assignees || []), userId],
    });
  }

  async findAllForUser(userId: string): Promise<TaskDocument[]> {
    return this.taskModel
      .find({
        $or: [{ owner: userId }, { assignees: userId }],
      })
      .populate('owner', 'name email')
      .populate('assignees', 'name email');
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findById(id)
      .populate('owner', 'name email')
      .populate('assignees', 'name email');

    if (!task) throw new NotFoundException('Tâche introuvable');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskDocument> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('owner', 'name email')
      .populate('assignees', 'name email');

    if (!task) throw new NotFoundException('Tâche introuvable');
    return task;
  }

  async remove(id: string): Promise<void> {
    await this.taskModel.findByIdAndDelete(id);
  }
}