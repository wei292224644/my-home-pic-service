import { OmitType } from "@nestjs/swagger";
import { Photo } from "../entities/photo.entity";

export class UpdatePhotoDto extends OmitType(Photo, ["id"] as const) {
}