# 開発日記 (DEVLOG) - 『密室の謎解き脱出』(Mystery Escape Game)

本ドキュメントは、謎解き脱出Webゲーム『密室の謎解き脱出』の開発背景、採用技術、日付別の開発記録、および今後の改善課題をまとめた開発ログです。  
現在はStage 1「古びた書斎と賢者の鍵」を公開中であり、今後は複数ステージの追加・拡張を予定しています。  
開発・修正を行うごとに、日付別ログ（セクション2）へ新しい日付の見出しを追加・更新していきます。

---

## 1. プロジェクト概要

### ■ ゲームコンセプト
様々なシチュエーションの密室を舞台にした、本格派のポイント＆クリック型脱出ゲーム集です。  
プレイヤーは360度（北・東・南・西の4画面）を切り替えながら部屋を探索し、隠された道具の発見、アイテムの分解・合成、照明スイッチによる「暗闇モード」での隠し要素発見、天体運行に基づく多層暗号パズルを解き明かして、頑丈な大扉からの脱出を目指します。

### ■ 技術スタック & アーキテクチャ
外部フレームワークや重いゲームエンジンに依存せず、軽量で高速に動作するモダンなWeb標準技術で構築されています。

- **フロントエンド構造**: HTML5 + Vanilla JavaScript (ES6+) + CSS3
- **グラフィック**: 全画面・全オブジェクト・アイテムアイコンを「軽量なインラインSVG」で直接ベクター描画（高解像度ディスプレイ・Retina・スマホでも鮮明）
- **サウンドシステム ([se.js](file:///c:/Users/xcang/Desktop/Antigravity/escape/se.js))**: Web Audio API による自前シンセ音源（クリック音、解錠音、ドライバー回転音、時計チクタク、正解ファンファーレ等をコード生成するため、外部mp3/wavファイルのロード不要で動作）
- **セーブシステム**: `localStorage` を利用したオートセーブ（ゲーム中断・再開・クリアタイム記録対応）
- **レスポンシブ & タイポグラフィ**: スマホ（iPhone等）での片手操作に最適化（`touch-action: manipulation`, `viewport-fit=cover`, `font-size: clamp()`, `word-break: auto-phrase`, `text-wrap: balance/pretty`）

### ■ ファイル構成
```text
c:\Users\xcang\Desktop\Antigravity\escape\
├── index.html            # メインDOM構造、メニュー画面、SVGルームビュー、PWAメタタグ
├── script.js             # ゲームステート管理、パズルロジック、モーダル展開、セーブ機能
├── style.css             # アンティーク調UIデザイン、レスポンシブ組版、アニメーション
├── se.js                 # Web Audio API シンセ効果音マネージャー
├── manifest.json         # Web App Manifest（スタンドアロン起動・アプリアイコン定義）
├── icon.svg              # アプリアイコン（ベクター原画：真鍮の賢者の鍵＆コバルトブルー宝石）
├── icon-192.png          # Android/PWA用標準アプリアイコン（192x192px）
├── icon-512.png          # Android/PWAスプラッシュ用アプリアイコン（512x512px）
├── apple-touch-icon.png  # iOS Safari ホーム画面追加用高精細アイコン（180x180px）
├── favicon.png           # PCブラウザ用タブファビコン（48x48px）
├── wrangler.json         # Cloudflare Workers Builds / 静的サイト（assets & previews）設定
├── DEVLOG.md             # 本開発日記・技術ドキュメント（日付別運用）
├── README.md             # プロジェクト概要・プレイガイド
└── .gitignore            # OS一時ファイル・エディタ設定等のGit除外設定
```

---

## 2. 日付別 開発記録 (Daily Development Log)

### 2026-10-30 (金)

#### 1. アプリアイコン制作・PWAマニフェスト対応・全画面スタンドアロン起動の実装
- **ブランチ作成**: `feat/app-icon-and-pwa` 作業用ブランチを作成して実装。
- **オリジナルアプリアイコンのデザイン & マルチ解像度生成**:
  - 本作の世界観（クラシカルな洋館・密室ミステリー）に合わせ、チャコールブラック（`#121316`）の背景に真鍮の二重枠線、そして中央に青玉（コバルトブルー宝石）を嵌め込んだ重厚な真鍮の「賢者の鍵」をモチーフとした `icon.svg` をオリジナル制作。
  - スマホのホーム画面で小さく表示されても一目で脱出ゲームと識別できるよう、文字を省きモチーフとシャドウを際立たせた設計を採用。
  - 高解像度ベクターから高品質リサンプリング（Lanczos）を行い、各プラットフォーム向けに最適化されたアイコンファイルを生成・配置：
    - `icon.svg`（ベクターマスター画像）
    - `apple-touch-icon.png`（iOS Safari「ホーム画面に追加」用 180×180px）
    - `icon-192.png`（Android PWA / ホーム画面用 192×192px）
    - `icon-512.png`（高解像度ディスプレイ・スプラッシュ画面用 512×512px）
    - `favicon.png`（PCブラウザタブ用 48×48px）
- **Web App Manifest (`manifest.json`) の新規作成**:
  - `name`: 「密室の謎解き脱出 - Mystery Escape Game」
  - `short_name`: 「密室脱出」（ホーム画面のアプリ名として最適な4文字表記）
  - `display`: `"standalone"`（ブラウザのアドレスバー・ナビゲーションバーを非表示にし、ネイティブアプリのように全画面起動）
  - `background_color` / `theme_color`: ゲームの統一ダークトーン `#121316` を指定。
  - `icons`: SVG、192px、512px（`purpose: "any maskable"`）、180px をすべて登録。
- **`index.html` ヘッダーへのメタタグ拡充**:
  - PCファビコン指定（`icon.svg`, `icon-192.png`, `favicon.png`）
  - iPhone / iPad ホーム画面用アイコン指定（`apple-touch-icon.png`）
  - Android / PWA用マニフェストリンク（`manifest.json`）
  - iOSスタンドアロン起動設定（`apple-mobile-web-app-capable: yes`, `apple-mobile-web-app-status-bar-style: black-translucent`, `apple-mobile-web-app-title: 密室脱出`）
  - Android Web App起動設定（`mobile-web-app-capable: yes`, `theme-color: #121316`）

#### 2. Cloudflare Workers Builds / 静的サイト配信設定の追加
- **`wrangler.json`（Static Assets & Worker Previews設定）の構成**:
  - Cloudflare Workers Builds のプレビュービルドおよび静的アセット配信に対応するため、成功実績のある構成に合わせて `wrangler.json`（`name: "escape"`, `compatibility_date: "2024-10-22"`, `assets.directory: "."`, `previews: {}`）を配置。`wrangler.toml` との競合エラーを解消。

### 2026-10-29 (木)

#### 1. クラシック密室ミステリー調UIへの全面刷新 (14:30〜)
- **ブランチ作成**: `refactor/ui-improvement` 作業用ブランチを作成して改修を実施。
- **AIテンプレートUI・安っぽさの完全排除**:
  - 紫・青のグラデーション背景や、ボタン・モーダルの過度なネオングロー（`box-shadow`）を全削除。
  - 業務アプリのような丸みの強すぎる角丸（8〜16px）を廃止し、角をシャープに落としたアンティークな枠線（`border-radius: 2px〜4px`）に統一。
  - 全画面・ボタン・モーダル・アイテム欄に散見されていた絵文字（🔑, 🚪, 💡, ✨, ⚙️, 📖, 🌐, 💾, 🔒, 🔓 など）をすべて削除し、品格あるインラインSVGアイコンやテキスト表記に統一。
- **フォント & カラーパレットの刷新**:
  - Google Fontsから明朝体「Shippori Mincho（しっぽり明朝）」と等幅フォント「Share Tech Mono」を導入。
  - タイトル、見出し、メッセージウィンドウ、選択肢に「Shippori Mincho」とゆったりとした字間（`letter-spacing: 0.08em`）を適用。
  - 暗証番号、ダイヤル数字、タイマー等の数字表示に「Share Tech Mono」を適用。
  - 配色を「#121316（密室のチャコールブラック）」「#1e2024（重厚なダークグレー）」「#4a443b（くすんだアンティーク真鍮・ブロンズ）」「#e2ddd5（温かみのあるオフホワイト紙色）」「#c89b3c（鈍く光るゴールド）」「#8b2626（深みのあるクリムゾンレッド）」の厳選ダークパレットへ統一。
- **ノベルゲーム調の手触り（マイクロインタラクション）**:
  - 画面下部のメッセージウィンドウをクラシカルな細い二重線（`border: 3px double #4a443b;`）で囲み、静寂と緊張感のあるミステリーノベル風の佇まいに。
  - アイテムスロットやモーダル枠も落ち着いた1pxの真鍮枠で引き締め、選択中はネオン光ではなく鈍いゴールド枠が点灯する上品なフィードバックへ改善。
- **実機プレビュー画像の再生成**:
  - 新UIに合わせて `docs/` 配下のスクリーンショット4枚を再キャプチャ・更新。
- **ステージカード「はじめから」ボタンのオーバーフロー修正 (15:55〜)**:
  - セーブデータ保持時に表示される「つづきから」「はじめから」の2ボタンがPC画面幅でカード枠外へ飛び出していた問題を解消。
  - `.stage-actions .btn-stage-action` に `flex: 1 1 0; min-width: 0;`、フォントサイズ・パディングの微細クランプ（`clamp(0.74rem, 2vw, 0.86rem)`）を設定し、PC・スマホ（縦持ち実機幅）の双方向で枠内に整然と収まるレスポンシブ配置へ改善。

### 2026-10-28 (水)

#### 1. ポートフォリオ向けドキュメント・技術解説の全面刷新 (11:30〜)
- **[README.md](file:///c:/Users/xcang/Desktop/Antigravity/escape/README.md) のブラッシュアップ**:
  - 就職活動・技術ポートフォリオとして面接官・エンジニアに伝わりやすい構成へ全面改訂。
  - **実機スクリーンショットの配置**:
    - ヘッドレスブラウザを用いて、PC探索ビュー（`preview-pc.png`）、スマホ実機縦画面（`preview-mobile.png`）、暗闇モード蓄光ギミック（`preview-dark.png`）、ステージ選択メニュー（`preview-menu.png`）を撮影し、`docs/` 配下に格納・READMEへ埋め込み。
  - **技術スタック**: Vanilla JS / HTML5 / CSS3 / Web Audio API / SVG / Cloudflare / Antigravity の役割を明確化。
  - **技術的なこだわり**: 外部依存ゼロ（Zero-Dependency）による通信遅延ゼロ、Single Source of Truth による堅牢な状態管理とオートセーブ、スマホファーストの日本語組版（auto-phrase, balance/pretty, phrase spans）を体系化。
  - **開発中の課題と解決エピソード**:
    1. パズルの総当たり（当てずっぽう）防止（本棚7冊・840通り化）とヒントの完全分離。
    2. `innerText` 代入によるHTMLコード露出バグの分析と、安全な自動文節パーサーの実装。
    3. モバイル実機でのヘッダーボタン密集解消（設定モーダルへの統合）。

### 2026-10-27 (火)

#### 1. 初期プロトタイプ構築 & スマホ最適化 (12:00〜13:00)
- **4方向探索システムの作成**: 北・東・南・西の視点旋回UIおよびSVGグラフィックの初期配置。
- **基本アイテム・ギミック**: 机、引き出し、時計、絵画、絨毯、大扉のプロトタイプ実装。
- **ステージ選択 & セーブ機能**:
  - タイトル画面（Stage 1 カード表示、クリアタイム記録、続きからプレイ）。
  - `localStorage` によるリアルタイムオートセーブ機能。
- **スマホUI調整**: アイテムスロットのタッチ操作、アイテム選択ピッカーUIの導入。

#### 2. Stage 1 フルリメイク & ギミック本格化 (14:00〜15:30)
- **照明スイッチ盤 ＆「暗闇モード」**:
  - 北側の壁に真鍮カバー付き照明端子盤を新設。
  - 明かりを消すと部屋全体が深い夜のトーンに変わり、油絵や本棚に蓄光塗料が浮かび上がる演出を追加。
- **アイテム分解・合成システム**:
  - アイテム詳細モーダルから【調べる】アクションを追加。
  - ドライバーで「真鍮の小箱」を分解（銀の鍵＋星座の円盤）。
  - 「不完全な鍵身」と「賢者の青玉紋章」を結合して「賢者の真鍮鍵」を精錬。
- **パズルロジックの高度化と二重ヒント解消**:
  - **天体日誌**: 時計パズル専用とし、東西方位から長針・短針（9時15分）を推測する詩文に変更。
  - **油絵『星辰の夜』**: 通常時と拡大時の構図を100%統一。暗闇時に浮かぶ星座の軌跡を本棚パズルの解法ヒントに特化。
  - **本棚パズル**: 当てずっぽうでの総当たりを防止するため、本を7冊（840通り）に拡張。4冊押すまで成否を伏せる仕様に改善。
  - **西側（ソファ室）の役割強化**: サイドテーブルに「真鍮の天球儀」を配置し、中盤から終盤への架け橋となるキーアイテム（火かき棒）を入手するギミックを実装。
- **UIクリーンアップ**:
  - 画面上部の音量ボタン・最初から・メニュー戻りボタンを撤去し、歯車アイコンの「設定モーダル」に集約。

#### 3. タイポグラフィ・組版 & 日本語改行の徹底最適化 (15:30〜16:40)
- **モダンCSS改行ルールの適用**:
  - `word-break: auto-phrase;` と `overflow-wrap: anywhere;` を設定し、単語・文節途中での不自然な折り返しを防止。
  - 見出しに `text-wrap: balance;`、説明文に `text-wrap: pretty;` を設定。
  - ボタンやステータスラベルに `white-space: nowrap;` と `font-size: clamp()` を適用。
- **メッセージバー & モーダル説明文の改善**:
  - メッセージバー（`setMessage`）でスラッシュ（`/`）や改行（`\n`）による自動インラインブロック（`<span style="display:inline-block;">`）分割に対応。
  - アイテム詳細モーダルでHTMLタグが文字列として露出していた不具合（`innerText` ➔ `innerHTML`）を修正。
  - 引き出し、時計、暖炉、壁金庫、天球儀、アイテム選択ピッカーなどの説明文を `<span class="phrase">` による意味単位の構造化と中央揃えに統一。

#### 4. 環境整備 & ドキュメンテーション・多ステージ化対応 (16:50〜23:55)
- **[.gitignore](file:///c:/Users/xcang/Desktop/Antigravity/escape/.gitignore) の策定**: Windows / macOS / VS Code / Node等の一時ファイルが混入しないよう除外ルールを整備。
- **[DEVLOG.md](file:///c:/Users/xcang/Desktop/Antigravity/escape/DEVLOG.md) の作成**: プロジェクト全体の技術仕様、パズル全体の解法フローチャート、日付別開発記録、今後のリファクタリング計画を明文化。
- **[README.md](file:///c:/Users/xcang/Desktop/Antigravity/escape/README.md) の作成**: オンラインプレイリンク、各ギミックの特徴、操作マニュアル、技術構成をまとめた公式プレイガイドを整備。
- **多ステージ化に向けたリブランディング**:
  - 今後の複数ステージ拡張を見据え、プロジェクト全体の包括タイトルをメニュー画面と連動した『密室の謎解き脱出』(Mystery Escape Game) へ統一。
  - 「古びた書斎と賢者の鍵」を「STAGE 1」として位置づけ、README・DEVLOG・GitHub About（Description: `『密室の謎解き脱出』(Mystery Escape Game) - 本格ポイント＆クリック謎解き脱出Webゲーム`）を更新。

---

## 3. STAGE 1: 古びた書斎と賢者の鍵 謎解きフローチャート

```mermaid
flowchart TD
    Start["探索開始（古びた書斎）"] --> Carpet["絨毯の隅をめくる"]
    Carpet --> GetDriver["精密ドライバー入手"]
    
    Start --> Sofa["ソファの隙間を探る"]
    Sofa --> GetBox["真鍮の小箱入手"]
    
    GetDriver & GetBox --> Disassemble["小箱を分解（調べる）"]
    Disassemble --> SilverKey["小さな銀の鍵"] & StarDisc["星座の円盤"]
    
    SilverKey --> Desk["重厚な机の引き出し"]
    Desk --> SwitchKey["端子盤の鍵"]
    
    SwitchKey --> LightSwitch["北側：照明端子盤を開ける"]
    LightSwitch --> NightMode["照明OFF（暗闇モード起動）"]
    
    NightMode --> Painting["南側：油絵『星辰の夜』に蓄光星座が発光"]
    Painting --> BookHint["白羊 ➔ 獅子 ➔ 天蠍 ➔ 射手"]
    
    BookHint --> Bookshelf["東側：本棚パズル（7冊から4冊選択）"]
    Bookshelf --> SafeOpen["本棚がスライドし隠し壁金庫出現"]
    
    StarDisc --> SafeSlot["金庫に星座の円盤を装着・真上に回転"]
    SafeSlot --> SafeCode["暗号コード【3928】"] & ArmPin["星型の真鍮ピン"]
    
    Desk --> Diary["机の上の天体日誌を読む"]
    Diary --> ClockHint["短針＝西(9時) / 長針＝東(15分)"]
    
    ClockHint --> Clock["北側：古時計を【09:15】に設定"]
    Clock --> BrokenKey["不完全な鍵身（真鍮の鍵軸）入手"]
    
    ArmPin --> Armillary["西側：天球儀にピン装着・真上に回転"]
    Armillary --> Poker["真鍮の火かき棒入手"]
    
    Poker --> Fireplace["南側：暖炉の鉄格子を外す"]
    Fireplace --> Emblem["賢者の青玉紋章入手"]
    
    BrokenKey & Emblem --> Assemble["鍵身に紋章を合成（調べる）"]
    Assemble --> BrassKey["完成：賢者の真鍮鍵"]
    
    BrassKey & SafeCode --> Door["北側：脱出の大扉（鍵穴 ＋ 3928）"]
    Door --> Clear["ゲームクリア（脱出成功！）"]
```

---

## 4. 今後リファクタリングや改善が必要な課題

1. **`script.js` のモジュール分割（ES Modules化）**
   - 約1,950行の単一ファイルを `state.js`、`items.js`、`puzzles/`、`ui.js` に分離し、保守性と可読性を向上させる。

2. **テキスト処理パイプラインの統一**
   - `setMessage` とモーダル内テキストで分かれている文節スパン分割ロジックを単一のユーティリティ関数（例: `formatPhrases(text)`）に集約する。

3. **マルチステージ化（Stage 2以降）への拡張性**
   - ステージ設定（初期状態、アイテム、ギミックロジック）を抽象化し、新たな部屋やステージを容易に追加できる仕組みを導入する。

4. **キーボード・アクセシビリティ対応**
   - PC環境での左右矢印キーによる視点旋回や、Escキーでのモーダル閉じをサポートする。
