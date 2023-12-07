import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsNotEmpty()
  @MaxLength(15)
  title: string;

  @IsNotEmpty()
  description: string;

  status: TodoStatus;

  @IsDateString()
  @IsOptional()
  readonly createdDate: Date;
}
