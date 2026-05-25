import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';

@Injectable()
export class TaskAccessGuard implements CanActivate {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const taskId = request.params.id;

    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Tâche introuvable');

    const isOwner = task.owner.toString() === userId;
    const isAssignee = task.assignees.map(a => a.toString()).includes(userId);

    if (!isOwner && !isAssignee) {
      throw new ForbiddenException('Accès refusé');
    }

    request.task = task;
    return true;
  }
}
