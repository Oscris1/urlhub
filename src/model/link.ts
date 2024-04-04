import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { text, date, relation } from '@nozbe/watermelondb/decorators';
import Category from './category';

export class Link extends Model {
  static table = 'links';
  static associations: Associations = {
    posts: { type: 'belongs_to', key: 'category_id' },
  };

  // @ts-ignore
  @text('name') name: string;
  // @ts-ignore
  @text('url') url: string;
  // @ts-ignore
  @date('created_at') createdAt: number;
  // @ts-ignore
  // @field('category_id') categoryId;
  @relation('categories', 'category_id') category: Relation<Category>;
}
