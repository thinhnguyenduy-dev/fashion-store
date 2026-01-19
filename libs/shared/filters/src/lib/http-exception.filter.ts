import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '@fashion-store/shared-dto';

/**
 * HTTP-specific exception filter
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let validationErrors: unknown;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as Record<string, unknown>;
      message = Array.isArray(responseObj.message) 
        ? responseObj.message.join(', ')
        : (responseObj.message as string) || 'An error occurred';
      validationErrors = responseObj.message;
    } else {
      message = 'An error occurred';
    }

    const correlationId = request.headers['x-correlation-id'] as string;

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: this.getErrorCode(status),
        message,
        details: validationErrors ? { validationErrors } : undefined,
      },
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId,
    };

    this.logger.warn(
      `HTTP Exception: ${request.method} ${request.url} - ${status} - ${message}`,
    );

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
    };
    return codeMap[status] || 'HTTP_ERROR';
  }
}
