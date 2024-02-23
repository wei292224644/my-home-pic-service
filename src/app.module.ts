import { Module } from '@nestjs/common';
import { PhotoModule } from './modules/photo/photo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception/http-exception.filter';
import { BaseInterceptor } from './interceptor/base/base.interceptor';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/myhome'),
    PhotoModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: BaseInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
