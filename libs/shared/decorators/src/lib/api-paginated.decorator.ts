import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Pagination meta schema for Swagger
 */
export const PaginationMetaSchema = {
  type: 'object',
  properties: {
    page: { type: 'number', example: 1 },
    limit: { type: 'number', example: 10 },
    total: { type: 'number', example: 100 },
    totalPages: { type: 'number', example: 10 },
    hasNextPage: { type: 'boolean', example: true },
    hasPreviousPage: { type: 'boolean', example: false },
  },
};

/**
 * Decorator to document paginated responses in Swagger
 * 
 * @example
 * ```typescript
 * @Get()
 * @ApiPaginatedResponse(ProductDto)
 * findAll(@Query() paginationDto: PaginationDto) {
 *   return this.productService.findAll(paginationDto);
 * }
 * ```
 */
export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: PaginationMetaSchema,
            },
          },
        ],
      },
    }),
  );
};
