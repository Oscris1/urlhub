import {
  schemaMigrations,
  addColumns,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    // We'll add migration definitions here later
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'categories',
          columns: [{ name: 'created_at', type: 'number' }],
        }),
      ],
    },
  ],
});
