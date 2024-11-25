import { Injectable, ConsoleLogger } from '@nestjs/common';
import { appendFileSync, existsSync, mkdirSync, renameSync, statSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const DEFAULT_MAX_SIZE = 1024 * 8;
const COMMON_FILE_NAME = 'common.log';
const ERROR_FILE_NAME = 'error.log';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logFilePath: string;
  private maxSize: number;
  private logLevelNum: number;
  private commonFilePath: string;
  private errorFilePath: string;
  private logLevels: { [key: string]: number } = {
    fatal: 0,
    error: 1,
    warn: 2,
    log: 3,
    debug: 4,
    verbose: 5,
  };

  constructor() {
    super()
    const logDir = join(__dirname, '../../logs/app.log');
    if (!existsSync(logDir)) {
      mkdirSync(logDir);
    }
    this.maxSize = parseInt(
      process.env.LOG_MAX_SIZE ?? String(DEFAULT_MAX_SIZE),
    );
    const envLogLevel = process.env.LOG_LEVEL ?? 'log';
    this.logLevelNum = this.logLevels[envLogLevel] ?? this.logLevels.log;
    this.commonFilePath = join(logDir, COMMON_FILE_NAME);
    this.errorFilePath = join(logDir, ERROR_FILE_NAME);
    this.addErrorListeners();
  }

  addErrorListeners() {
    process.on('uncaughtException', (error: Error) => {
      this.error(`[Uncaught Exception] ${error.message}`, error.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: string) => {
      this.error(`[Unhandled Rejection] ${reason}`);
      process.exit(1);
    });
  }

  private canLog(level: string): boolean {
    const levelValue = this.logLevels[level];
    return levelValue !== undefined && levelValue <= this.logLevelNum;
  }

  private writeLog(filePath: string, message: string) {
    const stats = existsSync(filePath) ? statSync(filePath) : { size: 0 };

    if (stats.size >= this.maxSize) {
        const archivedFilePath = filePath.replace('.log', `-${Date.now()}.log`);
        renameSync(filePath, archivedFilePath);
    }
    appendFileSync(filePath, `${new Date().toISOString()} - ${message}\n`);
  }

  log(message: string, context?: string) {
    if (!this.canLog('log')) return;
    super.log(message, context)
    this.writeLog(
      this.commonFilePath,
      `[LOG] ${message} ${context ?? ''}`,
    );
  }

  error(message: string, context?: string) {
    if (!this.canLog('error')) return;
    super.error(message, context)
    this.writeLog(
      this.errorFilePath,
      `[ERROR] ${message} ${context ?? ''}`,
    );
  }

  warn(message: string, context?: string) {
    if (!this.canLog('warn')) return;
    super.warn(message, context)
    this.writeLog(
      this.commonFilePath,
      `[WARN] ${message} ${context ?? ''}`,
    );
  }

  debug(message: string, context?: string) {
    if (!this.canLog('debug')) return;
    if (this.logLevelNum === 4) {
      super.debug(message, context)
      this.writeLog(
        this.commonFilePath,
        `[DEBUG] ${message} ${context ?? ''}`,
      );
    }
  }

  verbose(message: string, context?: string) {
    if (!this.canLog('verbose')) return;
    if (this.logLevelNum === 5) {
      super.verbose(message, context)
      this.writeLog(
        this.commonFilePath,
        `[VERBOSE] ${message} ${context ?? ''}`,
      );
    }
  }

  fatal(message: string, context?: string) {
    if (!this.canLog('fatal')) return;
    this.writeLog(
      this.errorFilePath,
      `[FATAL] ${message} ${context ?? ''}`,
    );
  }
}
