import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitPermissionTable1718173020230 implements MigrationInterface {
  name = 'InitPermissionTable1718173020230'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS permissions
    (
        id uuid NOT NULL,
        "CRE_DT" timestamp without time zone NOT NULL DEFAULT now(),
        "UPD_DT" timestamp without time zone NOT NULL DEFAULT now(),
        "CRE_BY" uuid NOT NULL,
        "UPD_BY" uuid NOT NULL,
        "NAME" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "DESCRIPTION" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "DEL_DT" timestamp without time zone,
        CONSTRAINT permissions_pkey PRIMARY KEY (id),
        CONSTRAINT "permissions_NAME_key" UNIQUE ("NAME")
    )`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS role_permissions
    (
        role_id uuid NOT NULL,
        permission_id uuid NOT NULL,
        "CRE_DT" timestamp without time zone NOT NULL DEFAULT now(),
        "UPD_DT" timestamp without time zone NOT NULL DEFAULT now(),
        CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
        CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
        CONSTRAINT fk_permission FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS permissions CASCADE`)

    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions CASCADE`)
  }
}
