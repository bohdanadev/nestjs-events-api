import { INestApplication } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { DataSource } from "typeorm";
import { AuthService } from "./../src/auth/auth.service";
import { User } from "./../src/auth/user.entity";

export const tokenForUser = (
  app: INestApplication,
  user: Partial<User> = {
    id: 1,
    username: 'e2e-test',
  }
): string => {
  return app.get(AuthService).getTokenForUser(user as User);
}

//const clearDatabase = async (dataSource: DataSource) => {
  //const queryRunner = dataSource.createQueryRunner();
  //await queryRunner.connect();
  //await queryRunner.query(`DELETE FROM events`);
   //await queryRunner.query(`DELETE FROM user`);
  //await queryRunner.release();
//};

export const loadFixtures = async (
  dataSource: DataSource, sqlFileName: string
) => {
  //await clearDatabase(dataSource);

  const sql = fs.readFileSync(
    path.join(__dirname, 'fixtures', sqlFileName),
    'utf8'
  );

  const queryRunner = dataSource.createQueryRunner('master');

  for (const c of sql.split(';')) {
    await queryRunner.query(c);
  }
}