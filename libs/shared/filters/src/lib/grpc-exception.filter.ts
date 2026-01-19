import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

/**
 * gRPC-specific exception filter
 */
@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<never> {
    const error = exception.getError();
    
    let grpcError: { code: number; message: string; details?: string };

    if (typeof error === 'string') {
      grpcError = {
        code: GrpcStatus.INTERNAL,
        message: error,
      };
    } else if (typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      grpcError = {
        code: this.mapHttpToGrpcStatus(errorObj.statusCode as number),
        message: (errorObj.message as string) || 'Internal error',
        details: JSON.stringify(errorObj.details || {}),
      };
    } else {
      grpcError = {
        code: GrpcStatus.INTERNAL,
        message: 'Internal server error',
      };
    }

    this.logger.error(`gRPC Exception: ${grpcError.message}`, exception.stack);

    return throwError(() => grpcError);
  }

  private mapHttpToGrpcStatus(httpStatus?: number): number {
    if (!httpStatus) return GrpcStatus.INTERNAL;

    const statusMap: Record<number, number> = {
      400: GrpcStatus.INVALID_ARGUMENT,
      401: GrpcStatus.UNAUTHENTICATED,
      403: GrpcStatus.PERMISSION_DENIED,
      404: GrpcStatus.NOT_FOUND,
      409: GrpcStatus.ALREADY_EXISTS,
      422: GrpcStatus.INVALID_ARGUMENT,
      429: GrpcStatus.RESOURCE_EXHAUSTED,
      500: GrpcStatus.INTERNAL,
      503: GrpcStatus.UNAVAILABLE,
    };

    return statusMap[httpStatus] || GrpcStatus.INTERNAL;
  }
}
