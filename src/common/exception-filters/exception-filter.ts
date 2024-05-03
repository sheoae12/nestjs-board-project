import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

// TODO: 별도의 에러코드가 있는 경우 해당 에러코드 메시지를 출력하도록 수정

type exception = {
  message: string | string[];
  error: string;
  statusCode: number;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as exception;
    const message = exceptionResponse.message;

    response.status(status).json({
      message: message,
    });
  }
}
