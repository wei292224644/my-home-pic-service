import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof UnauthorizedException) {
      response
        .status(200)
        .json({
          code: status,
          success: false,
          message: exception.message,
          data: {},
        });
    } else {
      response
        .status(200)
        .json({
          code: status,
          success: false,
          message: exception.message,
          data: {},
        });
    }
  }
}
