import { OmitType } from "@nestjs/swagger";
import { Photo } from "../entities/photo.entity";

export class CreatePhotoDto extends OmitType(Photo, ["id"] as const) {
}
