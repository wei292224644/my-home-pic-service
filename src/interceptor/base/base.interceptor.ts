import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ServerResponse } from 'http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class BaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rep = context.switchToHttp().getResponse() as ServerResponse;
    
    return next.handle().pipe(
      map(data => ({
        code: rep.statusCode,
        success: true,
        message: "",
        data
      })),
      catchError(err => throwError(() => err))
    );
  }
}
