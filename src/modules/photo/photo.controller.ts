import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UploadedFiles } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo, PhotoType } from './entities/photo.entity';
import { ApiPaginatedResponse } from 'src/PaginatedDto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as fsp from 'fs/promises';
import path, { join } from 'path';
import { mkdirs } from 'src/tools/file';


@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @Post()
  async create(@Body() createPhotoDto: CreatePhotoDto) {
    await this.photoService.create(createPhotoDto);
  }

  @Get()
  @ApiPaginatedResponse(Photo, true)
  async findAll() {
    return await this.photoService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiPaginatedResponse(Photo)
  async findOne(@Param('id') id: string): Promise<Photo> {
    const data = await this.photoService.findOne(+id);
    return new Photo(data)
  }

  @Patch(':id')
  @ApiPaginatedResponse()
  async update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    await this.photoService.update(+id, updatePhotoDto);
  }

  @Delete(':id')
  @ApiPaginatedResponse()
  async remove(@Param('id') id: string) {
    await this.photoService.remove(+id);
  }

  @Post("upload")
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<any>, @Body() body: { lastModifieds: string[] }) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);
      const timestamp = parseInt(body.lastModifieds[i]);
      const date = new Date(timestamp);

      const baseUrl = join(__dirname, "../../public/upload");
      const folderName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const fileName = `${Date.now()}-${file.originalname}`;

      mkdirs(join(baseUrl, folderName));
      await fsp.writeFile(join(baseUrl, folderName, fileName), file.buffer);


      this.create({
        date: timestamp,
        src: fileName,
        type: PhotoType.Image
      })
    }
  }
}
