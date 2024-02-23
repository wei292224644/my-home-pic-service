import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class PaginatedDto {
    @ApiProperty()
    code: number;

    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message: string;

}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    model?: TModel,
    isArray: boolean = false
) => {


    const apiExtraModels = model ? ApiExtraModels(PaginatedDto, model) : ApiExtraModels(PaginatedDto);
    const apiOkResponse = model ? ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(PaginatedDto) },
                isArray ? {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(model) },
                        }
                    }
                } : {
                    properties: {
                        data: {
                            $ref: getSchemaPath(model)
                        }
                    }
                },
            ],
        },
    }) : ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(PaginatedDto) },
            ],
        },
    })

    return applyDecorators(
        apiExtraModels,
        apiOkResponse,
    );
};