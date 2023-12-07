import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity, TodoStatus } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity) private repo: Repository<TodoEntity>,
  ) {}

  public async addTask(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    try {
      const data = new TodoEntity();
      const { title, description } = createTodoDto;

      (data.title = title),
        (data.description = description),
        (data.status = TodoStatus.OPEN),
        (data.createdDate = createTodoDto.createdDate);
      this.repo.create(data);
      return await this.repo.save(data);
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  public async getTasks(): Promise<TodoEntity[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  public async getTask(id: string) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException({
        message: `Invalid ID: Task with ID ${id} not found`,
      });
    }
    return task;
  }

  public async updateTask(id: string, status: TodoStatus): Promise<TodoEntity> {
    await this.repo.update({ id }, { status });
    const updatedTask = await this.repo.findOne({ where: { id } });
    if (!updatedTask) {
      throw new NotFoundException({
        message: `Invalid ID: Task with ID ${id} not found`,
      });
    }
    return updatedTask;
  }

  public async removeTask(id: string): Promise<TodoEntity> {
    await this.repo.delete({ id });
    const deletedTask = await this.repo.findOne({ where: { id } });
    if (!deletedTask) {
      throw new NotFoundException({
        message: `Invalid ID: Task with ID ${id} not found`,
      });
    }
    return deletedTask;
  }
}
