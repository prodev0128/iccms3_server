import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('GLOBAL_LOGGER') private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { ip, method, url } = request;
    const user = request.user ? request.user.userID : 'Guest'; // Extract userID
    const startTime = Date.now();

    this.logger.log(`[Request]  ${method} ${url} - IP: ${ip} - User: ${user}`);

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const duration = Date.now() - startTime;
        this.logger.log(
          `[Response] ${method} ${url} - IP: ${ip} - User: ${user} - Status: ${statusCode} - Time: ${duration}ms`,
        );
      }),
    );
  }
}
