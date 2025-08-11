# プロジェクト構造

## ルートディレクトリ構成

```
attendance-automation-extension/
├── .kiro/                          # Kiro ステアリング文書
│   └── steering/                   # プロジェクト知識と仕様
├── src/                            # TypeScript ソースコード
├── dist/                           # コンパイル済みJavaScript出力（ビルド成果物）
├── icons/                          # Chrome拡張機能アイコン（16px, 48px, 128px）
├── node_modules/                   # npm依存関係
├── manifest.json                   # Chrome Extension v3 マニフェスト
├── popup.html                      # 拡張機能ポップアップインターフェースHTML
├── webpack.config.js               # Webpackビルド設定
├── tsconfig.json                   # TypeScriptコンパイラー設定
├── package.json                    # npmパッケージ設定
├── package-lock.json              # npm依存関係ロックファイル
├── CLAUDE.md                       # Claude Codeプロジェクト指示書
└── README.md                       # プロジェクトドキュメント
```

### 主要ルートファイル

- **`manifest.json`**: 権限、エントリーポイント、メタデータを定義するChrome Extension v3マニフェスト
- **`popup.html`**: モダンスタイリングを持つ拡張機能ポップアップのHTMLインターフェース
- **`webpack.config.js`**: TypeScriptコンパイルとマルチエントリーバンドリングを持つビルド設定
- **`tsconfig.json`**: 厳格な型チェック付きES2020をターゲットとするTypeScript設定
- **`package.json`**: ビルドスクリプトと依存関係を持つNode.jsパッケージ設定

## サブディレクトリ構造

### ソースディレクトリ (`src/`)
```
src/
├── types/
│   └── index.ts                    # 集中TypeScript型定義
├── utils/
│   └── logger.ts                   # ログユーティリティとデバッグ機能
├── services/
│   └── attendanceService.ts        # コア勤怠自動化ビジネスロジック
├── background.ts                   # Chrome拡張機能バックグラウンドサービスワーカー
├── content.ts                      # Webページに注入されるコンテンツスクリプト
└── popup.ts                        # ポップアップインターフェースロジックとイベント処理
```

### ビルド出力 (`dist/`)
```
dist/                               # Webpackによって生成（コミットされない）
├── background.js                   # コンパイル済みバックグラウンドスクリプト
├── content.js                      # コンパイル済みコンテンツスクリプト
├── popup.js                        # コンパイル済みポップアップスクリプト
├── *.js.map                        # デバッグ用ソースマップ
└── *.d.ts                          # TypeScript宣言（有効化されている場合）
```

### アセットディレクトリ (`icons/`)
```
icons/
├── icon16.png                      # 16x16 px ツールバーアイコン
├── icon48.png                      # 48x48 px 拡張機能管理アイコン
└── icon128.png                     # 128x128 px Chrome Web Store アイコン
```

## コード組織パターン

### Chrome拡張機能アーキテクチャパターン
```
拡張機能コンポーネント:
├── バックグラウンド（サービスワーカー）      # 拡張機能ライフサイクル管理
├── コンテンツスクリプト                    # ページ相互作用とDOM操作
├── ポップアップインターフェース             # ユーザー設定と制御
└── マニフェスト設定                       # 権限とエントリーポイント
```

### モジュール組織戦略
- **エントリーポイントパターン**: 各主要拡張機能コンポーネントに独自のエントリーポイント（`background.ts`, `content.ts`, `popup.ts`）
- **サービス層パターン**: `services/` ディレクトリに分離されたビジネスロジック
- **ユーティリティパターン**: `utils/` ディレクトリの共有機能
- **型集中化**: `types/index.ts` に統合されたすべての型定義

### 依存関係フロー
```
popup.ts → attendanceService.ts → utils/logger.ts
    ↓              ↓                       ↓
content.ts → types/index.ts ← background.ts
```

## ファイル命名規則

