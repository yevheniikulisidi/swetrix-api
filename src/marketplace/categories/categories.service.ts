import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { Category } from './category.entity'
import { ICreateCategory } from './interfaces/create-category.interface'
import { ISaveCategory } from './interfaces/save-category.interface'
import { IUpdateCategory } from './interfaces/update-category.interface'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findOne(options: FindOneOptions<Category>): Promise<Category> {
    return await this.categoryRepository.findOne({ ...options })
  }

  async findTitle(title: string): Promise<Category> {
    return await this.findOne({ where: { title }, select: ['title'] })
  }

  create(category: ICreateCategory): Category {
    return this.categoryRepository.create(category)
  }

  async save(category: ISaveCategory): Promise<ISaveCategory & Category> {
    return await this.categoryRepository.save(category)
  }

  async findById(id: number): Promise<Category> {
    return await this.findOne({ where: { id } })
  }

  async update(id: number, category: IUpdateCategory): Promise<void> {
    await this.categoryRepository.update({ id }, category)
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete({ id })
  }
}
