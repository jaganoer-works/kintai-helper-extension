# 勤怠管理システム 一括入力スクリプト

勤怠管理システムの一括入力画面で、ブラウザのコンソールから実行できるJavaScriptスクリプト群です。

## 📁 ファイル構成

### 基本スクリプト
- `attendance_basic.js` - 基本的な一括入力スクリプト
- `attendance_smart.js` - 既存データスキップ機能付き
- `attendance_clockin_only.js` - 出勤時刻のみ設定
- `attendance_granular.js` - 項目別細かい制御機能

### タイミング問題解決版
- `attendance_timing_robust.js` - タイミング制御強化版
- `attendance_ultra_robust.js` - 超安定版（推奨）

## 🚀 使用方法

### 1. 基本実行
```javascript
// 超安定版（推奨）
executeAttendanceBulkInputUltra()

// タイミング制御強化版
executeAttendanceBulkInput()

// 基本版
executeAttendanceBulkInputBasic()
```

### 2. 設定変更
```javascript
// 時刻設定を変更
updateAttendanceConfigUltra({
    startTime: '08:30',
    endTime: '17:30',
    breakTime: '01:00'
})

// 項目別設定
updateAttendanceConfigUltra({
    fields: {
        startTime: { enabled: true, skipIfExists: true },
        endTime: { enabled: false, skipIfExists: false },
        breakTime: { enabled: true, skipIfExists: false }
    }
})
```

## ⚡ タイミング問題の解決策

### 問題の原因
- DOMの動的生成
- ページ読み込みタイミング
- JavaScriptの非同期処理
- 要素の表示遅延

### 解決策

#### 1. タイミング制御強化版 (`attendance_timing_robust.js`)
- **DOM読み込み待機機能**: `document.readyState` の確認
- **要素存在確認の強化**: 複数のセレクターパターン対応
- **待機時間の調整**: 適切な間隔での処理
- **エラーハンドリング強化**: リトライ機能

#### 2. 超安定版 (`attendance_ultra_robust.js`) - 推奨
- **MutationObserver**: DOM変更の監視
- **要素完全読み込み待機**: `offsetParent` による表示確認
- **リトライ機能強化**: 最大20回のリトライ
- **複数セレクターパターン**: 9種類のセレクター対応
- **オブザーバー自動クリーンアップ**: メモリリーク防止

### 使用推奨順序

1. **超安定版** (`attendance_ultra_robust.js`) - 最も安定
2. **タイミング制御強化版** (`attendance_timing_robust.js`) - バランス型
3. **基本版** - シンプルな場合のみ

## 🔧 詳細設定

### 基本設定
```javascript
{
    startTime: '09:00',      // 開始時刻
    endTime: '18:00',        // 終了時刻
    breakTime: '01:00',      // 休憩時間
}
```

### タイミング制御設定（超安定版）
```javascript
{
    maxRetries: 20,                    // 最大リトライ回数
    retryDelay: 300,                   // リトライ間隔（ms）
    waitForElementTimeout: 15000,      // 要素待機タイムアウト（ms）
    mutationTimeout: 10000             // MutationObserverタイムアウト（ms）
}
```

### 項目別設定
```javascript
{
    fields: {
        startTime: { 
            enabled: true,        // 入力するかどうか
            skipIfExists: true    // 既存データがあればスキップ
        },
        endTime: { 
            enabled: true, 
            skipIfExists: true 
        },
        breakTime: { 
            enabled: true, 
            skipIfExists: true 
        }
    }
}
```

## 📊 対応セレクターパターン

### 勤怠入力行の検索
```javascript
[
    'tr[data-row]',
    'tr.attendance-row',
    'tr[id*="attendance"]',
    'tbody tr',
    '.attendance-table tr',
    'table tr',
    '.table tbody tr',
    '[class*="attendance"] tr',
    '[id*="attendance"] tr'
]
```

### 開始時刻フィールド
```javascript
[
    'input[name*="start"]',
    'input[name*="begin"]',
    'input[name*="clockin"]',
    'input[placeholder*="開始"]',
    'input[placeholder*="出勤"]',
    'input[title*="開始"]',
    'input[title*="出勤"]',
    'td:nth-child(1) input',
    'td:nth-child(2) input',
    'td:nth-child(3) input'
]
```

### 終了時刻フィールド
```javascript
[
    'input[name*="end"]',
    'input[name*="finish"]',
    'input[name*="clockout"]',
    'input[placeholder*="終了"]',
    'input[placeholder*="退勤"]',
    'input[title*="終了"]',
    'input[title*="退勤"]',
    'td:nth-child(4) input',
    'td:nth-child(5) input',
    'td:nth-child(6) input'
]
```

## 🛠️ トラブルシューティング

### よくある問題と解決策

