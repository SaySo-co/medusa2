import { Migration } from '@mikro-orm/migrations';

export class Migration20241227064440 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "partner" ("id" text not null, "name" text not null, "status" text check ("status" in (\'pending\', \'active\', \'inactive\')) not null default \'pending\', "stripe_connect_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "partner_pkey" primary key ("id"));',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_partner_deleted_at" ON "partner" (deleted_at) WHERE deleted_at IS NULL;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "partner" cascade;');
  }
}
