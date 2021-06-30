import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

import { ChatContext } from './ChatContext';

const rotatingFileTransport = new winston.transports.DailyRotateFile({
  dirname: './logs',
  filename: '%DATE%.log',
  datePattern: 'MM-DD-YYYY',
  zippedArchive: true,
  maxFiles: 7,
});

const time = (withDate?: boolean) =>
{
  let timestamp = new Date().toISOString();
  if(! withDate)
    timestamp = timestamp.substr(timestamp.indexOf('T') + 1).replace('Z', '');
  return timestamp;
};

const Logger = winston.createLogger({
  transports: [ rotatingFileTransport ],
  format: format.printf(({ message }) => `[${time()}] ${message}`),
});

enum LogLevels
{
  COMMAND = 'CMD',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
};

export class Log
{
  private static output = (level: LogLevels, content: string, logInConsole?: boolean) =>
  {
    const log = `${level.toString()}: ${content}`;
    Logger.info(log);

    if(logInConsole)
      console.log(`[${time(true)}] ${log}`);
  }

  static info = (message: string, logInConsole?: boolean) =>
    Log.output(LogLevels.INFO, message, logInConsole)

  static warn = (message: string, logInConsole?: boolean) =>
    Log.output(LogLevels.WARNING, message, logInConsole)

  static error = (error: string | Error)  =>
  {
    let log;
    if(typeof error === 'string')
      log = error
    else
      log = error.stack ? error.stack.replace(/Error\:\s+/g, '') : error.message;

    Log.output(LogLevels.ERROR, log, true);
  }

  static command = (context: ChatContext, logInConsole?: boolean) =>
  {
    const log = `(${context.channel}, @${context.tags.username}) ${context.message}`;
    Log.output(LogLevels.COMMAND, log, logInConsole);
  }
}
