import { AttendanceService } from './services/attendanceService';
import { AttendanceConfig, ProcessResult } from './types';

// デフォルト設定
const DEFAULT_CONFIG: AttendanceConfig = {
  startTime: '09:00',
  endTime: '18:00',
  breakStartTime: '12:00',
  breakEndTime: '13:00',
  targetDayType: '平日',
  enableLogging: true,
  showDetailedLog: true,
  useClockIn: true,
  useClockOut: true,
  useBreakStart: true,
  useBreakEnd: true,
  skipClockIn: true,
  skipClockOut: true,
  skipBreakStart: true,
  skipBreakEnd: true
};

class AttendanceAutomation {
  private service: AttendanceService;
  private config: AttendanceConfig;

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.service = new AttendanceService(this.config);
    this.initialize();
  }

  private initialize(): void {
    // メッセージリスナーを設定
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      this.handleMessage(message, sendResponse).catch(error => {
        console.error('メッセージ処理中にエラーが発生:', error);
        sendResponse({ 
          success: false, 
          error: `メッセージ処理中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}` 
        });
      });
      return true; // 非同期レスポンスのため
    });

    console.log('勤怠管理システム 一括入力拡張機能が読み込まれました');
  }

  private async handleMessage(message: any, sendResponse: (response: any) => void): Promise<void> {
    switch (message.type) {
      case 'EXECUTE_ATTENDANCE_INPUT':
        await this.executeAttendanceInput(message.config, sendResponse);
        break;
      case 'GET_CONFIG':
        sendResponse({ config: this.config });
        break;
      case 'UPDATE_CONFIG':
        this.updateConfig(message.config, sendResponse);
        break;
      default:
        sendResponse({ error: 'Unknown message type' });
    }
  }

  private async executeAttendanceInput(config: Partial<AttendanceConfig>, sendResponse: (response: any) => void): Promise<void> {
    try {
      // 設定を更新
      if (config) {
        this.config = { ...this.config, ...config };
        this.service.updateConfig(this.config);
      }

      // 勤怠入力処理を実行
      const result: ProcessResult = await this.service.setWorkdayScheduleByField();

      // 結果を計算
      const totalSuccess = result.success.clockIn + result.success.clockOut + result.success.breakStart + result.success.breakEnd;
      const totalError = result.error.clockIn + result.error.clockOut + result.error.breakStart + result.error.breakEnd;
      const totalSkipped = result.skipped.clockIn + result.skipped.clockOut + result.skipped.breakStart + result.skipped.breakEnd;
      const totalIgnored = result.ignored.clockIn + result.ignored.clockOut + result.ignored.breakStart + result.ignored.breakEnd;

      // 結果メッセージを作成
      const message = `項目別勤怠時間設定が完了しました。

設定内容:
- 出勤時刻: ${this.config.startTime} (入力: ${this.config.useClockIn ? '有効' : '無効'}, スキップ: ${this.config.skipClockIn ? '有効' : '無効'})
- 退勤時刻: ${this.config.endTime} (入力: ${this.config.useClockOut ? '有効' : '無効'}, スキップ: ${this.config.skipClockOut ? '有効' : '無効'})
- 休憩開始: ${this.config.breakStartTime} (入力: ${this.config.useBreakStart ? '有効' : '無効'}, スキップ: ${this.config.skipBreakStart ? '有効' : '無効'})
- 休憩終了: ${this.config.breakEndTime} (入力: ${this.config.useBreakEnd ? '有効' : '無効'}, スキップ: ${this.config.skipBreakEnd ? '有効' : '無効'})
- 対象: ${this.config.targetDayType}

結果サマリー:
- 合計行数: ${result.total}件
- 総成功: ${totalSuccess}件
- 総エラー: ${totalError}件
- 総スキップ: ${totalSkipped}件
- 総対象外: ${totalIgnored}件

詳細結果:
- 出勤時刻: 成功${result.success.clockIn}件, エラー${result.error.clockIn}件, スキップ${result.skipped.clockIn}件, 対象外${result.ignored.clockIn}件
- 退勤時刻: 成功${result.success.clockOut}件, エラー${result.error.clockOut}件, スキップ${result.skipped.clockOut}件, 対象外${result.ignored.clockOut}件
- 休憩開始: 成功${result.success.breakStart}件, エラー${result.error.breakStart}件, スキップ${result.skipped.breakStart}件, 対象外${result.ignored.breakStart}件
- 休憩終了: 成功${result.success.breakEnd}件, エラー${result.error.breakEnd}件, スキップ${result.skipped.breakEnd}件, 対象外${result.ignored.breakEnd}件`;

      // アラート表示
      alert(message);

      sendResponse({ 
        success: true, 
        result: result,
        message: message 
      });

    } catch (error) {
      const errorMessage = `勤怠入力処理中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage);
      alert(errorMessage);
      sendResponse({ 
        success: false, 
        error: errorMessage 
      });
    }
  }

  private updateConfig(newConfig: Partial<AttendanceConfig>, sendResponse: (response: any) => void): void {
    try {
      this.config = { ...this.config, ...newConfig };
      this.service.updateConfig(this.config);
      sendResponse({ success: true, config: this.config });
    } catch (error) {
      sendResponse({ 
        success: false, 
        error: `設定更新中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  }
}

// 拡張機能を初期化
new AttendanceAutomation(); 