import { ApiProperty, IntersectionType, OmitType } from "@nestjs/swagger";
import { Photo } from "../entities/photo.entity";
import { UploadedResult } from "./upload-result.dto";

export class CreatePhotoDto extends IntersectionType(OmitType(Photo, ["id", "src"] as const), UploadedResult) {
    @ApiProperty()
    filename: string
}
