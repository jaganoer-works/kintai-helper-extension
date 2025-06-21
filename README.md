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