import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  home() {
    return {
      status: 'running',
      message: 'Backend GruApp activo 🚀'
    };
  }
}
