import { ApiProperty } from "@nestjs/swagger";

export class UploadedResult {
    @ApiProperty()
    cacheFileId: string

    @ApiProperty()
    cacheFilename: string
}
