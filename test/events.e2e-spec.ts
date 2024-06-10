import { HttpCode, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { DataSource } from "typeorm";
import { AppModule } from "./../src/app.module";
import { User } from "./../src/auth/user.entity";
import { loadFixtures as loadFixturesBase, tokenForUser as tokenForUserBase } from './utils';

let app: INestApplication;
let mod: TestingModule;
let dataSource: DataSource;

const clearDatabase = async () => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query(`DELETE FROM events`);
  await queryRunner.query(`DELETE FROM user`);
  await queryRunner.release();
};

const loadFixtures = async (sqlFileName: string) => {
  await clearDatabase();
  loadFixturesBase(dataSource, sqlFileName);
};

const tokenForUser = (
  user: Partial<User> = {
    id: 1,
    username: 'e2e-test',
  }
): string => tokenForUserBase(app, user);

describe('Events (e2e)', () => {
  beforeEach(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    dataSource = app.get(DataSource);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return an empty list of events', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(response.body.data.length).toBe(0);
      });
  });

  it('should return a single event', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .get('/events/1')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe('Interesting Party');
      })
  });

  it('should return a list of (2) events', async () => {
    await loadFixtures('2-events-1-user.sql');

    return request(app.getHttpServer())
      .get(`/events`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(response.body.first).toBe(1);
        expect(response.body.last).toBe(2);
        expect(response.body.limit).toBe(2);
        expect(response.body.total).toBe(2);
      })
  });

  it('should throw a an error when creating event being unauthenticated', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw an error when creating event with wrong input', async () => {
    await loadFixtures('1-user.sql');

    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(HttpStatus.BAD_REQUEST)
      .then(response => {
        expect(response.body).toMatchObject({
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            'The name length is wrong',
            'name must be a string',
            'description must be longer than or equal to 5 characters',
            'when must be a valid ISO 8601 date string',
            'address must be longer than or equal to 5 characters'
          ],
          error: 'Bad Request'
        });
      });
  });

  it('should create an event', async () => {
    await loadFixtures('1-user.sql');
    const when = (new Date).toISOString();

    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'E2e Event',
        description: 'A fake event from e2e tests',
        when,
        address: 'Street 123'
      })
      .expect(HttpStatus.CREATED)
      .then(_ => {
        return request(app.getHttpServer())
          .get('/events/1')
          .expect(HttpStatus.OK)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              name: 'E2e Event',
              description: 'A fake event from e2e tests',
              address: 'Street 123'
            });
          })
      });
  });

  it('should throw an error when changing non existing event', () => {
    return request(app.getHttpServer())
      .put('/events/100')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should throw an error when changing an event of other user', async () => {
    await loadFixtures('1-event-2-users.sql');

    return request(app.getHttpServer())
      .patch('/events/1')
      .set('Authorization', `Bearer ${tokenForUser({ id: 2, username: 'nasty' })}`)
      .send({
        name: 'Updated event name'
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('should update an event name', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .patch('/events/1')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'Updated event name'
      })
      .expect(HttpStatus.OK).then(response => {
        expect(response.body.name).toBe('Updated event name');
      });
  });

  it('should remove an event', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .delete('/events/1')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(HttpStatus.NO_CONTENT).then(response => {
        return request(app.getHttpServer())
          .get('/events/1')
          .expect(HttpStatus.NOT_FOUND);
      })
  });

  it('should throw an error when removing an event of other user', async () => {
    await loadFixtures('1-event-2-users.sql');

    return request(app.getHttpServer())
      .delete('/events/1')
      .set('Authorization', `Bearer ${tokenForUser({ id: 2, username: 'nasty' })}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('should throw an error when removing non existing event', async () => {
    await loadFixtures('1-user.sql');

    return request(app.getHttpServer())
      .delete('/events/100')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});