import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('/')
  status() {
    return {
      status: 'running',
      message: 'Backend Gruas App activo 🚀',
      time: new Date().toISOString()
    };
  }
}
