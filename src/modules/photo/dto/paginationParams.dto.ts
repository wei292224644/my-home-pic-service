import { ApiProperty } from "@nestjs/swagger";

export class PaginationParams {
    @ApiProperty()
    startId?: number;
    @ApiProperty()
    skip?: number;
    @ApiProperty()
    limit?: number;
}