import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PhotoType } from '../entities/photo.entity';

export type PhotoDocument = HydratedDocument<Photo>;
@Schema(
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                delete ret.__v;
                delete ret._id;
            },
        }
    }
)

export class Photo {
    @Prop({
        type: mongoose.Schema.Types.Number,
        index: true,
    })
    id?: number;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    src: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    type: PhotoType;

    @Prop({
        type: mongoose.Schema.Types.Number,
        index: true,
        required: true
    })
    date: number;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
