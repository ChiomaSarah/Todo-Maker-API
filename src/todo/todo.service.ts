import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity, TodoStatus } from './entities/todo.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity) private repo: Repository<TodoEntity>,
  ) {}

  public async addTask(
    createTodoDto: CreateTodoDto,
    user: UserEntity,
  ): Promise<TodoEntity> {
    try {
      const data = new TodoEntity();
      const { title, description } = createTodoDto;

      (data.title = title),
        (data.description = description),
        (data.status = TodoStatus.OPEN),
        (data.createdDate = createTodoDto.createdDate),
        (data.userId = user.id);
      this.repo.create(data);
      return await this.repo.save(data);
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  public async getTasks(user: UserEntity): Promise<TodoEntity[]> {
    const query = this.repo.createQueryBuilder('todos');
    query.where(`todos.userId = :userId`, { userId: user.id });
    try {
      return await query.getMany();
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  public async getTask(id: string) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException({
        message: `Task with ID: ${id}, not found.`,
      });
    }
    return task;
  }

  public async updateTask(
    id: string,
    status: TodoStatus,
    user: UserEntity,
  ): Promise<TodoEntity> {
    await this.repo.update({ id, userId: user.id }, { status });

    const updatedTask = await this.repo.findOne({ where: { id } });
    if (!updatedTask) {
      throw new NotFoundException({
        message: `Task with ID: ${id}, not found.`,
      });
    }
    return updatedTask;
  }

  public async removeTask(id: string, user: UserEntity): Promise<TodoEntity> {
    await this.repo.delete({ id, userId: user.id });
    const deletedTask = await this.repo.findOne({ where: { id } });
    if (!deletedTask) {
      throw new NotFoundException({
        message: `Sorry, the content you seek with Task ID: ${id}, was not found and may be have been deleted.`,
      });
    }
    return deletedTask;
  }
}
