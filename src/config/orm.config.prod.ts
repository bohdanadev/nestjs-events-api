import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: '54.91.244.102',
    port: 3306,
    username: 'root',
    password: 'example',
    database: 'nest-events',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: false,
    dropSchema: false,
  }),
);
