import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1686562789123 implements MigrationInterface {
    name = 'InitialSchema1686562789123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "refresh_token" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        
        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "display_name" character varying,
                "bio" character varying,
                "avatar_url" character varying,
                "theme" character varying NOT NULL DEFAULT 'default',
                "is_public" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("user_id"),
                CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")
            )
        `);

        
        await queryRunner.query(`
            CREATE TABLE "links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "url" character varying NOT NULL,
                "description" character varying,
                "is_active" boolean NOT NULL DEFAULT false,
                "order" integer NOT NULL DEFAULT '0',
                "click_count" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id")
            )
        `);

        
        await queryRunner.query(`
            ALTER TABLE "profiles" 
            ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "links" 
            ADD CONSTRAINT "FK_cd413dc2875a473c5eba1c3b2e2" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
            
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_cd413dc2875a473c5eba1c3b2e2"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`);
        
        
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
