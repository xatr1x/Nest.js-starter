import { Injectable, Inject } from '@nestjs/common';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { POST_REPOSITORY } from '../../core/constants';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
  ) {}

  async create(post, userId: number): Promise<Post> {
    const newPost = await this.postRepository.create<Post>({ ...post, userId });
    return newPost;
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll<Post>({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async findOne(id): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async delete(id, userId) {
    return await this.postRepository.destroy({ where: { id, userId } });
  }

  async update(id, data, userId) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.postRepository.update(
        { ...data },
        { where: { id, userId }, returning: true },
      );

    return { numberOfAffectedRows, updatedPost };
  }
}
