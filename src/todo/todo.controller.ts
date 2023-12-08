import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoStatus } from './entities/todo.entity';
import { TodoStatusValidationPipe } from 'src/pipes/TodoStatusValidationPipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/auth/entities/user.entity';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  public async create(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
    @User() user: UserEntity,
  ) {
    return await this.todoService.addTask(createTodoDto, user);
  }

  @Get()
  public async findAll(@User() user: UserEntity) {
    return await this.todoService.getTasks(user);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.todoService.getTask(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body('status', TodoStatusValidationPipe) status: TodoStatus,
    @User() user: UserEntity,
  ) {
    return await this.todoService.updateTask(id, status, user);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string, @User() user: UserEntity) {
    return await this.todoService.removeTask(id, user);
  }
}
