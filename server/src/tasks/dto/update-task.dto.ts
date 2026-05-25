import { IsString, IsOptional, IsArray, IsEnum, MinLength } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class UpdateTaskDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsArray()
  @IsOptional()
  assignees?: string[];
}