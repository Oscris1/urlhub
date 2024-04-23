import { Model, Query } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { text, children, date } from '@nozbe/watermelondb/decorators';
import { Link } from './link';

export default class Category extends Model {
  static table = 'categories';
  static associations: Associations = {
    links: { type: 'has_many', foreignKey: 'category_id' },
  };

  // @ts-ignore
  @text('name') name: string;
  // @ts-ignore
  @date('created_at') createdAt: number;
  // @ts-ignore
  @children('links') links: Query<Link>;
}
