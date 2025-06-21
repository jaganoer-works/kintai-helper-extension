import { 
  AttendanceConfig, 
  ExistingData, 
  HasData, 
  ProcessResult, 
  TargetRow, 
  AttendanceData 
} from '../types';
import { Logger } from '../utils/logger';

export class AttendanceService {
  private config: AttendanceConfig;
  private logger: Logger;

  constructor(config: AttendanceConfig) {
    this.config = config;
    this.logger = new Logger(config.enableLogging);
  }

  // 勤怠データを取得
  private getAttendanceData(): AttendanceData | null {
    const jsonScript = document.querySelector('script[data-admin--employees--bulk-attendances-target="json"]');
    if (!jsonScript) {
      this.logger.error('勤怠データが見つかりません');
      return null;
    }

    try {
      const data = JSON.parse(jsonScript.textContent || '') as AttendanceData;
      this.logger.info(`勤怠データを取得しました: ${data.attendance_models_json.length}日分`);
      return data;
    } catch (e) {
      this.logger.error(`JSONデータの解析に失敗しました: ${e instanceof Error ? e.message : 'Unknown error'}`);
      return null;
    }
  }

  // 指定した勤怠区分の行を取得
  private getTargetRows(dayType: string = this.config.targetDayType): TargetRow[] {
    const rows = document.querySelectorAll('table.attendance-table-contents tbody tr');
    const targetRows: TargetRow[] = [];

    rows.forEach((row, index) => {
      const classificationCell = row.querySelector('.column-classification div');
      if (classificationCell && classificationCell.textContent?.trim() === dayType) {
        targetRows.push({
          row: row,
          index: index,
          day: index + 1,
          dayType: dayType
        });
      }
    });

    this.logger.info(`${dayType}の行を${targetRows.length}件見つけました`);
    return targetRows;
  }

  // 入力フィールドを取得（列の位置を指定）
  private getInputField(row: Element, columnIndex: number): HTMLInputElement | null {
    const cells = row.querySelectorAll('.column-attendance-record');
    if (cells.length > columnIndex) {
      const input = cells[columnIndex].querySelector('input[type="text"]') as HTMLInputElement;
      return input;
    }
    return null;
  }

  // 各項目の既存データをチェック
  private checkExistingData(row: Element): { existingData: ExistingData; hasData: HasData } {
    const inputs = row.querySelectorAll('.column-attendance-record input[type="text"]');
    const existingData: ExistingData = {
      clockIn: inputs[0] ? (inputs[0] as HTMLInputElement).value.trim() : '',
      clockOut: inputs[1] ? (inputs[1] as HTMLInputElement).value.trim() : '',
      breakStart: inputs[2] ? (inputs[2] as HTMLInputElement).value.trim() : '',
      breakEnd: inputs[3] ? (inputs[3] as HTMLInputElement).value.trim() : ''
    };

    const hasData: HasData = {
      clockIn: existingData.clockIn !== '',
      clockOut: existingData.clockOut !== '',
      breakStart: existingData.breakStart !== '',
      breakEnd: existingData.breakEnd !== ''
    };

    return { existingData, hasData };
  }

  // 既存データの詳細を表示
  private logExistingData(day: number, existingData: ExistingData, hasData: HasData): void {
    if (this.config.showDetailedLog) {
      this.logger.info(`${day}日の既存データ状況:`);
      const clockInStatus = this.config.useClockIn ? (hasData.clockIn ? '← スキップ' : '← 設定予定') : '← 入力対象外';
      const clockOutStatus = this.config.useClockOut ? (hasData.clockOut ? '← スキップ' : '← 設定予定') : '← 入力対象外';
      const breakStartStatus = this.config.useBreakStart ? (hasData.breakStart ? '← スキップ' : '← 設定予定') : '← 入力対象外';
      const breakEndStatus = this.config.useBreakEnd ? (hasData.breakEnd ? '← スキップ' : '← 設定予定') : '← 入力対象外';

      this.logger.info(`  出勤: ${existingData.clockIn || '(未入力)'} ${clockInStatus}`);
      this.logger.info(`  退勤: ${existingData.clockOut || '(未入力)'} ${clockOutStatus}`);
      this.logger.info(`  休憩開始: ${existingData.breakStart || '(未入力)'} ${breakStartStatus}`);
      this.logger.info(`  休憩終了: ${existingData.breakEnd || '(未入力)'} ${breakEndStatus}`);
    }
  }

  // 時刻を入力
  private setTimeValue(input: HTMLInputElement, timeValue: string, fieldName: string): boolean {
    try {
      input.value = '';
      input.value = timeValue;

      const events = ['input', 'change', 'blur'];
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        input.dispatchEvent(event);
      });