### TypeScriptファイル
- **コンポーネントファイル**: 説明的な名前の小文字（`background.ts`, `content.ts`, `popup.ts`）
- **サービスファイル**: "Service"サフィックス付きPascalCase（`attendanceService.ts`）
- **ユーティリティファイル**: 説明的な名前の小文字（`logger.ts`）
- **型ファイル**: 明確な目的を持つ小文字（メイン型用の`index.ts`）

### ディレクトリ命名
- **小文字**: すべてのディレクトリは小文字の名前を使用
- **複数形**: 複数の関連ファイルを含むディレクトリは複数形の名前を使用（`types/`, `utils/`, `services/`）
- **説明的**: ディレクトリ名は目的と内容を明確に示す

### ビルドと設定ファイル
- **ケバブケース**: 設定ファイルはケバブケースを使用（`webpack.config.js`, `package-lock.json`）
- **標準名**: 確立された慣例に従う（`manifest.json`, `tsconfig.json`, `README.md`）

## インポート組織

### インポートパス戦略
```typescript
// プロジェクトファイル用の相対インポート
import { AttendanceConfig } from './types/index.js';
import { Logger } from './utils/logger.js';

// Chrome API インポート（グローバル）
declare const chrome: typeof import('chrome');
```

### 型インポートパターン
```typescript
// 型のみインポート
import type { ProcessResult, TargetRow } from './types/index.js';

// 混合インポート
import { defaultConfig, type AttendanceConfig } from './types/index.js';
```

### モジュール解決
- **Node解決**: Node.jsモジュール解決戦略を使用
- **拡張子マッピング**: TypeScriptはインポートで`.ts`ファイルを`.js`に解決
- **相対パス**: 明確性のため、すべての内部インポートは相対パスを使用

## 主要アーキテクチャ原則

### 関心の分離
- **UI層**: ポップアップインターフェースがユーザー相互作用と設定を処理
- **ビジネスロジック**: AttendanceServiceがコア自動化アルゴリズムを含む
- **インフラストラクチャ**: バックグラウンドスクリプトが拡張機能ライフサイクルとメッセージングを管理
- **データ層**: Chrome Storage APIが設定永続化を処理

### 型安全性ファースト
- **厳格TypeScript**: 包括的型チェック付きの完全厳格モード有効
- **インターフェース駆動**: すべてのデータ構造をTypeScriptインターフェースとして定義
- **暗黙のAnyなし**: コードベース全体で明示的な型指定が必要
- **型ガード**: 必要に応じてランタイム型検証

### Chrome拡張機能ベストプラクティス
- **Manifest v3準拠**: 最新Chrome Extension API標準を使用
- **権限最小化**: 必要な権限のみを要求
- **メッセージパッシング**: 拡張機能コンポーネント間の適切な通信
- **コンテンツセキュリティポリシー**: 拡張機能セキュリティのCSP要件への準拠

### エラーハンドリング戦略
- **段階的劣化**: 個々のコンポーネントが失敗してもシステムが動作を継続
- **包括的ログ**: 詳細なエラーレポートと診断情報
- **ユーザーフィードバック**: 明確なエラーメッセージとトラブルシューティングガイダンス
- **回復メカニズム**: 自動リトライとフォールバック戦略

### パフォーマンス最適化
- **遅延読み込み**: 必要な時のみコンポーネントを読み込み
- **効率的DOMクエリ**: フォールバック付きの最適化されたセレクター戦略
- **メモリ管理**: イベントリスナーとオブザーバーの適切なクリーンアップ
- **ビルド最適化**: 本番バンドル最適化のためのWebpack設定

### セキュリティ考慮事項
- **サンドボックス実行**: コンテンツスクリプトは分離されたコンテキストで動作
- **eval()なし**: セキュリティのための動的コード実行回避
- **入力検証**: すべてのユーザー入力のサニタイズと検証
- **権限境界**: Chromeのセキュリティモデルと権限の尊重