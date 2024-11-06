import { Controller, Get } from '@nestjs/common';

@Controller('Track')
export class TrackController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
