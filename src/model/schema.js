import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'categories',
      columns: [{ name: 'name', type: 'string' }],
    }),
    tableSchema({
      name: 'links',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'category_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});
