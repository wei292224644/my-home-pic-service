export enum PhotoType {
    Image = "Image",
    Video = "Video"
}
export class Photo {
    id: number;
    src: string;
    type: PhotoType;
    date: number;

    constructor(partial: Partial<Photo>) {
        Object.assign(this, partial);
    }

}