#### 1. 要素が見つからない
**症状**: "要素が見つかりません" エラー
**解決策**: 
- 超安定版を使用
- ページの完全読み込みを待つ
- セレクターパターンの確認

#### 2. 値が設定されない
**症状**: 入力フィールドに値が反映されない
**解決策**:
- 要素の完全読み込み待機
- イベント発火の確認
- リトライ機能の活用

#### 3. 一部の行が処理されない
**症状**: 特定の行がスキップされる
**解決策**:
- 既存データチェックの確認
- フィールド検索パターンの調整
- ログ出力の確認

### デバッグ方法

#### 1. ログ確認
```javascript
// コンソールでログを確認
console.log(window.attendanceBulkInputUltra.logs);
```

#### 2. 設定確認
```javascript
// 現在の設定を確認
console.log(window.attendanceBulkInputUltra.config);
```

#### 3. 手動テスト
```javascript
// 特定の要素を手動で検索
document.querySelectorAll('input[type="text"]');
```

## 📝 使用例

### 例1: 基本的な一括入力
```javascript
// 超安定版で実行
executeAttendanceBulkInputUltra();
```

### 例2: カスタム時刻設定
```javascript
// 設定を変更して実行
updateAttendanceConfigUltra({
    startTime: '08:30',
    endTime: '17:30',
    breakTime: '01:30'
});
executeAttendanceBulkInputUltra();
```

### 例3: 出勤時刻のみ設定
```javascript
// 出勤時刻のみ有効化
updateAttendanceConfigUltra({
    fields: {
        startTime: { enabled: true, skipIfExists: true },
        endTime: { enabled: false, skipIfExists: false },
        breakTime: { enabled: false, skipIfExists: false }
    }
});
executeAttendanceBulkInputUltra();
```

### 例4: 既存データを上書き
```javascript
// 既存データがあっても上書き
updateAttendanceConfigUltra({
    fields: {
        startTime: { enabled: true, skipIfExists: false },
        endTime: { enabled: true, skipIfExists: false },
        breakTime: { enabled: true, skipIfExists: false }
    }
});
executeAttendanceBulkInputUltra();
```

## ⚠️ 注意事項

1. **事前確認**: 実行前にページの構造を確認
2. **バックアップ**: 重要なデータがある場合は事前にバックアップ
3. **テスト実行**: 最初は少数の行でテスト
4. **ブラウザ対応**: モダンブラウザでの使用を推奨
5. **権限確認**: サイトの利用規約を確認

## 🔄 更新履歴

- **v2.0**: 超安定版追加（MutationObserver対応）
- **v1.5**: タイミング制御強化版追加
- **v1.0**: 基本機能実装

## 📞 サポート

問題が発生した場合は、以下の情報を確認してください：

1. ブラウザの種類とバージョン
2. エラーメッセージの詳細
3. ページのHTML構造
4. 実行したスクリプトの種類

詳細なログはコンソールで確認できます。 

# 勤怠管理システム 一括入力 Chrome拡張機能

TypeScriptで開発された勤怠管理システムの一括入力Chrome拡張機能です。勤怠一括入力画面で、DOM解析とブラウザ自動操作により勤怠情報を一括入力できます。

## 機能

- **項目別入力制御**: 各項目（出勤・退勤・休憩開始・休憩終了）ごとに「入力する／しない」を選択可能
- **項目別スキップ制御**: 各項目ごとに既存データがある場合のスキップ設定
- **美しいUI**: モダンなデザインのポップアップインターフェース
- **設定の永続化**: 設定をChromeストレージに保存
- **詳細なログ出力**: 処理状況をリアルタイムで確認可能
- **TypeScript対応**: 型安全性と開発効率の向上
- **タイミング問題解決**: 値設定の信頼性を大幅に向上

## プロジェクト構成

```
attendance-automation-extension/
├── src/
│   ├── types/
│   │   └── index.ts              # 型定義
│   ├── utils/
│   │   └── logger.ts             # ログ出力機能
│   ├── services/
│   │   └── attendanceService.ts  # 勤怠入力メインロジック（強化版）
│   ├── content.ts                # コンテンツスクリプト（非同期対応）
│   ├── background.ts             # バックグラウンドスクリプト
│   └── popup.ts                  # ポップアップスクリプト
├── dist/                         # ビルド出力ディレクトリ
├── manifest.json                 # Chrome拡張機能マニフェスト
├── popup.html                    # ポップアップHTML
├── package.json                  # プロジェクト設定
├── tsconfig.json                 # TypeScript設定
└── README.md                     # このファイル
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. TypeScriptのビルド

```bash
npm run build
```

### 3. Chrome拡張機能のインストール

1. Chromeで `chrome://extensions/` を開く
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. プロジェクトのルートディレクトリを選択

