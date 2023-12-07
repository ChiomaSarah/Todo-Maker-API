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

@Controller('todos')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  public async create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return await this.todoService.addTask(createTodoDto);
  }

  @Get()
  public async findAll() {
    return await this.todoService.getTasks();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.todoService.getTask(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body('status', TodoStatusValidationPipe) status: TodoStatus,
  ) {
    return await this.todoService.updateTask(id, status);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return await this.todoService.removeTask(id);
  }
}
