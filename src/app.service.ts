import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): {
    message: string;
    statusCode: number;
  } {
    return {
      message: 'API is running',
      statusCode: HttpStatus.OK,
    };
  }
}
