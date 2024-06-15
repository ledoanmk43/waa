import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitBlRefreshTokenTable1718436276910 implements MigrationInterface {
  name = 'InitBlRefreshTokenTable1718436276910'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS bl_refresh_tokens
    (
        id uuid NOT NULL,
        "CRE_DT" timestamp without time zone NOT NULL DEFAULT now(),
        "UPD_DT" timestamp without time zone NOT NULL DEFAULT now(),
        "CRE_BY" uuid NOT NULL,
        "UPD_BY" uuid NOT NULL,
        "TOKEN" character varying COLLATE pg_catalog."default" NOT NULL,
        "EXP_DT" timestamp without time zone NOT NULL,
        CONSTRAINT bl_refresh_tokens_pkey PRIMARY KEY (id)
    )`)

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bl_refresh_tokens_tokenstring
    ON bl_refresh_tokens USING btree
    ("TOKEN" COLLATE pg_catalog."default" ASC NULLS LAST)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bl_refresh_tokens_tokenstring`)

    await queryRunner.query(`DROP TABLE IF EXISTS bl_refresh_tokens`)
  }
}
