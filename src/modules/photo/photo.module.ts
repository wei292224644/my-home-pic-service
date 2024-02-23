import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo, PhotoSchema } from './schemas/photo.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: Photo.name,
      useFactory: async (connection: Connection) => {

        const schema = PhotoSchema;
        const AutoIncrement = AutoIncrementFactory(connection);

        schema.plugin(AutoIncrement, { inc_field: 'id' });

        return schema;
      },
      inject: [getConnectionToken()],
    }])
  ],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule { }
