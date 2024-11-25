import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
    constructor(){
        super()
    }
}