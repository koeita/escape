# 密室の謎解き脱出 (Mystery Escape Game)

[![Play Online](https://img.shields.io/badge/Play-Game%20Online-blue?style=for-the-badge&logo=google-chrome)](https://escape.xcangcheng.workers.dev/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/koeita/escape)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

外部フレームワークやゲームエンジンに一切依存せず、**Vanilla JavaScript (ES6+)、HTML5、CSS3、Web Audio API、インラインSVG** のみを用いてゼロから構築した、ブラウザ完結型の本格ポイント＆クリック脱出ゲームです。

---

## 📸 デモプレビュー

<!-- スクリーンショットまたはデモGIFをここに配置できます -->
<div align="center">
  <table style="border: none;">
    <tr>
      <td align="center">
        <b>【PC / タブレット表示】</b><br>
        <img src="https://raw.githubusercontent.com/koeita/escape/main/docs/preview-pc.png" alt="PC版プレイ画面" width="480" onerror="this.src='https://placehold.co/600x400/18110b/f1c40f?text=Play+Screen+Preview+(PC)';">
      </td>
      <td align="center">
        <b>【スマホ縦画面表示】</b><br>
        <img src="https://raw.githubusercontent.com/koeita/escape/main/docs/preview-mobile.png" alt="スマホ版プレイ画面" width="240" onerror="this.src='https://placehold.co/300x533/18110b/f1c40f?text=Mobile+Preview';">
      </td>
    </tr>
  </table>
  <p><i>※ 画像が存在しない場合はプレースホルダーが表示されます。<code>docs/</code> フォルダに画像を配置すると自動で反映されます。</i></p>
</div>

---

## 🎮 プレイ用URL

👉 **[https://escape.xcangcheng.workers.dev/](https://escape.xcangcheng.workers.dev/)**  
※ PC・スマートフォン（iOS Safari / Android Chrome）のどちらのブラウザでも、インストール不要で即座にプレイできます。

---

## 📖 ゲーム概要と操作方法

### ■ コンセプト
プレイヤーは見知らぬ洋館の密室に閉じ込められた探索者となり、部屋の東西南北360度を見渡しながら、隠されたアイテムの発見・工具による分解・合成、照明スイッチによる「暗闇モード」での隠し要素探索、そして天体運行に基づく暗号パズルを解き明かして脱出を目指します。

### ■ 収録ステージ
- **STAGE 1: 古びた書斎と賢者の鍵（公開中）**  
  アンティークな書斎を舞台に、天体日誌、蓄光油絵、7冊の蔵書パズル、真鍮の天球儀、隠し壁金庫が絡み合う多層構造の脱出パズル。
- **STAGE 2 以降**  
  新たなテーマの密室を順次追加できる拡張可能なアーキテクチャで設計されています。

### ■ 操作方法
| アクション | 操作方法（スマホ / PC） |
| :--- | :--- |
| **視点の旋回** | 画面左右の「◀」「▶」ナビゲーションボタンをタップ（北・東・南・西を360度ループ） |
| **家具・仕掛けの調査** | 気になる場所をタップ/クリックして拡大モーダルを表示 |
| **アイテムの選択** | 画面下部インベントリスロットをタップ（金色の枠線が点灯） |
| **アイテムの使用** | アイテム選択状態で対象のオブジェクト（鍵穴やスロット等）をタップ |
| **アイテムの調べる（分解・合成）** | 選択中のアイテムスロットを「もう一度タップ」して詳細表示（工具で開ける・部品を合成する等） |
| **各種設定** | 画面右上の **⚙️（歯車アイコン）** から「音量ON/OFF」「最初からやり直す」「タイトルへ戻る」 |

---

## 🛠 使用技術一覧 (Tech Stack)

| カテゴリ | 技術・ツール | 選定理由・役割 |
| :--- | :--- | :--- |
| **Core Frontend** | **Vanilla JavaScript (ES6+)** | フレームワーク不使用。DOM操作・イベント駆動・状態遷移をピュアJSで高速制御。 |
| **Markup & Layout** | **HTML5 / CSS3** | セマンティックなマークアップ、Flexbox/CSS Grid、CSSカスタムプロパティ（変数）。 |
| **Graphics** | **Inline SVG (Vector)** | 外部画像ファイルゼロ。4Kモニタからスマホまで完全レスポンシブかつ劣化のないベクター描画。 |
| **Audio Synthesis** | **Web Audio API** | 外部音声（mp3/wav）のロード不要。オシレーター（発振器）による効果音のリアルタイム波形合成。 |
| **Storage** | **Web Storage API (`localStorage`)** | ゲーム進行度・所持アイテム・フラグ・クリアタイムの完全自動永続化（オートセーブ）。 |
| **Hosting & Infra** | **Cloudflare Workers / Pages** | エッジネットワークからの超高速レスポンス配信、SSL常時適用。 |
| **Dev & AI Pair** | **Google Antigravity / Git** | 高速なプロトタイピング、ペアプログラミングによるリファクタリング、Gitバージョン管理。 |

---

## 💡 技術的なこだわり・工夫した点 (Architecture & Engineering)

### 1. 外部依存ゼロ（Zero-Dependency）による究極の軽量化と瞬時起動
- **外部アセットの通信遅延ゼロ**: 画像ファイル（PNG/JPG）や音声ファイル（MP3）を一切使わず、家具やアイテムは全て**インラインSVGコード**、効果音は **Web Audio API のオシレーターによる周波数合成（コード生成）** で実現しました。
- これにより、初回アクセス時のロード時間は実質ゼロとなり、オフライン環境や低速回線でもストレスなく瞬時にゲームが起動します。

### 2. 単一状態管理（Single Source of Truth）と堅牢なオートセーブ
- 部屋の視点方位、インベントリ、各パズルの角度・解錠フラグ、経過タイムなど、ゲームの全進行状態を1つの `state` オブジェクトに集約。
- 状態が更新されるたびに `saveGame()` が呼び出され、`localStorage` へ自動同期。ブラウザの誤リロードや移動中の中断があっても、1タップで完全に直前の状態からシームレスに再開できる堅牢なライフサイクルを構築しています。

### 3. スマホファーストの日本語タイポグラフィとレスポンシブ組版
- **自然な文節改行**: 見出しやメッセージに `word-break: auto-phrase;`、`overflow-wrap: anywhere;`、`text-wrap: balance / pretty;` を適用し、日本語特有の単語・助詞の途中での不自然なブツ切り改行をCSSレベルで抑止。
- **文節スパン（`.phrase`）**: 重要な説明文やヒント文は `<span class="phrase">`（`display: inline-block; white-space: nowrap;`）で意味のまとまりごとに構造化。PCなどの大画面では1行で美しく中央揃えされ、スマホの狭い画面では文節の境目で自然に折り返されます。
- **文字溢れゼロ設計**: ボタンやステータス表示には `white-space: nowrap;` と `font-size: clamp(...)` を掛け合わせ、いかなる画面サイズ（320px〜4K）でも文字の枠はみ出しやレイアウト崩れが発生しません。

---

## 🚀 開発中に直面した課題と解決策 (Problem Solving)

### 課題1: パズルの総当たり（当てずっぽう）とヒント重複によるゲーム性の破綻
- **直面した問題**:  
  初期設計の本棚パズルは本が4冊（$4! = 24$通り）しかなく、プレイヤーがノーヒントで当てずっぽうに押しても数分で解けてしまう問題がありました。また、油絵の蓄光仕掛けと机の天体日誌の両方に同一のヒントが書かれており、せっかくの暗闇モードの価値が薄れていました。
- **解決アプローチ**:  
  1. 本棚の蔵書を**7冊（順列 $_{7}P_{4} = 840$通り）**へと大幅に拡張。4冊押し終えるまで判定を伏せることで総当たりを数学的に防止しました。
  2. 天体日誌を「時計パズルの東西方位推理」専用とし、油絵は「本棚パズルの星座順序」専用へと役割を完全分離。
  3. さらに、部屋の西側（ソファ室）に「真鍮の天球儀」ギミックを新設することで、序盤で役割を終えがちだった部屋が終盤まで重要な探索拠点として機能し続ける、多層的で満足度の高いゲームフローへとリファクタリングしました。

### 課題2: `innerText` によるHTMLコード露出バグと安全な文節分割
- **直面した問題**:  
  アイテム詳細画面を改行最適化（`<span class="phrase">`）した際、DOMへの反映処理で `innerText` を用いていたため、ブラウザによってHTMLタグが実体参照エスケープされ、画面上に `<span class="phrase">...</span>` というコードがそのままテキストとして表示されてしまう不具合が発生しました。
- **解決アプローチ**:  
  `innerText` から `innerHTML` への修正に加え、今後のテキスト更新において開発者がタグ直書きでも、スラッシュ（`/`）や改行（`\n`）区切りのプレーンテキストで記述しても、自動判別して文節インラインブロックへ変換するフォーマッターを実装。記述ミスによるレイアウト崩れを恒久的に防止しました。

### 課題3: モバイル実機での画面ヘッダー密集と誤タップ
- **直面した問題**:  
  画面上部に「メニューに戻る」「リセット」「音量ON/OFF」などのボタンが複数並んでいたため、iPhone等の実機でプレイした際にヘッダーが圧迫され、意図せずリセットボタンを押してしまう危険性がありました。
- **解決アプローチ**:  
  これらの操作を画面右上の単一の「⚙️（設定モーダル）」ダイアログへ統合・集約。ヘッダーの専有面積を最小化して探索ビューを最大限に広げ、片手操作時でも押し間違いが発生しない直感的なUIへと刷新しました。

---

## 📜 開発履歴 (Development Log)

日ごとのコミット推移、機能実装ログ、および詳細な謎解きフローチャート（Mermaid図）は、以下の開発日誌にて公開・随時更新しています。

👉 **[詳細な開発日誌を見る (DEVLOG.md)](DEVLOG.md)**

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) のもとで公開されています。