      return true;
    } catch (e) {
      this.logger.error(`${fieldName}設定エラー: ${e instanceof Error ? e.message : 'Unknown error'}`);
      return false;
    }
  }

  // 項目別に勤怠時間を設定
  public setWorkdayScheduleByField(): ProcessResult {
    const targetRows = this.getTargetRows();
    // 勤怠データの取得（ログ出力用）
    this.getAttendanceData();

    if (!targetRows.length) {
      this.logger.warn('対象となる行が見つかりません');
      return {
        success: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
        error: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
        skipped: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
        ignored: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
        total: targetRows.length
      };
    }

    const result: ProcessResult = {
      success: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
      error: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
      skipped: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
      ignored: { clockIn: 0, clockOut: 0, breakStart: 0, breakEnd: 0 },
      total: targetRows.length
    };

    this.logger.info(`処理開始: ${targetRows.length}件の${this.config.targetDayType}を項目別に処理します`);

    targetRows.forEach(({ row, day }) => {
      try {
        const { existingData, hasData } = this.checkExistingData(row);
        this.logExistingData(day, existingData, hasData);

        // 出勤時刻（1列目）
        const clockInInput = this.getInputField(row, 0);
        if (clockInInput) {
          if (!this.config.useClockIn) {
            this.logger.info(`${day}日: 出勤時刻は入力対象外のためスキップ`);
            result.ignored.clockIn++;
          } else if (this.config.skipClockIn && hasData.clockIn) {
            this.logger.warn(`${day}日: 出勤時刻「${existingData.clockIn}」が既存のためスキップ`);
            result.skipped.clockIn++;
          } else {
            if (this.setTimeValue(clockInInput, this.config.startTime, '出勤時刻')) {
              this.logger.info(`${day}日: 出勤時刻を${this.config.startTime}に設定`);
              result.success.clockIn++;
            } else {
              this.logger.error(`${day}日: 出勤時刻設定に失敗`);
              result.error.clockIn++;
            }
          }
        }

        // 退勤時刻（2列目）
        const clockOutInput = this.getInputField(row, 1);
        if (clockOutInput) {
          if (!this.config.useClockOut) {
            this.logger.info(`${day}日: 退勤時刻は入力対象外のためスキップ`);
            result.ignored.clockOut++;
          } else if (this.config.skipClockOut && hasData.clockOut) {
            this.logger.warn(`${day}日: 退勤時刻「${existingData.clockOut}」が既存のためスキップ`);
            result.skipped.clockOut++;
          } else {
            if (this.setTimeValue(clockOutInput, this.config.endTime, '退勤時刻')) {
              this.logger.info(`${day}日: 退勤時刻を${this.config.endTime}に設定`);
              result.success.clockOut++;
            } else {
              this.logger.error(`${day}日: 退勤時刻設定に失敗`);
              result.error.clockOut++;
            }
          }
        }

        // 休憩開始時刻（3列目）
        const breakStartInput = this.getInputField(row, 2);
        if (breakStartInput) {
          if (!this.config.useBreakStart) {
            this.logger.info(`${day}日: 休憩開始時刻は入力対象外のためスキップ`);
            result.ignored.breakStart++;
          } else if (this.config.skipBreakStart && hasData.breakStart) {
            this.logger.warn(`${day}日: 休憩開始時刻「${existingData.breakStart}」が既存のためスキップ`);
            result.skipped.breakStart++;
          } else {
            if (this.setTimeValue(breakStartInput, this.config.breakStartTime, '休憩開始時刻')) {
              this.logger.info(`${day}日: 休憩開始時刻を${this.config.breakStartTime}に設定`);
              result.success.breakStart++;
            } else {
              this.logger.error(`${day}日: 休憩開始時刻設定に失敗`);
              result.error.breakStart++;
            }
          }
        }

        // 休憩終了時刻（4列目）
        const breakEndInput = this.getInputField(row, 3);
        if (breakEndInput) {
          if (!this.config.useBreakEnd) {
            this.logger.info(`${day}日: 休憩終了時刻は入力対象外のためスキップ`);
            result.ignored.breakEnd++;
          } else if (this.config.skipBreakEnd && hasData.breakEnd) {
            this.logger.warn(`${day}日: 休憩終了時刻「${existingData.breakEnd}」が既存のためスキップ`);
            result.skipped.breakEnd++;
          } else {
            if (this.setTimeValue(breakEndInput, this.config.breakEndTime, '休憩終了時刻')) {
              this.logger.info(`${day}日: 休憩終了時刻を${this.config.breakEndTime}に設定`);
              result.success.breakEnd++;
            } else {
              this.logger.error(`${day}日: 休憩終了時刻設定に失敗`);
              result.error.breakEnd++;
            }
          }
        }

      } catch (e) {
        this.logger.error(`${day}日の処理中にエラーが発生: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    });

    this.logResultSummary(result);
    return result;
  }

  // 結果サマリーを表示
  private logResultSummary(result: ProcessResult): void {
    this.logger.info('処理完了サマリー:');
    this.logger.info(`  出勤時刻: 成功${result.success.clockIn}件, エラー${result.error.clockIn}件, スキップ${result.skipped.clockIn}件, 対象外${result.ignored.clockIn}件`);
    this.logger.info(`  退勤時刻: 成功${result.success.clockOut}件, エラー${result.error.clockOut}件, スキップ${result.skipped.clockOut}件, 対象外${result.ignored.clockOut}件`);
    this.logger.info(`  休憩開始: 成功${result.success.breakStart}件, エラー${result.error.breakStart}件, スキップ${result.skipped.breakStart}件, 対象外${result.ignored.breakStart}件`);
    this.logger.info(`  休憩終了: 成功${result.success.breakEnd}件, エラー${result.error.breakEnd}件, スキップ${result.skipped.breakEnd}件, 対象外${result.ignored.breakEnd}件`);
  }

  // 設定を更新
  public updateConfig(newConfig: Partial<AttendanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.setLoggingEnabled(this.config.enableLogging);
  }
} 