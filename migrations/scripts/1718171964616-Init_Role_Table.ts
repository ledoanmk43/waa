import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitRoleTable1718171964616 implements MigrationInterface {
  name = 'InitRoleTable1718171964616'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS roles
        (
             id uuid NOT NULL,
            "CRE_DT" timestamp without time zone NOT NULL DEFAULT now(),
            "UPD_DT" timestamp without time zone NOT NULL DEFAULT now(),
            "CRE_BY" uuid NOT NULL,
            "UPD_BY" uuid NOT NULL,
            "NAME" character varying(255) COLLATE pg_catalog."default" NOT NULL,
            "DESCRIPTION" text COLLATE pg_catalog."default",
            CONSTRAINT roles_pkey PRIMARY KEY (id),
            CONSTRAINT "roles_NAME_key" UNIQUE ("NAME")
        )`)

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS user_roles
        (
            user_id uuid NOT NULL,
            role_id uuid NOT NULL,
            CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
            CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
        )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS roles`)

    await queryRunner.query(`DROP TABLE IF EXISTS user_roles`)
  }
}
