import { Model, Query } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { text, children, date, writer } from '@nozbe/watermelondb/decorators';
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

  // @ts-ignore
  @writer async deleteCategory() {
    const relatedLinks = await this.links.fetch();
    const updates = relatedLinks.map((link) =>
      link.prepareUpdate(() => {
        link.category.id = null;
      })
    );
    const deleteOperation = this.prepareDestroyPermanently();

    await this.batch(...updates, deleteOperation);
  }
}
