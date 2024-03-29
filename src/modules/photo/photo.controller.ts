import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UploadedFiles, HttpStatus, Query } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { ApiPaginatedResponse, PaginatedDto } from 'src/PaginatedDto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadedResult } from './dto/upload-result.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { getExtName } from 'src/tools/file';
import { v4 as uuidv4 } from 'uuid';
import { PaginationParams } from './dto/paginationParams.dto';


@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @Post()
  async create(@Body() createPhotoDto: CreatePhotoDto) {

    const date = new Date(createPhotoDto.date);
    date.setHours(0, 0, 0, 0);
    const ymd = date.getTime();
    const extName = getExtName(createPhotoDto.filename);
    const fileCacheId = uuidv4();
    const filename = fileCacheId + extName;

    const data: Photo = {
      date: createPhotoDto.date,
      type: createPhotoDto.type,
      filename: createPhotoDto.filename,
      src: ymd + "/" + filename
    }


    //拷贝临时文件到真实路径中
    await this.photoService.moveFileCacheToSource(createPhotoDto, ymd + "", filename);

    //获取到年月日的 timestamp

    //添加到数据库
    await this.photoService.create(data!);
  }

  @Get()
  @ApiPaginatedResponse(Photo, true)
  async findAll(@Query() { skip, limit, startId }: PaginationParams) {
    return await this.photoService.findAll(skip, limit, startId);
  }


  @Get("findOneDay")
  @ApiPaginatedResponse(Photo, true)
  async findOneDay(@Query('timestamp') timestamp: number) {
    return await this.photoService.findOneDay(timestamp);
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
