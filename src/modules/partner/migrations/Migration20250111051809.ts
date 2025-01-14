import { Migration } from '@mikro-orm/migrations';

export class Migration20250111051809 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "partner_address" ("id" text not null, "address_1" text not null, "address_2" text null, "city" text null, "province" text null, "postal_code" text null, "country_code" text null, "metadata" jsonb null, "partner_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "partner_address_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table if exists "partner_address" add constraint "partner_address_partner_id_unique" unique ("partner_id");',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_partner_address_partner_id" ON "partner_address" (partner_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_partner_address_deleted_at" ON "partner_address" (deleted_at) WHERE deleted_at IS NULL;',
    );

    this.addSql(
      'alter table if exists "partner_address" add constraint "partner_address_partner_id_foreign" foreign key ("partner_id") references "partner" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "partner_address" cascade;');
  }
}
