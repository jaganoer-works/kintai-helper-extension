import { AttendanceConfig } from './types';

class PopupController {
  private elements!: {
    startTime: HTMLInputElement;
    endTime: HTMLInputElement;
    breakStartTime: HTMLInputElement;
    breakEndTime: HTMLInputElement;
    targetDayType: HTMLSelectElement;
    useClockIn: HTMLInputElement;
    useClockOut: HTMLInputElement;
    useBreakStart: HTMLInputElement;
    useBreakEnd: HTMLInputElement;
    skipClockIn: HTMLInputElement;
    skipClockOut: HTMLInputElement;
    skipBreakStart: HTMLInputElement;
    skipBreakEnd: HTMLInputElement;
    executeBtn: HTMLButtonElement;
    status: HTMLDivElement;
  };

  constructor() {
    this.initializeElements();
    this.loadSavedConfig();
    this.bindEvents();
  }

  private initializeElements(): void {
    this.elements = {
      startTime: document.getElementById('startTime') as HTMLInputElement,
      endTime: document.getElementById('endTime') as HTMLInputElement,
      breakStartTime: document.getElementById('breakStartTime') as HTMLInputElement,
      breakEndTime: document.getElementById('breakEndTime') as HTMLInputElement,
      targetDayType: document.getElementById('targetDayType') as HTMLSelectElement,
      useClockIn: document.getElementById('useClockIn') as HTMLInputElement,
      useClockOut: document.getElementById('useClockOut') as HTMLInputElement,
      useBreakStart: document.getElementById('useBreakStart') as HTMLInputElement,
      useBreakEnd: document.getElementById('useBreakEnd') as HTMLInputElement,
      skipClockIn: document.getElementById('skipClockIn') as HTMLInputElement,
      skipClockOut: document.getElementById('skipClockOut') as HTMLInputElement,
      skipBreakStart: document.getElementById('skipBreakStart') as HTMLInputElement,
      skipBreakEnd: document.getElementById('skipBreakEnd') as HTMLInputElement,
      executeBtn: document.getElementById('executeBtn') as HTMLButtonElement,
      status: document.getElementById('status') as HTMLDivElement
    };
  }

  private loadSavedConfig(): void {
    chrome.storage.sync.get(['attendanceConfig'], (result) => {
      if (result.attendanceConfig) {
        const config = result.attendanceConfig as AttendanceConfig;
        this.setFormValues(config);
      }
    });
  }

  private setFormValues(config: AttendanceConfig): void {
    this.elements.startTime.value = config.startTime;
    this.elements.endTime.value = config.endTime;
    this.elements.breakStartTime.value = config.breakStartTime;
    this.elements.breakEndTime.value = config.breakEndTime;
    this.elements.targetDayType.value = config.targetDayType;
    this.elements.useClockIn.checked = config.useClockIn;
    this.elements.useClockOut.checked = config.useClockOut;
    this.elements.useBreakStart.checked = config.useBreakStart;
    this.elements.useBreakEnd.checked = config.useBreakEnd;
    this.elements.skipClockIn.checked = config.skipClockIn;
    this.elements.skipClockOut.checked = config.skipClockOut;
    this.elements.skipBreakStart.checked = config.skipBreakStart;
    this.elements.skipBreakEnd.checked = config.skipBreakEnd;
  }

  private bindEvents(): void {
    this.elements.executeBtn.addEventListener('click', () => {
      this.executeAttendanceInput();
    });

    // 設定変更時に自動保存
    const formElements = [
      this.elements.startTime, this.elements.endTime, this.elements.breakStartTime, this.elements.breakEndTime,
      this.elements.targetDayType, this.elements.useClockIn, this.elements.useClockOut, this.elements.useBreakStart,
      this.elements.useBreakEnd, this.elements.skipClockIn, this.elements.skipClockOut, this.elements.skipBreakStart,
      this.elements.skipBreakEnd
    ];

    formElements.forEach(element => {
      element.addEventListener('change', () => {
        this.saveConfig();
      });
    });
  }

  private getFormValues(): AttendanceConfig {
    return {
      startTime: this.elements.startTime.value,
      endTime: this.elements.endTime.value,
      breakStartTime: this.elements.breakStartTime.value,
      breakEndTime: this.elements.breakEndTime.value,
      targetDayType: this.elements.targetDayType.value,
      enableLogging: true,
      showDetailedLog: true,
      useClockIn: this.elements.useClockIn.checked,
      useClockOut: this.elements.useClockOut.checked,
      useBreakStart: this.elements.useBreakStart.checked,
      useBreakEnd: this.elements.useBreakEnd.checked,
      skipClockIn: this.elements.skipClockIn.checked,
      skipClockOut: this.elements.skipClockOut.checked,
      skipBreakStart: this.elements.skipBreakStart.checked,
      skipBreakEnd: this.elements.skipBreakEnd.checked
    };
  }

  private saveConfig(): void {
    const config = this.getFormValues();
    chrome.storage.sync.set({ attendanceConfig: config });
  }

  private showStatus(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.elements.status.textContent = message;
    this.elements.status.className = `status ${type}`;
    this.elements.status.style.display = 'block';

    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        this.elements.status.style.display = 'none';
      }, 3000);
    }
  }

  private async executeAttendanceInput(): Promise<void> {
    try {
      this.elements.executeBtn.disabled = true;
      this.showStatus('処理中...', 'info');

      const config = this.getFormValues();
      
      // アクティブタブを取得
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error('アクティブタブが見つかりません');
      }

      // コンテンツスクリプトにメッセージを送信
      try {
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: 'EXECUTE_ATTENDANCE_INPUT',
          config: config
        });

        if (response.success) {
          this.showStatus('勤怠入力が完了しました！', 'success');
        } else {
          throw new Error(response.error || '不明なエラーが発生しました');
        }
      } catch (messageError) {
        // コンテンツスクリプトが見つからない場合
        const errorMessage = messageError instanceof Error ? messageError.message : String(messageError);
        if (errorMessage.includes('Receiving end does not exist')) {
          throw new Error('勤怠管理システムの一括入力画面で実行してください。現在のページでは動作しません。');
        } else {
          throw messageError;
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      this.showStatus(`エラー: ${errorMessage}`, 'error');
      console.error('勤怠入力エラー:', error);
    } finally {
      this.elements.executeBtn.disabled = false;
    }
  }
}

// ポップアップを初期化
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
}); 