import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Photo } from './entities/photo.entity';
import { Model } from 'mongoose';
import { getExtName, mkdirs } from 'src/tools/file';
import { nanoid } from 'nanoid';

import { join } from 'path';

import * as fsp from 'fs/promises';
import { FILE_BASE_PATH, FILE_CACHE_PATH, FILE_PHTOT_PATH } from 'src/constant';


@Injectable()
export class PhotoService {
  constructor(@InjectModel(Photo.name) private readonly catModel: Model<Photo>) {
  }

  async create(data: Photo) {
    const createdPhoto = await this.catModel.create<Photo>(data);
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

  async update(id: number, updatePhotoDto: UpdatePhotoDto): Promise<boolean> {
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

  async saveFileToCache(file: Express.Multer.File) {
    const extName = getExtName(file.originalname);
    const fileCacheId = nanoid();
    const filename = fileCacheId + extName;
    const baseUrl = join(FILE_BASE_PATH, FILE_CACHE_PATH);
    mkdirs(baseUrl);
    await fsp.writeFile(join(baseUrl, filename), file.buffer);
    return [fileCacheId, filename];
  }

  async moveFileCacheToSource(createPhotoDto: CreatePhotoDto) {
    const baseUrl = join(FILE_BASE_PATH, FILE_CACHE_PATH);
    const cacheFileUrl = join(baseUrl, createPhotoDto.cacheFilename);
    const stat = await fsp.stat(cacheFileUrl)
    if (!stat.isFile()) {
      throw "没有找到缓存的文件";
    }
    const date = new Date(createPhotoDto.date);
    const folderName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const toBaseUrl = join(FILE_BASE_PATH, FILE_PHTOT_PATH, folderName);
    const fileUrl = join(toBaseUrl, createPhotoDto.filename);
    await mkdirs(toBaseUrl);
    await fsp.copyFile(cacheFileUrl, fileUrl)

    return fileUrl;
  }
}
