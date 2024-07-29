import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from './../events/event.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: '54.91.244.102',
    port: 3306,
    username: 'root',
    password: 'example',
    database: 'nest-events',
    //host: process.env.DB_HOST,
    //port: Number(process.env.DB_PORT),
    //username: process.env.DB_USER,
    //password: process.env.DB_PASSWORD,
    //database: process.env.DB_NAME,
    entities: [Event],
    synchronize: false,
    dropSchema: false,
  }),
);