## 使用方法

### 1. 拡張機能を有効化

勤怠管理システムの一括入力ページで拡張機能アイコンをクリックします。

### 2. 設定を調整

ポップアップで以下の設定を行います：

- **時刻設定**: 出勤・退勤・休憩時間を設定
- **対象設定**: 対象とする勤怠区分を選択
- **入力項目設定**: 各項目の入力有無を選択
- **スキップ設定**: 各項目の既存データスキップ有無を選択

### 3. 実行

「勤怠一括入力実行」ボタンをクリックして処理を開始します。

## 設定オプション

### 時刻設定
- `startTime`: 出勤時刻（デフォルト: 09:00）
- `endTime`: 退勤時刻（デフォルト: 18:00）
- `breakStartTime`: 休憩開始時刻（デフォルト: 12:00）
- `breakEndTime`: 休憩終了時刻（デフォルト: 13:00）

### 対象設定
- `targetDayType`: 対象勤怠区分（平日、所定休日、法定休日）

### 入力項目設定
- `useClockIn`: 出勤時刻を自動入力する
- `useClockOut`: 退勤時刻を自動入力する
- `useBreakStart`: 休憩開始時刻を自動入力する
- `useBreakEnd`: 休憩終了時刻を自動入力する

### スキップ設定
- `skipClockIn`: 出勤時刻の既存データをスキップ
- `skipClockOut`: 退勤時刻の既存データをスキップ
- `skipBreakStart`: 休憩開始時刻の既存データをスキップ
- `skipBreakEnd`: 休憩終了時刻の既存データをスキップ

## ⚡ タイミング問題の解決策

### 問題の原因
- DOMの動的生成
- ページ読み込みタイミング
- JavaScriptの非同期処理
- 要素の表示遅延
- 特殊なUIフレームワーク（React/Vue等）の制御

### 解決策

#### 1. 値設定処理の強化
- **フォーカス・クリック操作**: 要素にフォーカスを当ててから値を設定
- **複数イベント発火**: input, change, blur, keyup, keydown, pasteイベントを発火
- **非同期処理**: 適切な待機時間を設けて処理の信頼性を向上
- **値確認ログ**: 設定前後の値をログ出力してデバッグを支援

#### 2. 処理間隔の調整
- **150msの処理間隔**: 各行の処理間に適切な待機時間を設定
- **要素読み込み待機**: 要素が完全に表示されるまで待機

#### 3. エラーハンドリングの強化
- **リトライ機能**: 値設定失敗時の自動リトライ
- **詳細ログ**: エラーの原因を特定しやすくするログ出力

### 使用例

#### 既存データを上書きする場合
```javascript
// スキップ設定をすべてオフにして実行
// ポップアップで「既存データをスキップ」のチェックをすべて外す
```

#### 特定項目のみ上書きする場合
```javascript
// 出勤時刻のみ上書き、他はスキップ
// 出勤時刻のスキップ設定のみオフ、他はオン
```

## 開発

### 開発モード

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### ファイル監視

```bash
npm run watch
```

## 技術スタック

- **TypeScript**: 型安全性と開発効率の向上
- **Chrome Extension API**: ブラウザ拡張機能開発
- **DOM API**: ページ要素の操作
- **Chrome Storage API**: 設定の永続化
- **Webpack**: モジュールバンドリング

## 型定義

### AttendanceConfig
```typescript
interface AttendanceConfig {
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
```

### ProcessResult
```typescript
interface ProcessResult {
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
```

## トラブルシューティング

### よくある問題

1. **「勤怠データが見つかりません」エラー**
   - 正しい勤怠一括入力画面にいることを確認
   - ページの読み込みが完了していることを確認

2. **「対象となる行が見つかりません」エラー**
   - `targetDayType`の設定を確認
   - テーブルにデータが表示されていることを確認

3. **拡張機能が動作しない**
   - 拡張機能が有効になっているか確認
   - ページを再読み込みしてから再実行

4. **値が反映されない**
   - 詳細ログを確認して値設定の状況をチェック
   - スキップ設定が正しく設定されているか確認
   - ページの再読み込みを試行

### デバッグ方法

1. Chrome DevToolsのコンソールでログを確認
2. 拡張機能の管理ページでエラーを確認
3. 設定値を一時的に変更して動作確認
4. 詳細ログ機能を有効にして処理状況を確認

## ライセンス

MIT License

## 更新履歴

- **v1.1.0**: タイミング問題解決版
  - 値設定処理の大幅強化
  - 非同期処理への対応
  - デバッグ機能の追加
  - エラーハンドリングの改善
- **v1.0.0**: TypeScript版Chrome拡張機能としてリリース
  - 項目別入力制御機能
  - 美しいUIデザイン
  - 設定の永続化
  - 型安全性の向上 