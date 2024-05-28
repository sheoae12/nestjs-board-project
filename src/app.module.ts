import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { PostModule } from './models/post/post.module';
import { AuthModule } from './models/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { GlobalJwtModule } from './common/core/core.module';
import { UserModule } from './models/user/user.module';
import { CommentModule } from './models/comment/comment.module';
import { CategoryModule } from './models/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    GlobalJwtModule,
    DatabaseModule,
    PostModule,
    AuthModule,
    UserModule,
    CommentModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
