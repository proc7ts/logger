/**
 * Basic logger interface.
 */
export interface Logger {

  /**
   * Logs error.
   *
   * @param args - Log message and arguments.
   */
  error(...args: any[]): void;

  /**
   * Logs warning.
   *
   * @param args - Log message and arguments.
   */
  warn(...args: any[]): void;

  /**
   * Logs informational message.
   *
   * @param args - Log message and arguments.
   */
  info(...args: any[]): void;

  /**
   * Logs debug message.
   *
   * @param args - Log message and arguments.
   */
  debug(...args: any[]): void;

}
