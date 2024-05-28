import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          database: config.get<string>('database.database'),
          username: config.get<string>('database.user'),
          password: config.get('database.password'),
          entities: ['dist/entities/*.entity{.js,.ts}'],
          bigNumberStrings: false,
          extra: {
            decimalNumbers: true,
          },
          synchronize: true,
          logging: true,
          timezone: 'Z',
        };
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {}
