import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  autoLoadEntities: true,
  entities: [],
  username: 'halalsenpai',
  password: '959804',
  database: 'taskmanagement',
  synchronize: true,
};
