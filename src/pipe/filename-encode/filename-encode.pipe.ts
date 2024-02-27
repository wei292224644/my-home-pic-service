import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FilenameEncodePipe implements PipeTransform {
  transform(files: Array<Express.Multer.File>) {
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!/[^\u0000-\u00ff]/.test(file.originalname)) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString(
          'utf8',
        );
      }
    }
    return files;
  }
}
