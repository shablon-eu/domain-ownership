export interface Logger {
  error(...msg: any[]): void;
  warn(...msg: any[]): void;
}
