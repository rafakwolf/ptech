import {MigrationInterface, QueryRunner} from "typeorm";

export class ResetPassword1588812575416 implements MigrationInterface {
    name = 'ResetPassword1588812575416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPassToken" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPassTokenExpires" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPassTokenExpires"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPassToken"`, undefined);
    }

}
