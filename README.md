# 勤怠管理システム 一括入力 Chrome拡張機能

TypeScriptで開発された勤怠管理システムの一括入力Chrome拡張機能です。勤怠一括入力画面で、DOM解析とブラウザ自動操作により勤怠情報を一括入力できます。

## 機能

- **項目別入力制御**: 各項目（出勤・退勤・休憩開始・休憩終了）ごとに「入力する／しない」を選択可能
- **項目別スキップ制御**: 各項目ごとに既存データがある場合のスキップ設定
- **美しいUI**: モダンなデザインのポップアップインターフェース
- **設定の永続化**: 設定をChromeストレージに保存
- **詳細なログ出力**: 処理状況をリアルタイムで確認可能
- **TypeScript対応**: 型安全性と開発効率の向上

## プロジェクト構成

```
attendance-automation-extension/
├── src/
│   ├── types/
│   │   └── index.ts              # 型定義
│   ├── utils/
│   │   └── logger.ts             # ログ出力機能
│   ├── services/
│   │   └── attendanceService.ts  # 勤怠入力メインロジック
│   ├── content.ts                # コンテンツスクリプト
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

### デバッグ方法

1. Chrome DevToolsのコンソールでログを確認
2. 拡張機能の管理ページでエラーを確認
3. 設定値を一時的に変更して動作確認

## ライセンス

MIT License

## 更新履歴

- **v1.0.0**: TypeScript版Chrome拡張機能としてリリース
  - 項目別入力制御機能
  - 美しいUIデザイン
  - 設定の永続化
  - 型安全性の向上 