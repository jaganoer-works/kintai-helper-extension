// 設定オプションの型定義
export interface AttendanceConfig {
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  targetDayType: string;
  enableLogging: boolean;
  showDetailedLog: boolean;
  useClockIn: boolean;
  useClockOut: boolean;
  useBreakStart: boolean;
  useBreakEnd: boolean;
  skipClockIn: boolean;
  skipClockOut: boolean;
  skipBreakStart: boolean;
  skipBreakEnd: boolean;
}

// 既存データの型定義
export interface ExistingData {
  clockIn: string;
  clockOut: string;
  breakStart: string;
  breakEnd: string;
}

// データ存在フラグの型定義
export interface HasData {
  clockIn: boolean;
  clockOut: boolean;
  breakStart: boolean;
  breakEnd: boolean;
}

// 処理結果の型定義
export interface ProcessResult {
  success: {
    clockIn: number;
    clockOut: number;
    breakStart: number;
    breakEnd: number;
  };
  error: {
    clockIn: number;
    clockOut: number;
    breakStart: number;
    breakEnd: number;
  };
  skipped: {
    clockIn: number;
    clockOut: number;
    breakStart: number;
    breakEnd: number;
  };
  ignored: {
    clockIn: number;
    clockOut: number;
    breakStart: number;
    breakEnd: number;
  };
  total: number;
}

// 対象行の型定義
export interface TargetRow {
  row: Element;
  index: number;
  day: number;
  dayType: string;
}

// 勤怠データの型定義
export interface AttendanceData {
  attendance_models_json: any[];
}

// ログレベルの型定義
export type LogLevel = 'info' | 'warn' | 'error';

// メッセージの型定義
export interface Message {
  type: string;
  data?: any;
} 