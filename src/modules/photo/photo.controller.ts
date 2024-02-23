import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UploadedFile } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { ApiPaginatedResponse } from 'src/PaginatedDto';

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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
  }
}