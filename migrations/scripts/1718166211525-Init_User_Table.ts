import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitUserTable1718166211525 implements MigrationInterface {
  name = 'InitUserTable1718166211525'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS users
    (
        id uuid NOT NULL,
        "CRE_DT" timestamp without time zone NOT NULL DEFAULT now(),
        "UPD_DT" timestamp without time zone NOT NULL DEFAULT now(),
        "CRE_BY" uuid NOT NULL,
        "UPD_BY" uuid NOT NULL,
        "EMAIL" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "PASSWORD" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "IS_PENDING" boolean NOT NULL DEFAULT true,
        "IS_DISABLE" boolean NOT NULL DEFAULT false,
        "FIRSTNAME" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "LASTNAME" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "GLOBAL_ID" character varying(255) COLLATE pg_catalog."default",
        "OFFICE_CODE" character varying(255) COLLATE pg_catalog."default",
        "COUNTRY" character varying(255) COLLATE pg_catalog."default",
        CONSTRAINT users_pkey PRIMARY KEY (id),
        CONSTRAINT "users_EMAIL_key" UNIQUE ("EMAIL")
    )
    `)

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_users_email
    ON users USING btree
    ("EMAIL" COLLATE pg_catalog."default" ASC NULLS LAST)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email`)

    await queryRunner.query(`DROP TABLE IF EXISTS users`)
  }
}
