# CSV Analyzer Local

CSVファイルをブラウザ上で読み込み、表形式で確認・検索できるシンプルなWebアプリです。

**公開ページ:** https://csv-analysis.pages.dev/

## 特徴

- ファイルの選択とドラッグ＆ドロップに対応
- CSVの内容を表形式で表示
- キーワード入力による行のリアルタイム絞り込み
- ダブルクォートで囲まれたカンマ、改行、エスケープされたダブルクォートに対応
- 外部ライブラリを使わないVanilla JavaScript構成
- CSVの読み込みから表示まで、すべてブラウザ内で処理

## プライバシーとセキュリティ

選択したCSVファイルは、`FileReader API`を使ってブラウザのメモリ上で処理されます。ファイルの内容を外部サーバーへ送信する処理はありません。

Cloudflare Pagesでは、`_headers`に定義した以下のセキュリティヘッダーを適用します。

- Content Security Policy（CSP）
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security（HSTS）

> [!NOTE]
> ローカルで`index.html`を直接開いた場合、`_headers`のHTTPレスポンスヘッダーは適用されません。

## 対応するCSV

| 項目 | 制限 |
| --- | --- |
| 文字コード | UTF-8（BOM付きUTF-8を含む） |
| 区切り文字 | カンマ |
| ファイル拡張子 | `.csv` |
| ファイルサイズ | 5 MB以下 |
| 行数 | 10,000行以下 |
| 列数 | 1行あたり1,000列以下 |
| 総セル数 | 100,000セル以下 |
| 1セルの長さ | 100,000文字以下 |

## 使い方

1. [公開ページ](https://csv-analysis.pages.dev/)を開きます。
2. 「CSVファイルを選択」からファイルを選ぶか、画面のファイル選択エリアへドラッグ＆ドロップします。
3. 読み込まれたデータが表形式で表示されます。
4. 検索欄にキーワードを入力すると、ヘッダーを除く行が絞り込まれます。

検索では大文字と小文字を区別せず、行内のすべてのセルが対象になります。

## ローカルで実行する

ビルドや依存パッケージのインストールは不要です。リポジトリを取得し、`index.html`をブラウザで開いてください。

```bash
git clone https://github.com/ApplePie3939/csv-analysis.git
cd csv-analysis
```

HTTPサーバー経由で確認する場合は、任意のローカルサーバーを利用できます。

```bash
python -m http.server 8000
```

起動後、ブラウザで `http://localhost:8000` を開きます。

## テスト

[Node.js](https://nodejs.org/) 18以降を用意し、リポジトリのルートで次のコマンドを実行します。

```bash
node --test
```

CSVパーサーの主要な仕様と入力上限、Cloudflare Pages用セキュリティヘッダーを検証します。

## ディレクトリ構成

```text
.
├── index.html                 # 画面構造とブラウザ向けCSP
├── _headers                   # Cloudflare Pages用HTTPヘッダー
├── css/
│   └── style.css              # スタイル
├── js/
│   └── csv-analyzer.js        # CSVの読み込み、解析、検索
└── tests/
    └── csv-analyzer.test.js   # Node.js標準テストランナーによるテスト
```

## 技術構成

- HTML5
- CSS3
- JavaScript（ES6+）
- FileReader API
- Node.js標準テストランナー
- Cloudflare Pages
