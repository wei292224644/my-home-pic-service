import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Photo } from './schemas/photo.schema';
import { Model } from 'mongoose';

@Injectable()
export class PhotoService {
  constructor(@InjectModel(Photo.name) private readonly catModel: Model<Photo>) {
    // console.log(catModel)
  }

  async create(createPhotoDto: CreatePhotoDto) {
    const createdPhoto = await this.catModel.create(createPhotoDto);
    return createdPhoto;
  }

  async findAll() {
    return await this.catModel.find();
    // return (await this.catModel.find()).map(d => new Photo({ id: d.id, name: d.name, age: d.age, breed: d.breed }));
  }

  async findOne(id: number): Promise<Photo> {
    const data = await this.catModel.findOne({ id }).exec();

    if (!data) {
      throw new Error("not found")
    }

    return data
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto): Promise< boolean> {
    // return `This action updates a #${id} photo`;

    const updatedData = await this.catModel.updateOne({ id }, updatePhotoDto);


    if (updatedData.modifiedCount > 0) {
      return true;
    }

    return false;
  }

  async remove(id: number) {
    return await this.catModel.deleteOne({ id })
  }
}
