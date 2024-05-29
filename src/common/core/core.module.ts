import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get<string>('jwt.accessSecret'),
          // signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class GlobalJwtModule {}
