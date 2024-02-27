import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UploadedFiles, HttpStatus } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { ApiPaginatedResponse, PaginatedDto } from 'src/PaginatedDto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadedResult } from './dto/upload-result.dto';
import { ApiExtraModels } from '@nestjs/swagger';


@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @Post()
  async create(@Body() createPhotoDto: CreatePhotoDto) {

    //拷贝临时文件到真实路径中
    const path = await this.photoService.moveFileCacheToSource(createPhotoDto)

    const data: Photo = {
      date: createPhotoDto.date, 
      type: createPhotoDto.type,
      src: path
    }
    //添加到数据库
    await this.photoService.create(data!);
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
  @ApiExtraModels(PaginatedDto, UploadedResult)
  @ApiPaginatedResponse(UploadedResult, true, HttpStatus.CREATED)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>): Promise<Array<UploadedResult>> {
    const results: Array<UploadedResult> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const [fileCacheId, filename] = await this.photoService.saveFileToCache(file);
      results.push({
        cacheFileId: fileCacheId,
        cacheFilename: filename
      })
    }
    return results
  }
}
