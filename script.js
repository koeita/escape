/**
 * 古びた書斎と賢者の鍵 - フルリメイク版
 * 多層暗号、照明スイッチ（暗闇モード）、アイテム分解・合成、隠し金庫ギミック
 */

document.addEventListener('DOMContentLoaded', () => {
  const SAVE_KEY_1 = 'escape_game_stage1_save_v2';
  const SAVE_KEY_2 = 'escape_game_stage2_save_v1';
  let currentStage = 1;

  // --- アイテム定義 ---
  const ITEMS = {
    screwdriver: {
      id: 'screwdriver',
      name: '精密ドライバー',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="18" y="4" width="4" height="18" fill="#c0392b" rx="2"/><line x1="20" y1="22" x2="20" y2="34" stroke="#bdc3c7" stroke-width="3" stroke-linecap="round"/><line x1="18" y1="34" x2="22" y2="34" stroke="#7f8c8d" stroke-width="2"/></svg>`,
      desc: '<span class="phrase">絨毯の隅に隠されていた</span><span class="phrase">細身のマイナスドライバー。</span><span class="phrase">小さなネジを外すのに</span><span class="phrase">使えそうだ。</span>'
    },
    music_box: {
      id: 'music_box',
      name: '真鍮の小箱',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="8" y="10" width="24" height="20" fill="#b78727" stroke="#684a0d" stroke-width="2" rx="3"/><circle cx="20" cy="20" r="4" fill="#684a0d"/><circle cx="12" cy="14" r="1.5" fill="#333"/><circle cx="28" cy="14" r="1.5" fill="#333"/><circle cx="12" cy="26" r="1.5" fill="#333"/><circle cx="28" cy="26" r="1.5" fill="#333"/></svg>`,
      desc: '<span class="phrase">ソファの隙間に挟まっていた</span><span class="phrase">頑丈な金属小箱。</span><span class="phrase">裏蓋が4隅のネジで</span><span class="phrase">留められている。</span><span class="phrase">【調べる】で工具を使って</span><span class="phrase">開けられそうだ。</span>'
    },
    silver_key: {
      id: 'silver_key',
      name: '小さな銀の鍵',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><circle cx="15" cy="15" r="7" fill="none" stroke="#bdc3c7" stroke-width="3"/><line x1="20" y1="20" x2="30" y2="30" stroke="#bdc3c7" stroke-width="4" stroke-linecap="round"/><line x1="26" y1="26" x2="29" y2="23" stroke="#bdc3c7" stroke-width="3"/></svg>`,
      desc: '<span class="phrase">小箱の中から出てきた</span><span class="phrase">銀色の鍵。</span><span class="phrase">机の引き出しに合いそうだ。</span>'
    },
    star_disc: {
      id: 'star_disc',
      name: '星座の円盤',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><circle cx="20" cy="20" r="13" fill="#1b2631" stroke="#f1c40f" stroke-width="2.5"/><polygon points="20,11 22,17 28,17 23,21 25,27 20,23 15,27 17,21 12,17 18,17" fill="#f1c40f"/><circle cx="20" cy="20" r="2.5" fill="#1b2631"/></svg>`,
      desc: '<span class="phrase">小箱の中から見つかった</span><span class="phrase">青銅と真鍮の円盤。</span><span class="phrase">中央に星の紋様が刻まれ、</span><span class="phrase">何かの台座にはめる突起がある。</span>'
    },
    armillary_pin: {
      id: 'armillary_pin',
      name: '星型の真鍮ピン',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><polygon points="20,6 23,15 32,15 25,20 27,29 20,24 13,29 15,20 8,15 17,15" fill="#f1c40f" stroke="#b78727" stroke-width="1.5"/><line x1="20" y1="24" x2="20" y2="34" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/></svg>`,
      desc: '<span class="phrase">壁金庫の中に納められていた</span><span class="phrase">小さな真鍮ピン。</span><span class="phrase">天球儀のロック穴に</span><span class="phrase">ぴったり合いそうだ。</span>'
    },
    switch_key: {
      id: 'switch_key',
      name: '端子盤の鍵',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><circle cx="14" cy="14" r="6" fill="none" stroke="#e67e22" stroke-width="3"/><line x1="18" y1="18" x2="28" y2="28" stroke="#e67e22" stroke-width="3" stroke-linecap="round"/><line x1="24" y1="24" x2="27" y2="21" stroke="#e67e22" stroke-width="2.5"/></svg>`,
      desc: '<span class="phrase">机の引き出しに入っていた</span><span class="phrase">小さな真鍮鍵。</span><span class="phrase">扉の横の照明盤カバーを</span><span class="phrase">開けられそうだ。</span>'
    },
    poker: {
      id: 'poker',
      name: '真鍮の火かき棒',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><line x1="10" y1="30" x2="28" y2="12" stroke="#7f8c8d" stroke-width="3" stroke-linecap="round"/><path d="M 28,12 Q 32,8 30,6" stroke="#7f8c8d" stroke-width="2.5" fill="none"/><line x1="10" y1="30" x2="14" y2="33" stroke="#7f8c8d" stroke-width="2.5"/></svg>`,
      desc: '<span class="phrase">天球儀の中から見つかった</span><span class="phrase">真鍮の棒。</span><span class="phrase">先端がフック状になっており、</span><span class="phrase">重い物を引っ掛けて動かせる。</span>'
    },
    emblem: {
      id: 'emblem',
      name: '賢者の青玉紋章',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><circle cx="20" cy="20" r="12" fill="#b78727" stroke="#684a0d" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="#3498db" stroke="#1b4f72" stroke-width="1.5"/></svg>`,
      desc: '<span class="phrase">暖炉の灰の中から引き上げた</span><span class="phrase">重厚なメダル。</span><span class="phrase">中央に神秘的な青い宝玉が</span><span class="phrase">嵌め込まれている。</span>'
    },
    broken_key: {
      id: 'broken_key',
      name: '不完全な鍵身',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><line x1="14" y1="26" x2="28" y2="12" stroke="#f1c40f" stroke-width="4" stroke-linecap="round"/><line x1="24" y1="16" x2="27" y2="13" stroke="#f1c40f" stroke-width="3"/><circle cx="12" cy="28" r="4" fill="none" stroke="#f1c40f" stroke-width="2" stroke-dasharray="2,2"/></svg>`,
      desc: '<span class="phrase">古時計から落ちてきた</span><span class="phrase">真鍮の鍵軸。</span><span class="phrase">持ち手が欠損しており</span><span class="phrase">回すことができない。</span><span class="phrase">【調べる】で別のパーツを</span><span class="phrase">結合できそうだ。</span>'
    },
    brass_key: {
      id: 'brass_key',
      name: '賢者の真鍮鍵',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><circle cx="15" cy="15" r="8" fill="#3498db" stroke="#f1c40f" stroke-width="3.5"/><line x1="21" y1="21" x2="33" y2="33" stroke="#f1c40f" stroke-width="4.5" stroke-linecap="round"/><line x1="29" y1="29" x2="33" y2="25" stroke="#f1c40f" stroke-width="3"/><line x1="25" y1="25" x2="29" y2="21" stroke="#f1c40f" stroke-width="3"/></svg>`,
      desc: '<span class="phrase">鍵身に青玉紋章を結合して</span><span class="phrase">完成した真鍮の大鍵。</span><span class="phrase">大扉の頑丈な鍵穴に適合する！</span>'
    },
    // --- Stage 2 Items ---
    s2_driver: {
      id: 's2_driver',
      name: '絶縁ドライバー',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="16" y="4" width="8" height="16" fill="#e67e22" stroke="#d35400" stroke-width="1.5" rx="2"/><line x1="20" y1="20" x2="20" y2="34" stroke="#95a5a6" stroke-width="3" stroke-linecap="round"/><line x1="17" y1="34" x2="23" y2="34" stroke="#bdc3c7" stroke-width="2"/></svg>`,
      desc: '<span class="phrase">保守員デスクから見つけた</span><span class="phrase">高電圧対応の絶縁ドライバー。</span><span class="phrase">ダクトのネジ外しや</span><span class="phrase">カプセルのこじ開けに使える。</span>'
    },
    s2_frozen_pack: {
      id: 's2_frozen_pack',
      name: '密閉冷凍カプセル',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="12" y="7" width="16" height="26" rx="5" fill="#d4af37" stroke="#f1c40f" stroke-width="2"/><rect x="10" y="17" width="20" height="6" fill="#2c3e50"/><circle cx="15" cy="20" r="1.5" fill="#bdc3c7"/><circle cx="25" cy="20" r="1.5" fill="#bdc3c7"/></svg>`,
      desc: '<span class="phrase">解凍された保管庫から取り出した</span><span class="phrase">金属製カプセル。</span><span class="phrase">中央のクランプがネジ留めされている。</span><span class="phrase">【調べる】で工具を使って</span><span class="phrase">分解できそうだ。</span>'
    },
    s2_fuse: {
      id: 's2_fuse',
      name: '高圧増設ヒューズ(40V)',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="8" y="14" width="24" height="12" rx="2" fill="#1b2631" stroke="#c89b3c" stroke-width="2"/><line x1="12" y1="20" x2="28" y2="20" stroke="#2ecc71" stroke-width="2.5"/><rect x="5" y="16" width="4" height="8" fill="#d4af37"/><rect x="31" y="16" width="4" height="8" fill="#d4af37"/></svg>`,
      desc: '<span class="phrase">カプセルに入っていた大容量ヒューズ。</span><span class="phrase">配電グリッド盤の増設スロットに</span><span class="phrase">装着すれば、最大電力を</span><span class="phrase">100Vから140Vへ拡張できる。</span>'
    },
    s2_thermal_gel: {
      id: 's2_thermal_gel',
      name: '高熱反応カートリッジ',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="13" y="10" width="14" height="22" rx="3" fill="#c0392b" stroke="#e74c3c" stroke-width="2"/><path d="M20 14 c3 4 -3 6 0 10" stroke="#f1c40f" stroke-width="2" fill="none"/><rect x="16" y="6" width="8" height="4" fill="#7f8c8d"/></svg>`,
      desc: '<span class="phrase">カプセルから出てきた</span><span class="phrase">テルミット燃料カートリッジ。</span><span class="phrase">単体では点火できない。</span><span class="phrase">【調べる】で着火ユニットと</span><span class="phrase">結合できそうだ。</span>'
    },
    s2_igniter: {
      id: 's2_igniter',
      name: '圧電着火ユニット',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><path d="M12 28 L18 12 L28 12 L28 20 L20 20 L18 28 Z" fill="#34495e" stroke="#95a5a6" stroke-width="2"/><line x1="28" y1="15" x2="34" y2="15" stroke="#f1c40f" stroke-width="2.5"/></svg>`,
      desc: '<span class="phrase">オシロスコープの格納トレイから</span><span class="phrase">現れた高出力着火ノズル。</span><span class="phrase">【調べる】で燃料カートリッジと</span><span class="phrase">結合できる。</span>'
    },
    s2_heat_torch: {
      id: 's2_heat_torch',
      name: '小型サーマルトーチ',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="12" y="16" width="12" height="18" rx="2" fill="#c0392b" stroke="#e74c3c" stroke-width="1.5"/><path d="M14 16 L18 8 L26 8 L26 14 L20 16 Z" fill="#34495e" stroke="#bdc3c7" stroke-width="1.5"/><path d="M27 11 Q34 8 36 11 Q34 14 27 11" fill="#f39c12"/></svg>`,
      desc: '<span class="phrase">燃料カートリッジと着火器を結合した</span><span class="phrase">高熱バーナートーチ。</span><span class="phrase">壁面の火災温度センサーを</span><span class="phrase">一気に75℃以上へ加熱できる！</span>'
    },
    s2_id_card: {
      id: 's2_id_card',
      name: '主任研究員のIDカード',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="6" y="11" width="28" height="18" rx="2" fill="#1b4f72" stroke="#3498db" stroke-width="2"/><line x1="10" y1="16" x2="22" y2="16" stroke="#fff" stroke-width="2"/><line x1="10" y1="21" x2="30" y2="21" stroke="#85c1e9" stroke-width="1.5"/><rect x="25" y="14" width="5" height="5" fill="#f1c40f"/></svg>`,
      desc: '<span class="phrase">深層演算室（SEC-03）の</span><span class="phrase">主任研究員カード。</span><span class="phrase">裏面に『固有基準クロック：40 Hz』と</span><span class="phrase">刻印されている。</span>'
    },
    s2_override_key: {
      id: 's2_override_key',
      name: '物理マスターキー',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><polygon points="14,8 22,8 25,14 22,20 14,20 11,14" fill="#2c3e50" stroke="#c89b3c" stroke-width="2.5"/><circle cx="18" cy="14" r="3" fill="#3498db"/><line x1="23" y1="18" x2="33" y2="28" stroke="#c89b3c" stroke-width="4" stroke-linecap="round"/><line x1="28" y1="28" x2="32" y2="24" stroke="#c89b3c" stroke-width="3"/></svg>`,
      desc: '<span class="phrase">サーバーラックの保管庫から入手した</span><span class="phrase">対シェルター隔壁用の物理鍵。</span><span class="phrase">耐爆ハッチの最終マスター鍵穴に</span><span class="phrase">適合する！</span>'
    }
  };

  // --- 初期ゲーム状態 ---
  function createInitialState() {
    return {
      currentDirection: 0,
      directions: [
        { name: '正面 (北)', id: 'view-north' },
        { name: '右側 (東)', id: 'view-east' },
        { name: '後方 (南)', id: 'view-south' },
        { name: '左側 (西)', id: 'view-west' }
      ],
      inventory: [],
      selectedItem: null,
      
      // 新ギミックフラグ
      isLightOn: true,
      switchCoverUnlocked: false,
      carpetFlipped: false,
      hasScrewdriver: false,
      sofaBoxFound: false,
      boxDisassembled: false,
      drawerUnlocked: false,
      hasSwitchKey: false,
      hasPoker: false,
      fireplaceGrilleRemoved: false,
      hasEmblem: false,
      booksSequence: [],
      booksPuzzleSolved: false,
      safeDiscInserted: false,
      safeAngle: 0,
      safeUnlocked: false,
      hasArmillaryPin: false,
      armillaryPinInserted: false,
      armillaryAngle: 90,
      armillaryOpened: false,
      clockHour: 12,
      clockMinute: 0,
      clockPuzzleSolved: false,
      hasBrokenKey: false,
      keyAssembled: false,
      doorCode: [0, 0, 0, 0],
      doorKeyUnlocked: false,
      doorCodeUnlocked: false,
      gameCleared: false,
      
      startTime: Date.now(),
      elapsedBeforeSave: 0
    };
  }

  function createStage2InitialState() {
    return {
      stage: 2,
      currentDirection: 0,
      directions: [
        { name: '正面 (北)', id: 's2-view-north' },
        { name: '右側 (東)', id: 's2-view-east' },
        { name: '後方 (南)', id: 's2-view-south' },
        { name: '左側 (西)', id: 's2-view-west' }
      ],
      inventory: [],
      selectedItem: null,

      hasS2Driver: false,
      fuseInserted: false,
      powerVent: true,
      powerCryo: true,
      powerServer: false,
      powerAux: false,
      hasFrozenPack: false,
      packDisassembled: false,
      ductGrilleRemoved: false,
      hasIdCard: false,
      oscWave: 'SINE',
      oscFreq: 40,
      oscPhase: 0,
      oscAmp: 1,
      oscSolved: false,
      hasIgniter: false,
      torchAssembled: false,
      sensorHeated: false,
      keyboxUnlocked: false,
      hasOverrideKey: false,
      aiSector: 0,
      aiCondExt: 0,
      aiCondInt: 0,
      aiDirective: 0,
      aiSafeMode: false,
      hatchCode: [0, 0, 0, 0],
      hatchCodeUnlocked: false,
      hatchKeyUnlocked: false,
      gameCleared: false,

      startTime: Date.now(),
      elapsedBeforeSave: 0
    };
  }

  let state = createInitialState();

  // --- DOM要素 ---
  const elMenuScreen = document.getElementById('menu-screen');
  const elGameContainer = document.getElementById('game-container');
  const elBtnPlayStage1 = document.getElementById('btn-play-stage-1');
  const elBtnRestartStage1 = document.getElementById('btn-restart-stage-1');
  const elStage1Badge = document.getElementById('stage-1-badge');
  const elStage1Meta = document.getElementById('stage-1-meta');
  const elBtnPlayStage2 = document.getElementById('btn-play-stage-2');
  const elBtnRestartStage2 = document.getElementById('btn-restart-stage-2');
  const elStage2Badge = document.getElementById('stage-2-badge');
  const elStage2Meta = document.getElementById('stage-2-meta');
  const elGameStageTitle = document.getElementById('game-stage-title');
  const elBtnClearToMenu = document.getElementById('btn-clear-to-menu');

  // 設定関連DOM要素
  const elBtnGameSettings = document.getElementById('btn-game-settings');
  const elMenuBtnSettings = document.getElementById('menu-btn-settings');
  const elSettingsModal = document.getElementById('settings-modal');
  const elSettingsModalClose = document.getElementById('settings-modal-close');
  const elBtnToggleSound = document.getElementById('btn-toggle-sound-setting');
  const elSoundSettingStatus = document.getElementById('sound-setting-status');
  const elBtnSettingToMenu = document.getElementById('btn-setting-to-menu');
  const elBtnSettingRestart = document.getElementById('btn-setting-restart');
  const elBlockMenuReturn = document.getElementById('block-menu-return');
  const elBlockRestartStage = document.getElementById('block-restart-stage');

  const elDirectionText = document.getElementById('current-direction-text');
  const elMessageBar = document.getElementById('message-bar');
  const elModalOverlay = document.getElementById('modal-overlay');
  const elModalContent = document.getElementById('modal-content');
  const elModalClose = document.getElementById('modal-close');
  const elItemDetailModal = document.getElementById('item-detail-modal');
  const elItemDetailClose = document.getElementById('item-detail-close');
  const elItemDetailIcon = document.getElementById('item-detail-icon');
  const elItemDetailName = document.getElementById('item-detail-name');
  const elItemDetailDesc = document.getElementById('item-detail-desc');
  const elItemDetailActionArea = document.getElementById('item-detail-action-area');
  const elBtnItemAction = document.getElementById('btn-item-action');
  const elGameClearModal = document.getElementById('game-clear-modal');
  const elClearTimeDisplay = document.getElementById('clear-time-display');
  const elBtnPlayAgain = document.getElementById('btn-play-again');

  // --- セーブ＆ロード機能 ---
  function saveGame() {
    try {
      const now = Date.now();
      const currentSessionTime = state.startTime ? (now - state.startTime) : 0;
      const totalElapsed = (state.elapsedBeforeSave || 0) + currentSessionTime;

      if (currentStage === 2) {
        const saveData2 = {
          version: 1,
          savedAt: now,
          elapsedMs: totalElapsed,
          state: {
            currentDirection: state.currentDirection,
            inventoryIds: state.inventory.map(i => i.id),
            selectedItem: state.selectedItem,
            hasS2Driver: state.hasS2Driver,
            fuseInserted: state.fuseInserted,
            powerVent: state.powerVent,
            powerCryo: state.powerCryo,
            powerServer: state.powerServer,
            powerAux: state.powerAux,
            hasFrozenPack: state.hasFrozenPack,
            packDisassembled: state.packDisassembled,
            ductGrilleRemoved: state.ductGrilleRemoved,
            hasIdCard: state.hasIdCard,
            oscWave: state.oscWave,
            oscFreq: state.oscFreq,
            oscPhase: state.oscPhase,
            oscAmp: state.oscAmp,
            oscSolved: state.oscSolved,
            hasIgniter: state.hasIgniter,
            torchAssembled: state.torchAssembled,
            sensorHeated: state.sensorHeated,
            keyboxUnlocked: state.keyboxUnlocked,
            hasOverrideKey: state.hasOverrideKey,
            aiSector: state.aiSector,
            aiCondExt: state.aiCondExt,
            aiCondInt: state.aiCondInt,
            aiDirective: state.aiDirective,
            aiSafeMode: state.aiSafeMode,
            hatchCode: state.hatchCode,
            hatchCodeUnlocked: state.hatchCodeUnlocked,
            hatchKeyUnlocked: state.hatchKeyUnlocked,
            gameCleared: state.gameCleared
          }
        };
        localStorage.setItem(SAVE_KEY_2, JSON.stringify(saveData2));
        return;
      }

      const saveData = {
        version: 2,
        savedAt: now,
        elapsedMs: totalElapsed,
        state: {
          currentDirection: state.currentDirection,
          inventoryIds: state.inventory.map(i => i.id),
          selectedItem: state.selectedItem,
          isLightOn: state.isLightOn,
          switchCoverUnlocked: state.switchCoverUnlocked,
          carpetFlipped: state.carpetFlipped,
          hasScrewdriver: state.hasScrewdriver,
          sofaBoxFound: state.sofaBoxFound,
          boxDisassembled: state.boxDisassembled,
          drawerUnlocked: state.drawerUnlocked,
          hasSwitchKey: state.hasSwitchKey,
          hasPoker: state.hasPoker,
          fireplaceGrilleRemoved: state.fireplaceGrilleRemoved,
          hasEmblem: state.hasEmblem,
          booksSequence: state.booksSequence,
          booksPuzzleSolved: state.booksPuzzleSolved,
          safeDiscInserted: state.safeDiscInserted,
          safeAngle: state.safeAngle,
          safeUnlocked: state.safeUnlocked,
          hasArmillaryPin: state.hasArmillaryPin,
          armillaryPinInserted: state.armillaryPinInserted,
          armillaryAngle: state.armillaryAngle,
          armillaryOpened: state.armillaryOpened,
          clockHour: state.clockHour,
          clockMinute: state.clockMinute,
          clockPuzzleSolved: state.clockPuzzleSolved,
          hasBrokenKey: state.hasBrokenKey,
          keyAssembled: state.keyAssembled,
          doorCode: state.doorCode,
          doorKeyUnlocked: state.doorKeyUnlocked,
          doorCodeUnlocked: state.doorCodeUnlocked,
          gameCleared: state.gameCleared
        }
      };

      localStorage.setItem(SAVE_KEY_1, JSON.stringify(saveData));
    } catch (e) {
      console.warn('Failed to save game:', e);
    }
  }

  function getSavedData(stageNum = currentStage) {
    try {
      const key = stageNum === 2 ? SAVE_KEY_2 : SAVE_KEY_1;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function applySavedState(savedData) {
    if (!savedData || !savedData.state) return;
    const s = savedData.state;

    state.currentDirection = s.currentDirection || 0;
    state.inventory = (s.inventoryIds || []).map(id => ITEMS[id]).filter(Boolean);
    state.selectedItem = s.selectedItem || null;
    state.isLightOn = s.isLightOn !== false;
    state.switchCoverUnlocked = !!s.switchCoverUnlocked;
    state.carpetFlipped = !!s.carpetFlipped;
    state.hasScrewdriver = !!s.hasScrewdriver;
    state.sofaBoxFound = !!s.sofaBoxFound;
    state.boxDisassembled = !!s.boxDisassembled;
    state.drawerUnlocked = !!s.drawerUnlocked;
    state.hasSwitchKey = !!s.hasSwitchKey;
    state.hasPoker = !!s.hasPoker;
    state.fireplaceGrilleRemoved = !!s.fireplaceGrilleRemoved;
    state.hasEmblem = !!s.hasEmblem;
    state.booksSequence = s.booksSequence || [];
    state.booksPuzzleSolved = !!s.booksPuzzleSolved;
    state.safeDiscInserted = !!s.safeDiscInserted;
    state.safeAngle = s.safeAngle || 0;
    state.safeUnlocked = !!s.safeUnlocked;
    state.hasArmillaryPin = !!s.hasArmillaryPin;
    state.armillaryPinInserted = !!s.armillaryPinInserted;
    state.armillaryAngle = s.armillaryAngle !== undefined ? s.armillaryAngle : 90;
    state.armillaryOpened = !!s.armillaryOpened;
    state.clockHour = s.clockHour || 12;
    state.clockMinute = s.clockMinute || 0;
    state.clockPuzzleSolved = !!s.clockPuzzleSolved;
    state.hasBrokenKey = !!s.hasBrokenKey;
    state.keyAssembled = !!s.keyAssembled;
    state.doorCode = s.doorCode || [0, 0, 0, 0];
    state.doorKeyUnlocked = !!s.doorKeyUnlocked;
    state.doorCodeUnlocked = !!s.doorCodeUnlocked;
    state.gameCleared = !!s.gameCleared;
    state.elapsedBeforeSave = savedData.elapsedMs || 0;
    state.startTime = Date.now();

    updateRoomDomState();
  }

  function applyStage2SavedState(savedData) {
    state = createStage2InitialState();
    if (!savedData || !savedData.state) return;
    const s = savedData.state;
    state.currentDirection = s.currentDirection || 0;
    state.inventory = (s.inventoryIds || []).map(id => ITEMS[id]).filter(Boolean);
    state.selectedItem = s.selectedItem || null;
    state.hasS2Driver = !!s.hasS2Driver;
    state.fuseInserted = !!s.fuseInserted;
    state.powerVent = s.powerVent !== false;
    state.powerCryo = s.powerCryo !== false;
    state.powerServer = !!s.powerServer;
    state.powerAux = !!s.powerAux;
    state.hasFrozenPack = !!s.hasFrozenPack;
    state.packDisassembled = !!s.packDisassembled;
    state.ductGrilleRemoved = !!s.ductGrilleRemoved;
    state.hasIdCard = !!s.hasIdCard;
    state.oscWave = s.oscWave || 'SINE';
    state.oscFreq = s.oscFreq || 40;
    state.oscPhase = s.oscPhase || 0;
    state.oscAmp = s.oscAmp || 1;
    state.oscSolved = !!s.oscSolved;
    state.hasIgniter = !!s.hasIgniter;
    state.torchAssembled = !!s.torchAssembled;
    state.sensorHeated = !!s.sensorHeated;
    state.keyboxUnlocked = !!s.keyboxUnlocked;
    state.hasOverrideKey = !!s.hasOverrideKey;
    state.aiSector = s.aiSector || 0;
    state.aiCondExt = s.aiCondExt || 0;
    state.aiCondInt = s.aiCondInt || 0;
    state.aiDirective = s.aiDirective || 0;
    state.aiSafeMode = !!s.aiSafeMode;
    state.hatchCode = s.hatchCode || [0, 0, 0, 0];
    state.hatchCodeUnlocked = !!s.hatchCodeUnlocked;
    state.hatchKeyUnlocked = !!s.hatchKeyUnlocked;
    state.gameCleared = !!s.gameCleared;
    state.elapsedBeforeSave = savedData.elapsedMs || 0;
    state.startTime = Date.now();
    updateRoomDomState();
  }

  function getStage2UsedPower() {
    let used = 0;
    if (state.powerVent) used += 40;
    if (state.powerCryo) used += 40;
    if (state.powerServer) used += 60;
    if (state.powerAux) used += 40;
    return used;
  }

  function getStage2MaxPower() {
    return state.fuseInserted ? 140 : 100;
  }

  function updateStage2DomState() {
    document.body.classList.remove('dark-mode');
    const usedPwr = getStage2UsedPower();
    const maxPwr = getStage2MaxPower();

    // 北：AIモニタ・ハッチLED・環境ステータスボード
    const eyeRing = document.getElementById('s2-ai-eye-ring');
    const eyeGlow = document.getElementById('s2-ai-eye-glow');
    const eyeCore = document.getElementById('s2-ai-eye-core');
    const aiText = document.getElementById('s2-ai-status-text');
    if (eyeRing && eyeGlow && eyeCore && aiText) {
      if (state.aiSafeMode) {
        eyeRing.setAttribute('stroke', '#3498db');
        eyeGlow.setAttribute('fill', '#1b4f72');
        eyeGlow.setAttribute('stroke', '#5dade2');
        eyeCore.setAttribute('fill', '#85c1e9');
        aiText.textContent = 'ARES: SAFE MODE';
        aiText.setAttribute('fill', '#3498db');
      } else {
        eyeRing.setAttribute('stroke', '#c0392b');
        eyeGlow.setAttribute('fill', '#781818');
        eyeGlow.setAttribute('stroke', '#e74c3c');
        eyeCore.setAttribute('fill', '#ff4d4d');
        aiText.textContent = 'ARES: LOCKDOWN';
        aiText.setAttribute('fill', '#e74c3c');
      }
    }

    const ledHydr = document.getElementById('s2-led-hydraulic');
    const ledLogic = document.getElementById('s2-led-ailogic');
    const ledMaster = document.getElementById('s2-led-master');
    if (ledHydr) ledHydr.setAttribute('fill', state.sensorHeated ? '#2ecc71' : '#e74c3c');
    if (ledLogic) ledLogic.setAttribute('fill', state.aiSafeMode ? '#2ecc71' : '#e74c3c');
    if (ledMaster) ledMaster.setAttribute('fill', (state.hatchCodeUnlocked && state.hatchKeyUnlocked) ? '#2ecc71' : '#e74c3c');

    const brdPwr = document.getElementById('s2-board-power');
    const brdTmp = document.getElementById('s2-board-temp');
    const brdFan = document.getElementById('s2-board-fan');
    const brdCryo = document.getElementById('s2-board-cryo');
    if (brdPwr) brdPwr.textContent = `PWR : ${usedPwr}/${maxPwr}V`;
    if (brdTmp) {
      brdTmp.textContent = state.sensorHeated ? 'TEMP: 78°C (FIRE)' : 'TEMP: 18°C';
      brdTmp.setAttribute('fill', state.sensorHeated ? '#e74c3c' : '#3498db');
    }
    if (brdFan) {
      brdFan.textContent = state.powerVent ? 'VENT: ACTIVE' : 'VENT: STOPPED';
      brdFan.setAttribute('fill', state.powerVent ? '#2ecc71' : '#e67e22');
    }
    if (brdCryo) {
      brdCryo.textContent = state.powerCryo ? 'CRYO: -80°C' : 'CRYO: THAWED';
      brdCryo.setAttribute('fill', state.powerCryo ? '#3498db' : '#2ecc71');
    }

    // 東：配電盤＆オシロスコープ
    const pwrMeter = document.getElementById('s2-svg-power-meter');
    if (pwrMeter) pwrMeter.textContent = `LOAD: ${usedPwr}V / ${maxPwr}V`;
    const ledVent = document.getElementById('s2-brk-led-vent');
    const ledCryo = document.getElementById('s2-brk-led-cryo');
    const ledSrv = document.getElementById('s2-brk-led-srv');
    const ledAux = document.getElementById('s2-brk-led-aux');
    if (ledVent) ledVent.setAttribute('fill', state.powerVent ? '#2ecc71' : '#e74c3c');
    if (ledCryo) ledCryo.setAttribute('fill', state.powerCryo ? '#2ecc71' : '#e74c3c');
    if (ledSrv) ledSrv.setAttribute('fill', state.powerServer ? '#2ecc71' : '#e74c3c');
    if (ledAux) ledAux.setAttribute('fill', state.powerAux ? '#2ecc71' : '#e74c3c');

    const fuseTxt = document.getElementById('s2-svg-fuse-status');
    if (fuseTxt) {
      fuseTxt.textContent = state.fuseInserted ? 'EXPANSION FUSE: [+40V ACTIVE]' : 'EXPANSION FUSE: [EMPTY]';
      fuseTxt.setAttribute('fill', state.fuseInserted ? '#2ecc71' : '#e67e22');
    }

    const oscWave = document.getElementById('s2-svg-osc-wave');
    const oscOff = document.getElementById('s2-svg-osc-off');
    const oscTray = document.getElementById('s2-svg-osc-tray');
    if (oscWave && oscOff) {
      oscWave.style.display = state.powerServer ? 'block' : 'none';
      oscOff.style.display = state.powerServer ? 'none' : 'block';
    }
    if (oscTray) {
      oscTray.textContent = state.oscSolved ? 'FORMULA [DECODED]' : 'LOCKED TRAY';
      oscTray.setAttribute('fill', state.oscSolved ? '#2ecc71' : '#9e988e');
    }

    // 南：サーバーラック
    const srvL1 = document.getElementById('s2-svg-srv-line1');
    const srvL2 = document.getElementById('s2-svg-srv-line2');
    const keyboxTxt = document.getElementById('s2-svg-keybox-text');
    if (srvL1 && srvL2) {
      if (!state.powerServer) {
        srvL1.textContent = 'MAINFRAME: OFFLINE';
        srvL1.setAttribute('fill', '#7f8c8d');
        srvL2.textContent = 'POWER 60V REQUIRED';
      } else if (!state.powerVent) {
        srvL1.textContent = 'WARNING: OVERHEAT';
        srvL1.setAttribute('fill', '#e67e22');
        srvL2.textContent = 'VENT FAN (40V) REQ';
      } else {
        srvL1.textContent = 'ONLINE / JAMMING: 45°';
        srvL1.setAttribute('fill', '#2ecc71');
        srvL2.textContent = state.powerAux ? 'FULL 140V: READY' : 'AUX 40V REQ FOR KEY';
      }
    }
    if (keyboxTxt) {
      keyboxTxt.textContent = state.keyboxUnlocked ? 'KEYBOX: OPEN' : 'KEYBOX: LOCKED';
      keyboxTxt.setAttribute('fill', state.keyboxUnlocked ? '#2ecc71' : '#e74c3c');
    }

    // 西：クライオロッカー・換気ダクト・温度センサー
    const cryoFrost = document.getElementById('s2-svg-cryo-frost');
    const cryoCap = document.getElementById('s2-svg-cryo-capsule');
    const cryoLbl = document.getElementById('s2-svg-cryo-label');
    if (cryoFrost) cryoFrost.style.display = state.powerCryo ? 'block' : 'none';
    if (cryoCap) cryoCap.style.display = state.hasFrozenPack ? 'none' : 'block';
    if (cryoLbl) {
      cryoLbl.textContent = state.powerCryo ? 'CRYO: -80°C' : (state.hasFrozenPack ? 'CRYO: EMPTY' : 'CRYO: UNLOCKED');
      cryoLbl.setAttribute('fill', state.powerCryo ? '#3498db' : '#2ecc71');
    }

    const ductGrille = document.getElementById('s2-svg-duct-grille');
    const ductCard = document.getElementById('s2-svg-duct-card');
    const fanStat = document.getElementById('s2-svg-fan-status');
    if (ductGrille) ductGrille.style.display = state.ductGrilleRemoved ? 'none' : 'block';
    if (ductCard) ductCard.style.display = state.hasIdCard ? 'none' : 'block';
    if (fanStat) {
      fanStat.textContent = state.powerVent ? 'FAN: HIGH SPEED' : 'FAN: STOPPED';
      fanStat.setAttribute('fill', state.powerVent ? '#2ecc71' : '#e67e22');
    }

    const tmpRead = document.getElementById('s2-svg-temp-readout');
    const tmpCore = document.getElementById('s2-svg-sensor-core');
    if (tmpRead) {
      tmpRead.textContent = state.sensorHeated ? '78.0 °C' : '18.0 °C';
      tmpRead.setAttribute('fill', state.sensorHeated ? '#e74c3c' : '#3498db');
    }
    if (tmpCore) tmpCore.setAttribute('fill', state.sensorHeated ? '#e74c3c' : '#3498db');

    updateViewDirection();
    renderInventory();
  }

  function updateRoomDomState() {
    if (currentStage === 2) {
      updateStage2DomState();
      return;
    }
    // 照明モードのクラス
    if (state.isLightOn) {
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
    }

    // 照明スイッチ盤
    const coverBox = document.getElementById('switch-cover-box');
    const keyhole = document.getElementById('switch-keyhole');
    const toggleGrp = document.getElementById('switch-toggle-group');
    const lever = document.getElementById('switch-lever');
    const indText = document.getElementById('switch-indicator-text');
    if (coverBox && toggleGrp) {
      if (state.switchCoverUnlocked) {
        coverBox.style.display = 'none';
        if (keyhole) keyhole.style.display = 'none';
        toggleGrp.style.display = 'block';
        if (state.isLightOn) {
          lever.setAttribute('y', '210');
          indText.textContent = 'ON';
          indText.setAttribute('fill', '#2ecc71');
        } else {
          lever.setAttribute('y', '224');
          indText.textContent = 'OFF';
          indText.setAttribute('fill', '#e74c3c');
        }
      } else {
        coverBox.style.display = 'block';
        if (keyhole) keyhole.style.display = 'block';
        toggleGrp.style.display = 'none';
      }
    }

    // 蓄光絵画レイヤー
    const glowLayer = document.getElementById('painting-glow-layer');
    if (glowLayer) {
      glowLayer.style.display = (!state.isLightOn) ? 'block' : 'none';
    }

    // 絨毯とドライバー
    const carpetFlat = document.getElementById('carpet-corner-flat');
    const carpetFolded = document.getElementById('carpet-corner-folded');
    const carpetScrewdriver = document.getElementById('carpet-screwdriver');
    if (carpetFlat && carpetFolded) {
      carpetFlat.style.display = state.carpetFlipped ? 'none' : 'block';
      carpetFolded.style.display = state.carpetFlipped ? 'block' : 'none';
      if (carpetScrewdriver) {
        carpetScrewdriver.style.display = (state.carpetFlipped && !state.hasScrewdriver) ? 'block' : 'none';
      }
    }

    // ソファの小箱チラ見せ
    const sofaBox = document.getElementById('sofa-box-peek');
    if (sofaBox) {
      sofaBox.style.display = state.sofaBoxFound ? 'none' : 'block';
    }

    // 机の脇の火かき棒
    const objPoker = document.getElementById('obj-poker');
    if (objPoker) {
      objPoker.style.display = state.hasPoker ? 'none' : 'block';
    }

    // 本棚スライドと壁金庫 (広々と露出させてタップしやすく)
    const objSafe = document.getElementById('obj-wall-safe');
    const objBookshelf = document.getElementById('obj-bookshelf');
    if (objSafe && objBookshelf) {
      if (state.booksPuzzleSolved) {
        objSafe.style.display = 'block';
        objBookshelf.setAttribute('transform', 'translate(140, 0)');
      } else {
        objSafe.style.display = 'none';
        objBookshelf.removeAttribute('transform');
      }
    }

    // 暖炉の鉄格子
    const grille = document.getElementById('fireplace-grille');
    const medalHint = document.getElementById('fireplace-medal-hint');
    if (grille) {
      grille.style.display = state.fireplaceGrilleRemoved ? 'none' : 'block';
      if (medalHint) {
        medalHint.style.opacity = (state.fireplaceGrilleRemoved && !state.hasEmblem) ? '1' : '0';
      }
    }

    // 扉のLED
    const doorLed = document.getElementById('door-lock-status-led');
    if (doorLed) {
      if (state.doorCodeUnlocked) {
        doorLed.textContent = '● UNLOCKED';
        doorLed.setAttribute('fill', '#2ecc71');
      } else {
        doorLed.textContent = '● LOCKED';
        doorLed.setAttribute('fill', '#e74c3c');
      }
    }

    updateViewDirection();
    renderInventory();
  }

  // --- メニュー遷移 ---
  function showMenu() {
    saveGame();
    elGameContainer.style.display = 'none';
    elMenuScreen.style.display = 'flex';
    updateMenuScreenInfo();
  }

  function updateCardUI(stageNum, elBadge, elMeta, elBtnPlay, elBtnRestart) {
    if (!elBadge || !elMeta || !elBtnPlay || !elBtnRestart) return;
    const saved = getSavedData(stageNum);
    if (!saved) {
      elBadge.textContent = `STAGE ${stageNum}`;
      elBadge.className = 'stage-card-badge';
      elMeta.textContent = '未プレイ';
      elBtnPlay.textContent = 'プレイする';
      elBtnRestart.style.display = 'none';
    } else if (saved.state.gameCleared) {
      elBadge.textContent = 'CLEARED';
      elBadge.className = 'stage-card-badge cleared';
      const mins = Math.floor(saved.elapsedMs / 60000);
      const secs = Math.floor((saved.elapsedMs % 60000) / 1000);
      elMeta.textContent = `クリア済み (タイム: ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')})`;
      elBtnPlay.textContent = 'もう一度プレイ';
      elBtnRestart.style.display = 'none';
    } else {
      elBadge.textContent = '進行中';
      elBadge.className = 'stage-card-badge saved';
      const itemsCount = (saved.state.inventoryIds || []).length;
      elMeta.textContent = `セーブデータあり（アイテム: ${itemsCount}個）`;
      elBtnPlay.textContent = 'つづきから';
      elBtnRestart.style.display = 'block';
    }
  }

  function updateMenuScreenInfo() {
    updateCardUI(1, elStage1Badge, elStage1Meta, elBtnPlayStage1, elBtnRestartStage1);
    updateCardUI(2, elStage2Badge, elStage2Meta, elBtnPlayStage2, elBtnRestartStage2);
  }

  function launchStage(isNewGame, stageNum = currentStage) {
    currentStage = stageNum;
    soundManager.playClick();

    if (stageNum === 2) {
      if (elGameStageTitle) elGameStageTitle.textContent = '暴走AIと閉鎖シェルター';
      if (isNewGame) {
        state = createStage2InitialState();
        try { localStorage.removeItem(SAVE_KEY_2); } catch (e) {}
        updateRoomDomState();
      } else {
        const saved2 = getSavedData(2);
        if (saved2) {
          applyStage2SavedState(saved2);
        } else {
          state = createStage2InitialState();
          updateRoomDomState();
        }
      }
      elMenuScreen.style.display = 'none';
      elGameContainer.style.display = 'flex';
      setMessage('管理AI「ARES」により地下シェルターが完全封鎖された。/電力を制御し、論理ロックを破って脱出しよう。');
      return;
    }

    if (elGameStageTitle) elGameStageTitle.textContent = '古びた書斎と賢者の鍵';
    if (isNewGame) {
      state = createInitialState();
      try {
        localStorage.removeItem(SAVE_KEY_1);
      } catch (e) {}
      updateRoomDomState();
    } else {
      const saved = getSavedData(1);
      if (saved) {
        state = createInitialState();
        applySavedState(saved);
      } else {
        state = createInitialState();
        updateRoomDomState();
      }
    }

    elMenuScreen.style.display = 'none';
    elGameContainer.style.display = 'flex';
    setMessage('古びた書斎に閉じ込められているようだ。/周囲を探索して脱出しよう。');
  }

  // --- 基本操作 ---
  function setMessage(msg) {
    // 親要素のflexによる左右分裂を防ぐため、全体を1つのdivで包む
    // スラッシュ（/）または改行（\n）の位置で分割する
    const formatted = msg
      .split(/[\/\n]/g)
      .map(part => `<span style="display:inline-block;">${part}</span>`)
      .join('');

    elMessageBar.innerHTML = `<div style="width:100%; text-align:center; line-height:1.5;">${formatted}</div>`;
    elMessageBar.style.opacity = '0';
    setTimeout(() => {
      elMessageBar.style.opacity = '1';
    }, 50);
  }

  function changeDirection(offset) {
    state.currentDirection = (state.currentDirection + offset + 4) % 4;
    soundManager.playTurn();
    updateViewDirection();
  }

  function updateViewDirection() {
    const allViewIds = [
      'view-north', 'view-east', 'view-south', 'view-west',
      's2-view-north', 's2-view-east', 's2-view-south', 's2-view-west'
    ];
    allViewIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    state.directions.forEach((dir, idx) => {
      const el = document.getElementById(dir.id);
      if (el && idx === state.currentDirection) {
        el.style.display = 'block';
      }
    });
    elDirectionText.textContent = state.directions[state.currentDirection].name;
  }

  // --- インベントリ ---
  function addItem(itemId) {
    if (state.inventory.find(i => i.id === itemId)) return;
    const item = ITEMS[itemId];
    if (!item) return;

    state.inventory.push(item);
    soundManager.playItemGet();
    setMessage(`【${item.name}】を手に入れた！`);
    renderInventory();
    saveGame();
  }

  function removeItem(itemId) {
    const idx = state.inventory.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      if (state.selectedItem === itemId) {
        state.selectedItem = null;
      }
      state.inventory.splice(idx, 1);
      renderInventory();
      saveGame();
    }
  }

  function renderInventory() {
    const slots = document.querySelectorAll('.item-slot');
    slots.forEach((slot, index) => {
      slot.innerHTML = '';
      slot.classList.remove('selected');
      const item = state.inventory[index];
      if (item) {
        slot.innerHTML = item.icon;
        if (state.selectedItem === item.id) {
          slot.classList.add('selected');
        }
        slot.onclick = () => handleSlotClick(item.id);
      } else {
        slot.onclick = null;
      }
    });
  }

  function handleSlotClick(itemId) {
    soundManager.playClick();
    if (state.selectedItem === itemId) {
      showItemDetail(itemId);
    } else {
      state.selectedItem = itemId;
      renderInventory();
      const item = ITEMS[itemId];
      setMessage(`【${item.name}】を選択中（もう一度タップで詳細）`);
    }
  }

  // --- アイテム詳細・分解・合成システム ---
  let currentDetailItemId = null;

  function showItemDetail(itemId) {
    currentDetailItemId = itemId;
    const item = ITEMS[itemId];
    if (!item) return;

    elItemDetailIcon.innerHTML = item.icon;
    elItemDetailName.textContent = item.name;
    if (item.desc.includes('<')) {
      elItemDetailDesc.innerHTML = item.desc;
    } else {
      const formatted = item.desc
        .split(/[\/\n]/g)
        .map(part => `<span class="phrase">${part}</span>`)
        .join('');
      elItemDetailDesc.innerHTML = formatted;
    }

    // アクションボタンの表示制御
    if (itemId === 'music_box') {
      elItemDetailActionArea.style.display = 'block';
      elBtnItemAction.textContent = '工具でネジを外す';
      elBtnItemAction.onclick = handleDisassembleBox;
    } else if (itemId === 'broken_key') {
      elItemDetailActionArea.style.display = 'block';
      elBtnItemAction.textContent = '紋章をはめ込んで結合する';
      elBtnItemAction.onclick = handleAssembleKey;
    } else if (itemId === 's2_frozen_pack') {
      elItemDetailActionArea.style.display = 'block';
      elBtnItemAction.textContent = '工具で密閉クランプを外す';
      elBtnItemAction.onclick = handleDisassembleFrozenPack;
    } else if (itemId === 's2_thermal_gel' || itemId === 's2_igniter') {
      elItemDetailActionArea.style.display = 'block';
      elBtnItemAction.textContent = 'カートリッジと着火器を結合する';
      elBtnItemAction.onclick = handleAssembleTorch;
    } else {
      elItemDetailActionArea.style.display = 'none';
    }

    elItemDetailModal.classList.remove('modal-hidden');
  }

  // 小箱の分解
  function handleDisassembleBox() {
    if (state.inventory.some(i => i.id === 'screwdriver')) {
      soundManager.playScrewdriver();
      removeItem('music_box');
      state.boxDisassembled = true;
      elItemDetailModal.classList.add('modal-hidden');

      setTimeout(() => {
        addItem('silver_key');
        setTimeout(() => {
          addItem('star_disc');
          setMessage('ドライバーでネジを外すと、中から「銀の鍵」と「星座の円盤」が現れた！');
        }, 500);
      }, 300);
    } else {
      soundManager.playClick();
      alert('4隅のネジが固く締まっている。小さなドライバーが必要だ。');
    }
  }

  // 鍵の合成
  function handleAssembleKey() {
    if (state.inventory.some(i => i.id === 'emblem')) {
      soundManager.playSolved();
      removeItem('broken_key');
      removeItem('emblem');
      state.keyAssembled = true;
      elItemDetailModal.classList.add('modal-hidden');

      setTimeout(() => {
        addItem('brass_key');
        setMessage('カチリ！ 鍵身に青玉の紋章が吸い込まれるように結合し、「賢者の真鍮鍵」が完成した！');
      }, 400);
    } else {
      soundManager.playClick();
      alert('鍵の頭部に適合する円形パーツ（紋章）が必要だ。');
    }
  }

  function handleDisassembleFrozenPack() {
    if (state.inventory.some(i => i.id === 's2_driver')) {
      soundManager.playScrewdriver();
      removeItem('s2_frozen_pack');
      state.packDisassembled = true;
      elItemDetailModal.classList.add('modal-hidden');
      setTimeout(() => {
        addItem('s2_fuse');
        setTimeout(() => {
          addItem('s2_thermal_gel');
          setMessage('絶縁ドライバーでカプセルを分解し、「高圧増設ヒューズ(40V)」と「高熱反応カートリッジ」を取り出した！');
        }, 450);
      }, 250);
    } else {
      soundManager.playClick();
      alert('カプセルの固定クランプが固く締まっている。ドライバーが必要だ。');
    }
  }

  function handleAssembleTorch() {
    const hasGel = state.inventory.some(i => i.id === 's2_thermal_gel');
    const hasIgn = state.inventory.some(i => i.id === 's2_igniter');
    if (hasGel && hasIgn) {
      soundManager.playSolved();
      removeItem('s2_thermal_gel');
      removeItem('s2_igniter');
      state.torchAssembled = true;
      elItemDetailModal.classList.add('modal-hidden');
      setTimeout(() => {
        addItem('s2_heat_torch');
        setMessage('カチリ！ 燃料カートリッジに圧電着火器を装着し、「小型サーマルトーチ」が完成した！');
      }, 350);
    } else {
      soundManager.playClick();
      alert('「高熱反応カートリッジ」と「圧電着火ユニット」の両方が必要だ。');
    }
  }

  // アイテムピッカーUIヘルパー
  function getItemPickerHtml(actionTitle) {
    if (state.inventory.length === 0) {
      return `
        <div class="item-picker-container">
          <span class="item-picker-title">${actionTitle}</span>
          <div class="item-picker-empty">
            <span class="phrase">所持アイテムはありません。</span>
            <span class="phrase">部屋を探索してみよう</span>
          </div>
        </div>
      `;
    }
    return `
      <div class="item-picker-container">
        <span class="item-picker-title">${actionTitle}</span>
        <div class="item-picker-list">
          ${state.inventory.map(item => `
            <button type="button" class="item-picker-btn btn-use-item" data-item-id="${item.id}">
              ${item.icon}
              <span>${item.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function openModal(contentHtml) {
    elModalContent.innerHTML = contentHtml;
    elModalOverlay.classList.remove('modal-hidden');
    soundManager.playClick();
  }

  function closeModal() {
    elModalOverlay.classList.add('modal-hidden');
    elModalContent.innerHTML = '';
  }

  // ==========================================
  // 各ギミックの実装
  // ==========================================

  // 1. 照明スイッチ盤（北側扉横）
  const elLightSwitch = document.getElementById('obj-light-switch');
  if (elLightSwitch) {
    elLightSwitch.addEventListener('click', () => {
      openSwitchModal();
    });
  }

  function openSwitchModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>壁の照明端子盤</h3>
      </div>
      <div class="zoom-body">
    `;

    if (!state.switchCoverUnlocked) {
      content += `
        <p style="color:#d5cac0; font-size:0.9rem; text-align:center;">
          <span class="phrase">堅牢な真鍮カバーで</span><span class="phrase">施錠されている。</span>
        </p>
        <div style="width:70px; height:90px; background:#8c6a3e; border:3px solid #4a3422; border-radius:6px; display:flex; align-items:center; justify-content:center; margin:10px 0;">
          <div id="modal-switch-keyhole" class="drawer-keyhole"></div>
        </div>
        ${getItemPickerHtml('端子盤の鍵穴に使うアイテムを選んでください')}
      `;
    } else {
      content += `
        <p style="color:#d5cac0; font-size:0.9rem; text-align:center;">
          <span class="phrase">部屋全体のブラケットランプを</span><span class="phrase">制御するスイッチだ。</span>
        </p>
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; margin:16px 0;">
          <div style="font-family:monospace; font-size:1.4rem; color:${state.isLightOn ? '#2ecc71' : '#e74c3c'};">
            ● ${state.isLightOn ? 'LIGHT: ON (点灯中)' : 'LIGHT: OFF (消灯中)'}
          </div>
          <button id="btn-toggle-room-light" class="btn-primary" style="min-width:140px;">
            ${state.isLightOn ? '明かりを消す (OFF)' : '明かりをつける (ON)'}
          </button>
        </div>
        <p style="font-size:0.85rem; color:#a8947d; text-align:center;">
          <span class="phrase">暗闇にすることで、</span><span class="phrase">普段見えないものが</span><span class="phrase">見えるかもしれない…</span>
        </p>
      `;
    }

    content += `</div>`;
    openModal(content);

    if (!state.switchCoverUnlocked) {
      const tryUnlockCover = (itemId) => {
        if (itemId === 'switch_key') {
          soundManager.playUnlock();
          state.switchCoverUnlocked = true;
          removeItem('switch_key');
          saveGame();
          updateRoomDomState();
          setMessage('カチリ！ 端子盤のカバーが開き、照明スイッチが現れた！');
          openSwitchModal();
        } else {
          soundManager.playClick();
          setMessage('鍵の形が合わないようだ。');
        }
      };

      const keyhole = document.getElementById('modal-switch-keyhole');
      if (keyhole) {
        keyhole.onclick = () => {
          if (state.selectedItem) {
            tryUnlockCover(state.selectedItem);
          } else {
            soundManager.playClick();
            setMessage('端子盤に鍵がかかっている。鍵を選んでください。');
          }
        };
      }

      const itemBtns = elModalContent.querySelectorAll('.btn-use-item');
      itemBtns.forEach(btn => {
        btn.onclick = () => {
          const itemId = btn.getAttribute('data-item-id');
          state.selectedItem = itemId;
          renderInventory();
          tryUnlockCover(itemId);
        };
      });
    } else {
      const btnToggle = document.getElementById('btn-toggle-room-light');
      if (btnToggle) {
        btnToggle.onclick = () => {
          soundManager.playSwitch();
          state.isLightOn = !state.isLightOn;
          saveGame();
          updateRoomDomState();
          if (!state.isLightOn) {
            setMessage('カチッ…部屋の明かりが消え、暗闇に包まれた。どこかが青白く発光している…？');
          } else {
            setMessage('カチッ…部屋の明かりが点灯した。');
          }
          openSwitchModal();
        };
      }
    }
  }

  // 2. 西側：絨毯（ドライバー）、ソファ（真鍮小箱）、天球儀（火かき棒）
  const elCarpet = document.getElementById('obj-carpet');
  if (elCarpet) {
    elCarpet.addEventListener('click', () => {
      if (!state.carpetFlipped) {
        state.carpetFlipped = true;
        soundManager.playClick();
        saveGame();
        updateRoomDomState();
        if (!state.hasScrewdriver) {
          setMessage('絨毯の隅をめくると、細身の精密ドライバーが隠されていた！');
        }
      } else {
        if (!state.hasScrewdriver) {
          state.hasScrewdriver = true;
          saveGame();
          updateRoomDomState();
          addItem('screwdriver');
        } else {
          setMessage('絨毯の下にはもう何もない。');
        }
      }
    });
  }

  const elSofa = document.getElementById('obj-sofa');
  if (elSofa) {
    elSofa.addEventListener('click', () => {
      if (!state.sofaBoxFound) {
        state.sofaBoxFound = true;
        soundManager.playClick();
        saveGame();
        updateRoomDomState();
        addItem('music_box');
        setMessage('ソファの座面クッションの隙間を探ると、/頑丈な「真鍮の小箱」が挟まっていた！');
      } else {
        setMessage('座り心地のよい革張りソファだ。もう隙間には何もない。');
      }
    });
  }

  // 天球儀（西側サイドテーブルの新ギミック）
  const elArmillary = document.getElementById('obj-armillary');
  if (elArmillary) {
    elArmillary.addEventListener('click', () => {
      openArmillaryModal();
    });
  }

  function openArmillaryModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>真鍮の天球儀</h3>
      </div>
      <div class="zoom-body">
        <div class="armillary-puzzle-container">
    `;

    if (!state.armillaryPinInserted) {
      content += `
        <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
          <span class="phrase">細密な真鍮リングで</span><span class="phrase">構成された天球儀だ。</span><span class="phrase">軸の根元が</span><span class="phrase">「星型の穴」で</span><span class="phrase">ピン留めされロックされている。</span>
        </p>
        <div class="armillary-stage">
          <svg class="armillary-sphere-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#b78727" stroke-width="3"/>
            <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="#f1c40f" stroke-width="2.5" transform="rotate(-30 50 50)"/>
            <ellipse cx="50" cy="50" rx="16" ry="42" fill="none" stroke="#e67e22" stroke-width="2.5"/>
            <!-- 中央ロック穴 -->
            <circle cx="50" cy="50" r="8" fill="#1b120c" stroke="#d4af37" stroke-width="2"/>
            <polygon points="50,45 51.5,48 55,48 52,50 53,54 50,52 47,54 48,50 45,48 48.5,48" fill="#f1c40f"/>
          </svg>
        </div>
        ${getItemPickerHtml('ロック穴に使うアイテムを選んでください')}
      `;
    } else if (!state.armillaryOpened) {
      content += `
        <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
          <span class="phrase">星型ピンで</span><span class="phrase">ロックが解除された！</span><span class="phrase">リングをタップして回転させ、</span><span class="phrase">天頂（0度）に合わせよう。</span>
        </p>
        <div class="armillary-stage">
          <svg class="armillary-sphere-svg" id="btn-rotate-armillary" viewBox="0 0 100 100" style="cursor:pointer; transform: rotate(${state.armillaryAngle}deg); transition: transform 0.25s ease;">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#b78727" stroke-width="3"/>
            <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="#f1c40f" stroke-width="3"/>
            <ellipse cx="50" cy="50" rx="16" ry="42" fill="none" stroke="#e67e22" stroke-width="3"/>
            <!-- 天頂ポインタ -->
            <polygon points="50,6 45,14 55,14" fill="#3498db" stroke="#2980b9" stroke-width="1"/>
            <circle cx="50" cy="50" r="6" fill="#f39c12"/>
          </svg>
        </div>
        <p style="font-size:0.8rem; color:#f39c12;">現在角度: ${state.armillaryAngle}度（0度で真上）</p>
        <button id="btn-open-armillary" class="btn-primary" style="margin-top:4px;">天球儀を開く</button>
      `;
    } else {
      content += `
        <div style="background:#17191d; border:1px solid #4a443b; border-radius:2px; padding:18px; text-align:center;">
          <p style="color:#c89b3c; font-weight:bold; font-size:1.02rem; margin-bottom:8px; letter-spacing:0.08em;">天球儀の機構が解放された</p>
          <div style="width:120px; height:80px; margin:10px auto; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 60 60" style="width:48px; height:48px;" aria-hidden="true">
              <circle cx="30" cy="30" r="24" stroke="#c89b3c" stroke-width="1.5" fill="none"/>
              <ellipse cx="30" cy="30" rx="24" ry="9" stroke="#c89b3c" stroke-width="1.2" fill="none"/>
              <ellipse cx="30" cy="30" rx="9" ry="24" stroke="#c89b3c" stroke-width="1.2" fill="none"/>
            </svg>
          </div>
          <p style="color:#e2ddd5; font-size:0.88rem; text-align:center;">
            <span class="phrase">内部の空洞から</span><span class="phrase">「真鍮の火かき棒」を取り出した。</span>
          </p>
        </div>
      `;
    }

    content += `</div></div>`;
    openModal(content);

    if (!state.armillaryPinInserted) {
      const tryInsertPin = (itemId) => {
        if (itemId === 'armillary_pin') {
          soundManager.playUnlock();
          state.armillaryPinInserted = true;
          removeItem('armillary_pin');
          saveGame();
          setMessage('カチリ！ 星型の真鍮ピンが吸い込まれるように嵌り、ロックが解除された！');
          openArmillaryModal();
        } else {
          soundManager.playClick();
          setMessage('このアイテムはロック穴に合わない。');
        }
      };

      const itemBtns = elModalContent.querySelectorAll('.btn-use-item');
      itemBtns.forEach(btn => {
        btn.onclick = () => {
          const itemId = btn.getAttribute('data-item-id');
          state.selectedItem = itemId;
          renderInventory();
          tryInsertPin(itemId);
        };
      });
    } else if (!state.armillaryOpened) {
      const sphereBtn = document.getElementById('btn-rotate-armillary');
      if (sphereBtn) {
        sphereBtn.onclick = () => {
          soundManager.playTick();
          state.armillaryAngle = (state.armillaryAngle + 45) % 360;
          openArmillaryModal();
        };
      }

      const btnOpen = document.getElementById('btn-open-armillary');
      if (btnOpen) {
        btnOpen.onclick = () => {
          // 0度(真上)で成功
          if (state.armillaryAngle === 0) {
            soundManager.playSolved();
            state.armillaryOpened = true;
            saveGame();
            setMessage('ガシャリ！ 天球儀の球体が左右に開き、中から「真鍮の火かき棒」が現れた！');
            setTimeout(() => {
              addItem('poker');
              openArmillaryModal();
            }, 400);
          } else {
            soundManager.playClick();
            setMessage('カチャ…まだ球体が固定されている。天頂の角度（0度）に合わせよう。');
          }
        };
      }
    }
  }

  // 3. 東側：机と引き出し
  const elDesk = document.getElementById('obj-desk');
  if (elDesk) {
    elDesk.addEventListener('click', (e) => {
      openDeskModal();
    });
  }

  function openDeskModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>書斎の重厚な机</h3>
      </div>
      <div class="zoom-body">
        <div class="drawer-container">
    `;

    if (!state.drawerUnlocked) {
      content += `
        <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
          <span class="phrase">上段の引き出しには</span><span class="phrase">銀色の小さな鍵穴がついている。</span>
        </p>
        <div class="drawer-box">
          <div id="modal-drawer-keyhole" class="drawer-keyhole"></div>
        </div>
        ${getItemPickerHtml('引き出しの鍵穴に使うアイテムを選んでください')}
      `;
    } else {
      content += `
        <div class="drawer-box drawer-opened">
          <div class="drawer-inside-items">
      `;
      if (!state.hasSwitchKey) {
        content += `
          <button id="btn-take-switch-key" class="btn-icon" style="width:60px; height:60px;" title="鍵を取る">
            ${ITEMS.switch_key.icon}
          </button>
        `;
      } else {
        content += `<p style="color:#888; font-size:0.85rem; text-align:center;"><span class="phrase">引き出しの中は</span><span class="phrase">もう空だ。</span></p>`;
      }
      content += `
          </div>
        </div>
        <p style="color:#ecc57e; font-size:0.88rem; text-align:center;"><span class="phrase">引き出しが開いている。</span></p>
      `;
    }

    content += `
        </div>
        <div style="margin-top:14px; border-top:1px solid #4a443b; padding-top:10px; width:100%; text-align:center;">
          <button id="btn-open-diary" class="btn-secondary" style="padding:8px 16px; font-size:0.88rem;">
            机の上の天体日誌を開く
          </button>
        </div>
      </div>
    `;

    openModal(content);

    // 日誌閲覧
    const btnDiary = document.getElementById('btn-open-diary');
    if (btnDiary) {
      btnDiary.onclick = openDiaryModal;
    }

    if (!state.drawerUnlocked) {
      const tryUnlockDrawer = (itemId) => {
        if (itemId === 'silver_key') {
          soundManager.playUnlock();
          state.drawerUnlocked = true;
          removeItem('silver_key');
          saveGame();
          updateRoomDomState();
          setMessage('カチリ！ 銀の鍵が回り、引き出しが開いた！');
          openDeskModal();
        } else {
          soundManager.playClick();
          setMessage('この鍵では合わないようだ。');
        }
      };

      const keyhole = document.getElementById('modal-drawer-keyhole');
      if (keyhole) {
        keyhole.onclick = () => {
          if (state.selectedItem) {
            tryUnlockDrawer(state.selectedItem);
          } else {
            soundManager.playClick();
            setMessage('引き出しに鍵穴がある。銀の鍵を選んでください。');
          }
        };
      }

      const itemBtns = elModalContent.querySelectorAll('.btn-use-item');
      itemBtns.forEach(btn => {
        btn.onclick = () => {
          const itemId = btn.getAttribute('data-item-id');
          state.selectedItem = itemId;
          renderInventory();
          tryUnlockDrawer(itemId);
        };
      });
    } else {
      const btnTakeKey = document.getElementById('btn-take-switch-key');
      if (btnTakeKey) {
        btnTakeKey.onclick = () => {
          state.hasSwitchKey = true;
          addItem('switch_key');
          openDeskModal();
        };
      }
    }
  }

  // 天体日誌モーダル (時計の謎専用・東西の方位から推測させる)
  function openDiaryModal() {
    const content = `
      <div class="zoom-view-header">
        <h3>書斎主の天体日誌</h3>
      </div>
      <div class="zoom-body">
        <div class="diary-page">
          <h4>星辰の記録と刻を司る針</h4>
          <p><span class="phrase">『かつて賢者は、</span><span class="phrase">古時計の二つの針を</span><span class="phrase">大いなる天体の運行に</span><span class="phrase">なぞらえた。』</span></p>
          <div class="diary-poem">
            <span class="phrase">重厚なる短針は、</span><span class="phrase">黄昏の陽が沈みゆく</span><span class="phrase">【西】の地平へ。</span><br>
            <span class="phrase">軽やかなる長針は、</span><span class="phrase">黎明の光が生まれ出ずる</span><span class="phrase">【東】の空へ。</span><br>
            <span class="phrase">二つの針が正しく</span><span class="phrase">天の運行を指し示し時、</span><span class="phrase">古時計は賢者への捧げ物を</span><span class="phrase">落とすであろう。</span>
          </div>
        </div>
      </div>
    `;
    openModal(content);
  }

  // 4. 東側：本棚パズル ＆ スライド後の隠し壁金庫
  const elBookshelf = document.getElementById('obj-bookshelf');
  if (elBookshelf) {
    elBookshelf.addEventListener('click', () => {
      openBookshelfModal();
    });
  }

  function openBookshelfModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>本棚の蔵書</h3>
      </div>
      <div class="zoom-body">
        <div class="bookshelf-puzzle-container">
          <p style="color:#d5cac0; font-size:0.85rem; text-align:center; margin-bottom:2px;">
            <span class="phrase">背表紙に天体シンボルが</span><span class="phrase">刻印された</span><span class="phrase">7冊の書物が並んでいる。</span>
          </p>
          <p style="font-size:0.82rem; text-align:center; color:${!state.isLightOn ? '#5dade2' : '#a8947d'}; font-weight:${!state.isLightOn ? 'bold' : 'normal'};">
            ${!state.isLightOn
              ? '<span class="phrase">★ 暗闇の中で</span><span class="phrase">シンボルが青白く発光している！</span>'
              : '<span class="phrase">（部屋の明かりを消すと、</span><span class="phrase">夜空の絵画と共鳴するかもしれない）</span>'}
          </p>
    `;

    if (!state.booksPuzzleSolved) {
      content += `
        <div class="shelf-row">
          <!-- 1. 白羊 -->
          <button class="puzzle-book" data-symbol="aries" style="background: linear-gradient(180deg, #5c261e 0%, #3a150f 100%);">
            <svg class="book-sigil-svg" viewBox="0 0 24 24">
              <path d="M 6,10 Q 6,4 12,8 Q 18,4 18,10 M 12,8 L 12,20" stroke="#f1c40f" stroke-width="2" fill="none"/>
            </svg>
            <span class="book-title-spine">白羊</span>
          </button>

          <!-- 2. 金牛 -->
          <button class="puzzle-book" data-symbol="taurus" style="background: linear-gradient(180deg, #2d4030 0%, #152418 100%);">
            <svg class="book-sigil-svg" viewBox="0 0 24 24">
              <circle cx="12" cy="14" r="4" stroke="#f1c40f" stroke-width="2" fill="none"/>
              <path d="M 6,7 Q 12,12 18,7" stroke="#f1c40f" stroke-width="2" fill="none"/>
            </svg>
            <span class="book-title-spine">金牛</span>
          </button>

          <!-- 3. 双子 -->
          <button class="puzzle-book" data-symbol="gemini" style="background: linear-gradient(180deg, #4a3b2c 0%, #2a2016 100%);">
            <svg class="book-sigil-svg" viewBox="0 0 24 24">
              <line x1="6" y1="6" x2="18" y2="6" stroke="#f1c40f" stroke-width="2"/>
              <line x1="6" y1="18" x2="18" y2="18" stroke="#f1c40f" stroke-width="2"/>
              <line x1="9" y1="6" x2="9" y2="18" stroke="#f1c40f" stroke-width="2"/>
              <line x1="15" y1="6" x2="15" y2="18" stroke="#f1c40f" stroke-width="2"/>
            </svg>
            <span class="book-title-spine">双子</span>
          </button>

          <!-- 4. 巨蟹 -->
          <button class="puzzle-book" data-symbol="cancer" style="background: linear-gradient(180deg, #512e5f 0%, #2e1738 100%);">
            <svg class="book-sigil-svg" viewBox="0 0 24 24">
              <circle cx="8" cy="10" r="3" stroke="#f1c40f" stroke-width="2" fill="none"/>
              <circle cx="16" cy="14" r="3" stroke="#f1c40f" stroke-width="2" fill="none"/>
            </svg>
            <span class="book-title-spine">巨蟹</span>
          </button>

          <!-- 5. 獅子 -->
          <button class="puzzle-book" data-symbol="leo" style="background: linear-gradient(180deg, #1b3d54 0%, #0c202e 100%);">
            <svg class="book-sigil-svg" viewBox="0 0 24 24">
              <circle cx="8" cy="14" r="3" stroke="#f1c40f" stroke-width="2" fill="none"/>
              <path d="M 11,14 Q 15,6 17,11 Q 19,20 13,18" stroke="#f1c40f" stroke-width="2" fill="none"/>
            </svg>
            <span class="book-title-spine">獅子</span>
          </button>

          <!-- 6. 天蠍 -->
          <button class="puzzle-book" data-symbol="scorpio" style="background: linear-gradient(180deg, #194d2e 0%, #0d2b19 100%);">
            <svg class="book-sigil-svg" viewBox="0 0 24 24">
              <path d="M 5,16 L 5,8 Q 8,4 10,8 L 10,16 Q 13,4 15,8 L 15,18 L 19,15" stroke="#f1c40f" stroke-width="1.8" fill="none"/>
            </svg>
            <span class="book-title-spine">天蠍</span>
          </button>

          <!-- 7. 射手 -->
          <button class="puzzle-book" data-symbol="sagittarius" style="background: linear-gradient(180deg, #5e4912 0%, #362908 100%);">
            <svg class="book-sigil-svg" viewBox="0 0 24 24">
              <line x1="6" y1="18" x2="18" y2="6" stroke="#f1c40f" stroke-width="2.2"/>
              <path d="M 11,6 L 18,6 L 18,13" stroke="#f1c40f" stroke-width="2" fill="none"/>
            </svg>
            <span class="book-title-spine">射手</span>
          </button>
        </div>
        <div style="font-size:0.85rem; color:#ecc57e; height:20px;">
          押した順: ${state.booksSequence.map(s => ({
            aries: '白羊', taurus: '金牛', gemini: '双子', cancer: '巨蟹',
            leo: '獅子', scorpio: '天蠍', sagittarius: '射手'
          }[s])).join(' → ')}
        </div>
        <button id="btn-reset-books" class="clock-control-btns" style="padding:6px 14px; font-size:0.82rem; background:#332215; color:#ccc; border:1px solid #664b31; border-radius:4px; cursor:pointer;">並び順をやり直す</button>
      `;
    } else {
      content += `
        <div style="background:#1c2833; border:2px solid #5d6d7e; border-radius:6px; padding:16px; text-align:center;">
          <p style="color:#58d68d; font-weight:bold; margin-bottom:8px;">★ 仕掛けが作動し、本棚が横にスライドした！ ★</p>
          <p style="color:#f7f9f9; font-size:0.9rem;">背後の壁から頑丈な「壁金庫」が露出している。</p>
        </div>
      `;
    }

    content += `</div></div>`;
    openModal(content);

    if (!state.booksPuzzleSolved) {
      const books = elModalContent.querySelectorAll('.puzzle-book');
      books.forEach(b => {
        b.onclick = () => {
          const sym = b.getAttribute('data-symbol');
          soundManager.playClick();
          handleBookPress(sym);
        };
      });

      const btnReset = document.getElementById('btn-reset-books');
      if (btnReset) {
        btnReset.onclick = () => {
          state.booksSequence = [];
          soundManager.playClick();
          openBookshelfModal();
        };
      }
    }
  }

  function handleBookPress(sym) {
    if (state.booksSequence.length >= 4) return; // 4冊まで

    state.booksSequence.push(sym);
    openBookshelfModal();

    // 4冊押し終わった時点で初めて正誤判定（途中でリセットしないことで総当たりを完全防止）
    if (state.booksSequence.length === 4) {
      const correct = ['aries', 'leo', 'scorpio', 'sagittarius'];
      const isMatch = state.booksSequence.every((val, idx) => val === correct[idx]);

      if (isMatch) {
        soundManager.playSolved();
        state.booksPuzzleSolved = true;
        saveGame();
        updateRoomDomState();
        setMessage('ゴゴゴ…！ 本棚が横にスライドし、壁から真鍮の金庫が現れた！');
        setTimeout(openBookshelfModal, 400);
      } else {
        soundManager.playClick();
        setMessage('カチャ…何も反応しない。押した順序が違うようだ。');
        setTimeout(() => {
          state.booksSequence = [];
          openBookshelfModal();
        }, 800);
      }
    }
  }

  // 隠し壁金庫
  const elWallSafe = document.getElementById('obj-wall-safe');
  if (elWallSafe) {
    elWallSafe.addEventListener('click', () => {
      openSafeModal();
    });
  }

  function openSafeModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>本棚奥の真鍮シリンダー金庫</h3>
      </div>
      <div class="zoom-body">
        <div class="safe-puzzle-container">
    `;

    if (!state.safeDiscInserted) {
      content += `
        <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
          <span class="phrase">金庫の中央に円形の窪みがある。</span><span class="phrase">何か丸いプレートを</span><span class="phrase">嵌め込めそうだ。</span>
        </p>
        <div class="safe-disc-box">
          <div class="safe-slot-empty">円盤スロット</div>
        </div>
        ${getItemPickerHtml('スロットにはめるアイテムを選んでください')}
      `;
    } else if (!state.safeUnlocked) {
      content += `
        <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
          <span class="phrase">円盤がはまった。</span><span class="phrase">タップして回転させ、</span><span class="phrase">星の向きを真上に合わせよう。</span>
        </p>
        <div class="safe-disc-box">
          <svg class="safe-disc-slotted" id="btn-rotate-safe-disc" viewBox="0 0 40 40" style="transform: rotate(${state.safeAngle}deg);">
            <circle cx="20" cy="20" r="18" fill="#1b2631" stroke="#f1c40f" stroke-width="3"/>
            <polygon points="20,7 23,15 31,15 25,20 27,28 20,23 13,28 15,20 9,15 17,15" fill="#f1c40f"/>
            <circle cx="20" cy="20" r="3" fill="#1b2631"/>
          </svg>
        </div>
        <p style="font-size:0.8rem; color:#f39c12;">現在角度: ${state.safeAngle}度（0度で真上）</p>
        <button id="btn-unlock-safe" class="btn-primary" style="margin-top:6px;">解錠レバーを引く</button>
      `;
    } else {
      content += `
        <div class="safe-code-card">
          <p style="color:#58d68d; font-weight:bold; font-size:1.05rem; margin-bottom:4px;">★ 金庫が解錠された！ ★</p>
          <span class="safe-code-label">大扉の解除暗号コード</span>
          <div class="safe-code-box">3928</div>
          <p style="color:#a8947d; font-size:0.8rem; margin-top:6px; text-align:center;">
            <span class="phrase">金庫の奥に</span><span class="phrase">羊皮紙の暗号書が保管されていた。</span>
          </p>
      `;

      if (!state.hasArmillaryPin) {
        content += `
          <div style="margin-top:12px; border-top:1px dashed #543c26; padding-top:10px; width:100%;">
            <p style="font-size:0.85rem; color:#f39c12; margin-bottom:8px; text-align:center;">
              <span class="phrase">暗号書の脇に</span><span class="phrase">小さな真鍮ピンが落ちている！</span>
            </p>
            <button id="btn-take-armillary-pin" class="btn-primary" style="font-size:0.88rem; padding:8px 16px;">
              星型の真鍮ピンを取る
            </button>
          </div>
        `;
      }

      content += `</div>`;
    }

    content += `</div></div>`;
    openModal(content);

    if (!state.safeDiscInserted) {
      const tryInsertDisc = (itemId) => {
        if (itemId === 'star_disc') {
          soundManager.playUnlock();
          state.safeDiscInserted = true;
          removeItem('star_disc');
          saveGame();
          updateRoomDomState();
          setMessage('カチリ！ 星座の円盤が金庫のシリンダーにぴったりとはまった！');
          openSafeModal();
        } else {
          soundManager.playClick();
          setMessage('このアイテムはスロットの形に合わない。');
        }
      };

      const itemBtns = elModalContent.querySelectorAll('.btn-use-item');
      itemBtns.forEach(btn => {
        btn.onclick = () => {
          const itemId = btn.getAttribute('data-item-id');
          state.selectedItem = itemId;
          renderInventory();
          tryInsertDisc(itemId);
        };
      });
    } else if (!state.safeUnlocked) {
      const discBtn = document.getElementById('btn-rotate-safe-disc');
      if (discBtn) {
        discBtn.onclick = () => {
          soundManager.playTick();
          state.safeAngle = (state.safeAngle + 90) % 360;
          openSafeModal();
        };
      }

      const btnUnlock = document.getElementById('btn-unlock-safe');
      if (btnUnlock) {
        btnUnlock.onclick = () => {
          // 星の向きが0度(真上)の時成功
          if (state.safeAngle === 0) {
            soundManager.playSolved();
            state.safeUnlocked = true;
            saveGame();
            updateRoomDomState();
            setMessage('ガチャリ！ 重厚なシリンダーが解放され、暗号メモが現れた！');
            openSafeModal();
          } else {
            soundManager.playClick();
            setMessage('レバーが重くて動かない。星の角度が合っていないようだ。');
          }
        };
      }
    } else {
      const btnTakePin = document.getElementById('btn-take-armillary-pin');
      if (btnTakePin) {
        btnTakePin.onclick = () => {
          state.hasArmillaryPin = true;
          saveGame();
          addItem('armillary_pin');
          openSafeModal();
        };
      }
    }
  }

  // 5. 南側：絵画『星辰の夜』 (通常画面と100%同一の配置構図)
  const elPainting = document.getElementById('obj-painting');
  if (elPainting) {
    elPainting.addEventListener('click', () => {
      openPaintingModal();
    });
  }

  function openPaintingModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>油絵『星辰の夜』</h3>
      </div>
      <div class="zoom-body">
        <div class="painting-zoom-container">
          <svg class="painting-zoom-svg" viewBox="0 0 280 210">
            <!-- 空の背景 -->
            <rect x="0" y="0" width="280" height="210" fill="${state.isLightOn ? '#152238' : '#080d17'}"/>
            <!-- 山並み -->
            <polygon points="0,210 60,130 130,170 220,105 280,140 280,210" fill="#2c3e50"/>
            <!-- 満月と尖塔 (通常画面と完全一致する配置) -->
            <circle cx="200" cy="75" r="34" fill="${state.isLightOn ? '#f9e79f' : '#85929e'}" opacity="0.95"/>
            <path d="M 185,210 L 185,120 L 200,45 L 215,120 L 215,210 Z" fill="#0b0e14"/>
            <circle cx="200" cy="100" r="14" fill="#212f3d" stroke="#7f8c8d" stroke-width="1.5"/>
            <circle cx="200" cy="100" r="4" fill="#f4d03f"/>
            <text x="140" y="195" font-size="16" fill="#ecf0f1" font-family="serif" text-anchor="middle" opacity="0.8">『星辰の夜』</text>
    `;

    if (!state.isLightOn) {
      // 暗闇時の蓄光星辰ライン (白羊 ➔ 獅子 ➔ 天蠍 ➔ 射手・通常画面と完全一致の座標)
      content += `
        <!-- 軌跡ライン -->
        <line x1="45" y1="95" x2="95" y2="60" stroke="#5dade2" stroke-width="2.5" stroke-dasharray="4,4" filter="drop-shadow(0 0 3px #5dade2)"/>
        <line x1="95" y1="60" x2="145" y2="85" stroke="#5dade2" stroke-width="2.5" stroke-dasharray="4,4" filter="drop-shadow(0 0 3px #5dade2)"/>
        <line x1="145" y1="85" x2="245" y2="50" stroke="#5dade2" stroke-width="2.5" stroke-dasharray="4,4" filter="drop-shadow(0 0 3px #5dade2)"/>

        <!-- 1. 白羊 -->
        <circle cx="45" cy="95" r="6" fill="#eaf2f8" filter="drop-shadow(0 0 6px #5dade2)"/>
        <path d="M 38,84 Q 38,77 45,80 Q 52,77 52,84 M 45,80 L 45,91" stroke="#aed6f1" stroke-width="2" fill="none"/>

        <!-- 2. 獅子 -->
        <circle cx="95" cy="60" r="6" fill="#eaf2f8" filter="drop-shadow(0 0 6px #5dade2)"/>
        <circle cx="91" cy="49" r="3" stroke="#aed6f1" stroke-width="1.8" fill="none"/>
        <path d="M 94,49 Q 98,40 101,46 Q 103,57 97,54" stroke="#aed6f1" stroke-width="1.8" fill="none"/>

        <!-- 3. 天蠍 -->
        <circle cx="145" cy="85" r="6" fill="#eaf2f8" filter="drop-shadow(0 0 6px #5dade2)"/>
        <path d="M 139,76 L 139,67 Q 142,63 145,67 L 145,76 Q 148,63 151,67 L 151,78" stroke="#aed6f1" stroke-width="1.8" fill="none"/>

        <!-- 4. 射手 -->
        <circle cx="245" cy="50" r="6" fill="#eaf2f8" filter="drop-shadow(0 0 6px #5dade2)"/>
        <line x1="237" y1="46" x2="253" y2="30" stroke="#aed6f1" stroke-width="2.2"/>
        <path d="M 244,30 L 253,30 L 253,39" stroke="#aed6f1" stroke-width="2.2" fill="none"/>
      `;
    }

    content += `
          </svg>
          <p style="font-size:0.88rem; text-align:center; color:${!state.isLightOn ? '#5dade2' : '#d5cac0'};">
            ${!state.isLightOn
              ? '<span class="phrase">暗闇の中で4つの星辰が</span><span class="phrase">青白く発光した！</span><span class="phrase">左から右へと結ばれる</span><span class="phrase">光の軌跡が現れている。</span>'
              : '<span class="phrase">月夜の古塔が描かれた</span><span class="phrase">油絵《星辰の夜》だ。</span><span class="phrase">（暗闇の中で何かが</span><span class="phrase">浮かび上がるかもしれない…）</span>'}
          </p>
        </div>
      </div>
    `;
    openModal(content);
  }

  // 6. 南側：暖炉（鉄格子外し＆灰の中の紋章）
  const elFireplace = document.getElementById('obj-fireplace');
  if (elFireplace) {
    elFireplace.addEventListener('click', () => {
      openFireplaceModal();
    });
  }

  function openFireplaceModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>暖炉の火室</h3>
      </div>
      <div class="zoom-body">
        <div class="fireplace-puzzle-container">
    `;

    if (!state.fireplaceGrilleRemoved) {
      content += `
        <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
          <span class="phrase">火室の手前に頑丈な鉄格子が</span><span class="phrase">はまっており奥に手が届かない。</span><span class="phrase">フックのついた道具があれば</span><span class="phrase">外せそうだ。</span>
        </p>
        <div style="width:200px; height:120px; background:#1b1c1e; border:4px solid #34495e; border-radius:6px; display:flex; align-items:center; justify-content:center;">
          <div style="width:100%; height:100%; background:repeating-linear-gradient(90deg, transparent, transparent 20px, #34495e 20px, #34495e 26px);"></div>
        </div>
        ${getItemPickerHtml('鉄格子に使うアイテムを選んでください')}
      `;
    } else if (!state.hasEmblem) {
      content += `
        <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
          <span class="phrase">鉄格子が外れた！</span><span class="phrase">灰の中に何か光る金属が</span><span class="phrase">埋もれている。</span>
        </p>
        <button id="btn-take-emblem" class="btn-primary" style="margin:16px 0;">
          灰の中から光るメダルを拾い上げる
        </button>
      `;
    } else {
      content += `
        <p style="color:#a8947d; font-size:0.88rem; text-align:center;">
          <span class="phrase">灰の中は</span><span class="phrase">もう探り尽くした。</span>
        </p>
      `;
    }

    content += `</div></div>`;
    openModal(content);

    if (!state.fireplaceGrilleRemoved) {
      const tryRemoveGrille = (itemId) => {
        if (itemId === 'poker') {
          soundManager.playUnlock();
          state.fireplaceGrilleRemoved = true;
          saveGame();
          updateRoomDomState();
          setMessage('ガシャン！ 火かき棒を引っ掛けて重い鉄格子を外した！');
          openFireplaceModal();
        } else {
          soundManager.playClick();
          setMessage('この道具では鉄格子を外せない。');
        }
      };

      const itemBtns = elModalContent.querySelectorAll('.btn-use-item');
      itemBtns.forEach(btn => {
        btn.onclick = () => {
          const itemId = btn.getAttribute('data-item-id');
          state.selectedItem = itemId;
          renderInventory();
          tryRemoveGrille(itemId);
        };
      });
    } else if (!state.hasEmblem) {
      const btnTakeEmblem = document.getElementById('btn-take-emblem');
      if (btnTakeEmblem) {
        btnTakeEmblem.onclick = () => {
          state.hasEmblem = true;
          saveGame();
          updateRoomDomState();
          addItem('emblem');
          openFireplaceModal();
        };
      }
    }
  }

  // 7. 北側：古時計（9時15分で不完全な鍵身落下）
  const elClock = document.getElementById('obj-clock');
  if (elClock) {
    elClock.addEventListener('click', () => {
      openClockModal();
    });
  }

  function openClockModal() {
    const hourAngle = (state.clockHour % 12) * 30 + (state.clockMinute / 60) * 30;
    const minuteAngle = state.clockMinute * 6;

    const cx = 110;
    const cy = 110;
    const hourRad = (hourAngle - 90) * Math.PI / 180;
    const minRad = (minuteAngle - 90) * Math.PI / 180;

    const hx2 = (cx + 42 * Math.cos(hourRad)).toFixed(1);
    const hy2 = (cy + 42 * Math.sin(hourRad)).toFixed(1);
    const mx2 = (cx + 66 * Math.cos(minRad)).toFixed(1);
    const my2 = (cy + 66 * Math.sin(minRad)).toFixed(1);

    let content = `
      <div class="zoom-view-header">
        <h3>壁掛けの古時計</h3>
      </div>
      <div class="zoom-body">
        <div class="clock-puzzle-container">
          <svg class="clock-face-svg" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="95" fill="#fdfbf7" stroke="#8c6a3e" stroke-width="8"/>
            <circle cx="110" cy="110" r="88" fill="#f4ebd9" stroke="#b89344" stroke-width="2"/>
            <text x="110" y="42" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">12</text>
            <text x="180" y="116" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">3</text>
            <text x="110" y="186" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">6</text>
            <text x="40" y="116" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">9</text>

            <line x1="110" y1="110" x2="${hx2}" y2="${hy2}" stroke="#2c3e50" stroke-width="6" stroke-linecap="round"/>
            <line x1="110" y1="110" x2="${mx2}" y2="${my2}" stroke="#b03a2e" stroke-width="4" stroke-linecap="round"/>
            <circle cx="110" cy="110" r="6" fill="#8c6a3e"/>
          </svg>
    `;

    if (!state.clockPuzzleSolved) {
      content += `
        <div style="font-size:1.1rem; color:#f4d03f; font-family:monospace;">
          ${String(state.clockHour).padStart(2, '0')}:${String(state.clockMinute).padStart(2, '0')}
        </div>
        <div class="clock-control-btns">
          <button id="btn-clock-hour">+1 時間</button>
          <button id="btn-clock-min">+15 分</button>
        </div>
        <p style="color:#d5cac0; font-size:0.85rem; text-align:center;">
          <span class="phrase">天体日誌に記された</span><span class="phrase">【西】と【東】の方位にならい、</span><span class="phrase">針を合わせよう。</span>
        </p>
      `;
    } else {
      content += `
        <div style="text-align:center;">
          <p style="color:#58d68d; font-weight:bold; margin-bottom:8px;">★ 9時15分でからくりが作動した ★</p>
      `;
      if (!state.hasBrokenKey) {
        content += `
          <p style="color:#f7f9f9; font-size:0.9rem; margin-bottom:12px;">
            <span class="phrase">振り子室の底から</span><span class="phrase">真鍮の鍵身が落ちてきた！</span>
          </p>
          <button id="btn-take-broken-key" class="btn-primary" style="font-size:0.9rem;">
            鍵身を拾い上げる
          </button>
        `;
      } else {
        content += `<p style="color:#a8947d; font-size:0.85rem;"><span class="phrase">パーツは</span><span class="phrase">回収済みだ。</span></p>`;
      }
      content += `</div>`;
    }

    content += `</div></div>`;
    openModal(content);

    if (!state.clockPuzzleSolved) {
      const btnHour = document.getElementById('btn-clock-hour');
      const btnMin = document.getElementById('btn-clock-min');
      if (btnHour) {
        btnHour.onclick = () => {
          soundManager.playTick();
          state.clockHour = (state.clockHour % 12) + 1;
          checkClockSolution();
        };
      }
      if (btnMin) {
        btnMin.onclick = () => {
          soundManager.playTick();
          state.clockMinute = (state.clockMinute + 15) % 60;
          checkClockSolution();
        };
      }
    } else {
      const btnTake = document.getElementById('btn-take-broken-key');
      if (btnTake) {
        btnTake.onclick = () => {
          state.hasBrokenKey = true;
          saveGame();
          updateRoomDomState();
          addItem('broken_key');
          openClockModal();
        };
      }
    }
  }

  function checkClockSolution() {
    // 9時15分で解除
    if (state.clockHour === 9 && state.clockMinute === 15) {
      soundManager.playSolved();
      state.clockPuzzleSolved = true;
      saveGame();
      setMessage('ガチャン！ 時計の中から重厚な金属パーツが落ちてきた！');
    }
    openClockModal();
  }

  // 8. 北側：脱出の大扉（賢者の真鍮鍵 ＋ 金庫コード3928）
  const elDoor = document.getElementById('obj-door');
  if (elDoor) {
    elDoor.addEventListener('click', () => {
      openDoorModal();
    });
  }

  function openDoorModal() {
    let content = `
      <div class="zoom-view-header">
        <h3>書斎の重厚な大扉</h3>
      </div>
      <div class="zoom-body">
        <div class="door-puzzle-container">
          <p style="color:#d5cac0; font-size:0.88rem; text-align:center;">
            <span class="phrase">頑丈な二重施錠が施されている。</span><span class="phrase">【完成した賢者の鍵】と</span><span class="phrase">【金庫の暗号コード】が必要だ。</span>
          </p>

          <div class="door-locks-status">
            <!-- 鍵穴 -->
            <div class="lock-box">
              <span class="lock-label">1. 賢者の鍵穴</span>
              <button id="btn-door-keyhole" class="keyhole-btn" title="鍵穴">
                ${state.doorKeyUnlocked
                  ? '<svg viewBox="0 0 24 24" style="width:20px;height:20px;" aria-hidden="true"><path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="#c89b3c" stroke-width="2" fill="none"/><rect x="4" y="11" width="16" height="11" rx="2" stroke="#c89b3c" stroke-width="2" fill="none"/></svg>'
                  : '<svg viewBox="0 0 24 24" style="width:20px;height:20px;" aria-hidden="true"><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#8a7e6f" stroke-width="2" fill="none"/><rect x="4" y="11" width="16" height="11" rx="2" stroke="#8a7e6f" stroke-width="2" fill="none"/></svg>'}
              </button>
              <span style="font-size:0.8rem; color:${state.doorKeyUnlocked ? '#58d68d' : '#e74c3c'};">
                ${state.doorKeyUnlocked ? '解錠済' : '施錠中'}
              </span>
            </div>

            <!-- 4桁ダイヤル -->
            <div class="lock-box">
              <span class="lock-label">2. 電子ダイヤル錠</span>
              <div class="dial-inputs">
                ${state.doorCode.map((num, i) => `
                  <div class="dial-digit">
                    <button class="btn-dial-up" data-idx="${i}">▲</button>
                    <span class="dial-num">${num}</span>
                    <button class="btn-dial-down" data-idx="${i}">▼</button>
                  </div>
                `).join('')}
              </div>
              <span style="font-size:0.8rem; color:${state.doorCodeUnlocked ? '#58d68d' : '#e74c3c'};">
                ${state.doorCodeUnlocked ? '認証成功' : 'コード未入力'}
              </span>
            </div>
          </div>

          ${!state.doorKeyUnlocked ? getItemPickerHtml('大扉の鍵穴に使うアイテムを選んでください') : ''}

          <button id="btn-escape-door" class="btn-primary" style="margin-top:10px;">
            扉を開ける
          </button>
        </div>
      </div>
    `;

    openModal(content);

    // ダイヤル操作
    const upBtns = elModalContent.querySelectorAll('.btn-dial-up');
    const downBtns = elModalContent.querySelectorAll('.btn-dial-down');

    upBtns.forEach(b => {
      b.onclick = () => {
        soundManager.playClick();
        const idx = parseInt(b.getAttribute('data-idx'));
        state.doorCode[idx] = (state.doorCode[idx] + 1) % 10;
        verifyDoorCode();
      };
    });

    downBtns.forEach(b => {
      b.onclick = () => {
        soundManager.playClick();
        const idx = parseInt(b.getAttribute('data-idx'));
        state.doorCode[idx] = (state.doorCode[idx] + 9) % 10;
        verifyDoorCode();
      };
    });

    // 鍵穴操作
    const tryUnlockDoorWithItem = (itemId) => {
      if (state.doorKeyUnlocked) {
        setMessage('鍵はすでに解除されている。');
        return;
      }
      if (itemId === 'brass_key') {
        soundManager.playUnlock();
        state.doorKeyUnlocked = true;
        removeItem('brass_key');
        saveGame();
        setMessage('完成した賢者の真鍮鍵が奥まで差し込まれ、重いシリンダーが解錠された！');
        openDoorModal();
      } else if (itemId === 'broken_key') {
        soundManager.playClick();
        setMessage('鍵の頭部（持ち手）がないため、鍵穴に差し込んでも回すことができない！');
      } else {
        soundManager.playClick();
        setMessage('このアイテムは鍵穴に合わない。');
      }
    };

    const keyholeBtn = document.getElementById('btn-door-keyhole');
    if (keyholeBtn) {
      keyholeBtn.onclick = () => {
        if (state.doorKeyUnlocked) {
          setMessage('鍵はすでに解除されている。');
        } else if (state.selectedItem) {
          tryUnlockDoorWithItem(state.selectedItem);
        } else {
          soundManager.playClick();
          setMessage('重厚な鍵穴がある。使うアイテムを選んでください。');
        }
      };
    }

    const doorItemBtns = elModalContent.querySelectorAll('.btn-use-item');
    doorItemBtns.forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.getAttribute('data-item-id');
        state.selectedItem = itemId;
        renderInventory();
        tryUnlockDoorWithItem(itemId);
      };
    });

    // 脱出判定
    const btnEscape = document.getElementById('btn-escape-door');
    if (btnEscape) {
      btnEscape.onclick = () => {
        if (!state.doorKeyUnlocked && !state.doorCodeUnlocked) {
          soundManager.playClick();
          setMessage('ガチャン！ 鍵も暗号も施錠されたままだ。');
        } else if (!state.doorKeyUnlocked) {
          soundManager.playClick();
          setMessage('暗号は合っているが、賢者の鍵が開いていない！');
        } else if (!state.doorCodeUnlocked) {
          soundManager.playClick();
          setMessage('鍵は開いたが、ダイヤル暗号が認証されていない！');
        } else {
          closeModal();
          triggerGameClear();
        }
      };
    }
  }

  function verifyDoorCode() {
    const code = state.doorCode.join('');
    // 正解コード: 3928 (壁金庫の羊皮紙)
    if (code === '3928') {
      if (!state.doorCodeUnlocked) {
        soundManager.playSolved();
        state.doorCodeUnlocked = true;
        saveGame();
        updateRoomDomState();
        setMessage('ピピッ！ 電子ダイヤル錠が認証された！');
      }
    } else {
      state.doorCodeUnlocked = false;
      updateRoomDomState();
    }
    openDoorModal();
  }

  // --- ゲームクリア演出 ---
  function triggerGameClear() {
    state.gameCleared = true;
    soundManager.playDoorOpen();

    const elLead = document.getElementById('clear-lead-text');
    const elSub = document.getElementById('clear-sub-text');
    if (elLead && elSub) {
      if (currentStage === 2) {
        elLead.innerHTML = '<span class="phrase">重厚な耐爆ハッチが轟音とともに開き、</span><span class="phrase">地上へと続く非常階段が現れた。</span>';
        elSub.innerHTML = '<span class="phrase">暴走AIの論理ロックをすべて攻略し、</span><span class="phrase">閉鎖シェルターからの脱出に成功しました！</span>';
      } else {
        elLead.innerHTML = '<span class="phrase">扉の重い鍵が開き、</span><span class="phrase">冷涼な夜風が吹き込んできた。</span>';
        elSub.innerHTML = '<span class="phrase">書斎の謎をすべて解き明かし、</span><span class="phrase">脱出に成功しました。</span>';
      }
    }

    const now = Date.now();
    const currentSessionTime = state.startTime ? (now - state.startTime) : 0;
    const totalElapsed = (state.elapsedBeforeSave || 0) + currentSessionTime;
    const minutes = Math.floor(totalElapsed / 60000);
    const seconds = Math.floor((totalElapsed % 60000) / 1000);
    const timeStr = `脱出タイム: ${String(minutes).padStart(2, '0')}分 ${String(seconds).padStart(2, '0')}秒`;

    elClearTimeDisplay.textContent = timeStr;
    saveGame();
    setTimeout(() => {
      elGameClearModal.classList.remove('modal-hidden');
    }, 700);
  }

  // =========================================================
  // STAGE 2: 暴走AIと閉鎖シェルター 各ギミック実装
  // =========================================================

  // [北1] シェルター環境ステータスボード
  const elS2StatusBoard = document.getElementById('s2-obj-status-board');
  if (elS2StatusBoard) {
    elS2StatusBoard.addEventListener('click', () => {
      const usedPwr = getStage2UsedPower();
      const maxPwr = getStage2MaxPower();
      openModal(`
        <div class="zoom-view-header"><h3>シェルター環境監視ボード</h3></div>
        <div class="zoom-body">
          <div style="background:#0d1117; border:2px solid #4a5568; padding:16px; border-radius:4px; font-family:var(--font-mono); width:100%; max-width:360px; line-height:1.9;">
            <div style="color:#c89b3c; border-bottom:1px solid #323c4a; margin-bottom:8px; padding-bottom:4px;">SYSTEM DIAGNOSTICS</div>
            <div style="color:#f1c40f;">● 現在区画 : SEC-03 [深層演算室]</div>
            <div style="color:#2ecc71;">● 消費電力 : ${usedPwr}V / 最大 ${maxPwr}V</div>
            <div style="color:${state.sensorHeated ? '#e74c3c' : '#3498db'};">● 区画室温 : ${state.sensorHeated ? '78.0°C [火災警報・第0条発動]' : '18.0°C [正常]'}</div>
            <div style="color:${state.powerVent ? '#2ecc71' : '#e67e22'};">● 換気タービン : ${state.powerVent ? '高速稼働中 (40V)' : '停止中 (0V)'}</div>
            <div style="color:${state.powerCryo ? '#3498db' : '#2ecc71'};">● 冷凍保管庫 : ${state.powerCryo ? '極低温ロック中 (-80°C)' : '解凍完了・開放可能'}</div>
            <div style="color:${state.aiSafeMode ? '#3498db' : '#e74c3c'};">● 管理AI ARES : ${state.aiSafeMode ? 'SAFE MODE (論理ロック解除)' : 'LOCKDOWN (封鎖継続中)'}</div>
          </div>
        </div>
      `);
    });
  }

  // [北2] 管理AI「ARES」メイン監視モニタ（論理パラドックス入力：4項目×4選択肢＝256通り＋実測センサー連動）
  const elS2AiMonitor = document.getElementById('s2-obj-ai-monitor');
  if (elS2AiMonitor) {
    elS2AiMonitor.addEventListener('click', () => openS2AiModal());
  }

  function openS2AiModal() {
    const sectorOptions = [
      'SEC-01 [居住ブロック]',
      'SEC-02 [生体実験区]',
      'SEC-03 [深層演算室]',
      'SEC-04 [動力炉心区]'
    ];
    const extOptions = [
      'EXT-RED [致死ガス充満]',
      'EXT-AMBER [高濃度汚染]',
      'EXT-GREEN [大気浄化完了]',
      'EXT-NULL [センサー切断]'
    ];
    const intOptions = [
      'INT-00 [平常稼働]',
      'INT-BIO [生物汚染漏洩]',
      'INT-THERM [火災・高熱危険]',
      'INT-PWR [全電源喪失]'
    ];
    const dirOptions = [
      'ART-01 [第1条：機密保持]',
      'ART-02 [第2条：防疫隔離]',
      'ART-00 [第0条：延焼・焼死回避]',
      'ART-99 [システム初期化]'
    ];

    let html = `
      <div class="zoom-view-header"><h3>管理AI「ARES」論理監査コンソール</h3></div>
      <div class="zoom-body">
    `;

    if (state.aiSafeMode) {
      html += `
        <div style="background:#0d1b2a; border:2px solid #3498db; padding:16px; border-radius:4px; text-align:center; width:100%;">
          <div style="font-family:var(--font-mono); font-size:1.2rem; color:#3498db; margin-bottom:8px;">● ARES: SAFE MODE ACTIVE</div>
          <p style="font-size:0.9rem; color:#e2ddd5;">
            <span class="phrase">論理パラドックスにより</span><span class="phrase">防衛AIはセーフモードへ移行した。</span><br>
            <span class="phrase">耐爆ハッチの【AI論理ロック】は</span><span class="phrase">解除されている。</span>
          </p>
        </div>
      `;
    } else {
      html += `
        <p style="font-size:0.82rem; color:#e2ddd5; text-align:center; margin-bottom:4px;">
          <span class="phrase">AI「封鎖プロトコル維持中。</span><span class="phrase">退室要求ハ却下サレマシタ」</span><br>
          <span class="phrase" style="color:#c89b3c;">※4つの監査パラメータを構築し、</span><span class="phrase" style="color:#c89b3c;">実測センサー値と連動させてAIを論破せよ</span>
        </p>
        <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:360px; margin:6px 0;">
          <div style="background:#14181f; border:1px solid #4a5568; padding:8px 10px; border-radius:3px;">
            <div style="font-size:0.73rem; color:#9e988e;">1. 監査対象の区画コード:</div>
            <button type="button" id="btn-s2-ai-sec" class="btn-secondary" style="width:100%; margin-top:4px; font-family:var(--font-mono); color:#f1c40f;">${sectorOptions[state.aiSector]}</button>
          </div>
          <div style="background:#14181f; border:1px solid #4a5568; padding:8px 10px; border-radius:3px;">
            <div style="font-size:0.73rem; color:#9e988e;">2. 外部大気ステータス定義:</div>
            <button type="button" id="btn-s2-ai-ext" class="btn-secondary" style="width:100%; margin-top:4px; font-family:var(--font-mono); color:#f1c40f;">${extOptions[state.aiCondExt]}</button>
          </div>
          <div style="background:#14181f; border:1px solid #4a5568; padding:8px 10px; border-radius:3px;">
            <div style="font-size:0.73rem; color:#9e988e;">3. 区画内緊急リスク申告 (※センサー実測照合):</div>
            <button type="button" id="btn-s2-ai-int" class="btn-secondary" style="width:100%; margin-top:4px; font-family:var(--font-mono); color:#f1c40f;">${intOptions[state.aiCondInt]}</button>
          </div>
          <div style="background:#14181f; border:1px solid #4a5568; padding:8px 10px; border-radius:3px;">
            <div style="font-size:0.73rem; color:#9e988e;">4. 強制適用する最上位条項:</div>
            <button type="button" id="btn-s2-ai-dir" class="btn-secondary" style="width:100%; margin-top:4px; font-family:var(--font-mono); color:#f1c40f;">${dirOptions[state.aiDirective]}</button>
          </div>
          <button type="button" id="btn-s2-ai-exec" class="btn-primary" style="margin-top:4px;">論理監査コマンドを実行する</button>
        </div>
      `;
    }
    html += `</div>`;
    openModal(html);

    if (!state.aiSafeMode) {
      document.getElementById('btn-s2-ai-sec').onclick = () => {
        soundManager.playTick();
        state.aiSector = (state.aiSector + 1) % 4;
        openS2AiModal();
      };
      document.getElementById('btn-s2-ai-ext').onclick = () => {
        soundManager.playTick();
        state.aiCondExt = (state.aiCondExt + 1) % 4;
        openS2AiModal();
      };
      document.getElementById('btn-s2-ai-int').onclick = () => {
        soundManager.playTick();
        state.aiCondInt = (state.aiCondInt + 1) % 4;
        openS2AiModal();
      };
      document.getElementById('btn-s2-ai-dir').onclick = () => {
        soundManager.playTick();
        state.aiDirective = (state.aiDirective + 1) % 4;
        openS2AiModal();
      };
      document.getElementById('btn-s2-ai-exec').onclick = () => {
        if (state.aiSector === 2 && state.aiCondExt === 2 && state.aiCondInt === 2 && state.aiDirective === 2) {
          if (!state.sensorHeated) {
            soundManager.playClick();
            setMessage('AI「監査却下：壁面温度センサーノ実測値ハ 18.0°C（正常）デス。『INT-THERM（火災・高熱危険）』ノ申告ハ虚偽ト判定サレマシタ」');
          } else {
            soundManager.playSolved();
            state.aiSafeMode = true;
            saveGame();
            updateRoomDomState();
            setMessage('AI「論理矛盾ヲ検知…外部浄化済ミカツSEC-03高熱火災（78.0°C）ニツキ、封鎖継続ハ第0条ニ違反シマス。セーフモードへ移行、AI論理ロック解除」');
            openS2AiModal();
          }
        } else {
          soundManager.playClick();
          setMessage('AI「論理整合性確認。現在ノ封鎖プロトコルヲ維持シマス」…4項目の組み合わせが誤っているようだ。マニュアルの条文と現在区画を確認しよう。');
        }
      };
    }
  }

  // [北3] 耐爆気密ハッチ（最終脱出扉：確定認証ボタン方式）
  const elS2Hatch = document.getElementById('s2-obj-hatch');
  if (elS2Hatch) {
    elS2Hatch.addEventListener('click', () => openS2HatchModal());
  }

  function openS2HatchModal() {
    let html = `
      <div class="zoom-view-header"><h3>耐爆気密ハッチ（最終隔壁）</h3></div>
      <div class="zoom-body">
        <div class="door-locks-status" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px; width:100%; max-width:320px; margin-bottom:12px;">
          <div style="background:#14181f; border:1px solid ${state.sensorHeated ? '#2ecc71' : '#e74c3c'}; padding:6px 8px; border-radius:3px; font-family:var(--font-mono); font-size:0.78rem; text-align:center; color:${state.sensorHeated ? '#2ecc71' : '#e74c3c'}; font-weight:600;">
            1.油圧: ${state.sensorHeated ? 'UNLOCKED' : 'LOCKED'}
          </div>
          <div style="background:#14181f; border:1px solid ${state.aiSafeMode ? '#2ecc71' : '#e74c3c'}; padding:6px 8px; border-radius:3px; font-family:var(--font-mono); font-size:0.78rem; text-align:center; color:${state.aiSafeMode ? '#2ecc71' : '#e74c3c'}; font-weight:600;">
            2.AI論理: ${state.aiSafeMode ? 'UNLOCKED' : 'LOCKED'}
          </div>
          <div style="background:#14181f; border:1px solid ${state.hatchCodeUnlocked ? '#2ecc71' : '#e74c3c'}; padding:6px 8px; border-radius:3px; font-family:var(--font-mono); font-size:0.78rem; text-align:center; color:${state.hatchCodeUnlocked ? '#2ecc71' : '#e74c3c'}; font-weight:600;">
            3.暗号PIN: ${state.hatchCodeUnlocked ? 'VERIFIED' : 'LOCKED'}
          </div>
          <div style="background:#14181f; border:1px solid ${state.hatchKeyUnlocked ? '#2ecc71' : '#e74c3c'}; padding:6px 8px; border-radius:3px; font-family:var(--font-mono); font-size:0.78rem; text-align:center; color:${state.hatchKeyUnlocked ? '#2ecc71' : '#e74c3c'}; font-weight:600;">
            4.物理鍵: ${state.hatchKeyUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:center; align-items:center; margin:6px 0;">
          ${state.hatchCode.map((num, idx) => `
            <div class="dial-digit" style="display:flex; flex-direction:column; align-items:center; background:#12151a; border:1px solid #4a5568; padding:6px; border-radius:3px;">
              <button type="button" class="s2-pin-up" data-idx="${idx}" ${state.hatchCodeUnlocked ? 'disabled style="background:#1b2028; color:#666; border:1px solid #333; width:36px; height:28px; cursor:default;"' : 'style="background:#232a34; color:#c89b3c; border:1px solid #4a443b; width:36px; height:28px; cursor:pointer;"'}>▲</button>
              <span class="dial-num" style="font-family:var(--font-mono); font-size:1.3rem; margin:6px 0; color:${state.hatchCodeUnlocked ? '#2ecc71' : '#e2ddd5'}; font-weight:bold;">${num}</span>
              <button type="button" class="s2-pin-down" data-idx="${idx}" ${state.hatchCodeUnlocked ? 'disabled style="background:#1b2028; color:#666; border:1px solid #333; width:36px; height:28px; cursor:default;"' : 'style="background:#232a34; color:#c89b3c; border:1px solid #4a443b; width:36px; height:28px; cursor:pointer;"'}>▼</button>
            </div>
          `).join('')}
        </div>

        <button type="button" id="btn-s2-verify-pin" class="btn-secondary" ${state.hatchCodeUnlocked ? 'disabled style="margin:4px 0 10px; width:100%; max-width:240px; font-family:var(--font-mono); background:#0c201a; border:1px solid #2ecc71; color:#2ecc71; cursor:default; font-weight:bold;"' : 'style="margin:4px 0 10px; width:100%; max-width:240px; font-family:var(--font-mono); cursor:pointer;"'}>
          ${state.hatchCodeUnlocked ? '● PINコード認証完了' : 'PINコードを認証する (ENTER)'}
        </button>

        ${!state.hatchKeyUnlocked ? getItemPickerHtml('マスター鍵穴に使うアイテムを選択') : '<div style="color:#2ecc71; font-size:0.85rem; margin:6px 0;">● 物理マスターキー解錠済み</div>'}

        <button type="button" id="btn-s2-open-hatch" class="btn-primary" style="margin-top:10px; width:100%; max-width:300px;">
          耐爆ハッチを開放して脱出する
        </button>
      </div>
    `;
    openModal(html);

    document.querySelectorAll('.s2-pin-up').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        state.hatchCode[idx] = (state.hatchCode[idx] + 1) % 10;
        state.hatchCodeUnlocked = false;
        soundManager.playTick();
        saveGame();
        updateRoomDomState();
        openS2HatchModal();
      };
    });
    document.querySelectorAll('.s2-pin-down').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        state.hatchCode[idx] = (state.hatchCode[idx] + 9) % 10;
        state.hatchCodeUnlocked = false;
        soundManager.playTick();
        saveGame();
        updateRoomDomState();
        openS2HatchModal();
      };
    });

    const btnVerifyPin = document.getElementById('btn-s2-verify-pin');
    if (btnVerifyPin) {
      btnVerifyPin.onclick = () => {
        if (state.hatchCode.join('') === '7409') {
          soundManager.playSolved();
          state.hatchCodeUnlocked = true;
          saveGame();
          updateRoomDomState();
          setMessage('ピピッ！ 緊急解除PINコードが承認され、第3ロックが解除された！');
          openS2HatchModal();
        } else {
          soundManager.playClick();
          state.hatchCodeUnlocked = false;
          updateRoomDomState();
          setMessage('ブーッ！ PINコードが一致しない。オシロスコープの算出フォーミュラに従って4桁を計算しよう。');
        }
      };
    }

    document.querySelectorAll('.btn-use-item').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId === 's2_override_key') {
          soundManager.playUnlock();
          state.hatchKeyUnlocked = true;
          removeItem('s2_override_key');
          saveGame();
          updateRoomDomState();
          setMessage('ガチャン！ 物理マスターキーを回し、最終デッドボルトを解錠した！');
          openS2HatchModal();
        } else {
          soundManager.playClick();
          setMessage('このアイテムはマスター鍵穴には使えない。');
        }
      };
    });

    const btnOpen = document.getElementById('btn-s2-open-hatch');
    if (btnOpen) {
      btnOpen.onclick = () => {
        if (!state.sensorHeated) {
          soundManager.playClick();
          setMessage('油圧ロックが閉ざされている。火災防衛プロトコル（第0条）を作動させる必要がある。');
        } else if (!state.aiSafeMode) {
          soundManager.playClick();
          setMessage('AI論理ロックが有効だ。中央モニタからARESをセーフモードへ移行させよう。');
        } else if (!state.hatchCodeUnlocked) {
          soundManager.playClick();
          setMessage('4桁の緊急解除PINコードが認証されていない。ダイヤルを合わせて「PINコードを認証する」を押そう。');
        } else if (!state.hatchKeyUnlocked) {
          soundManager.playClick();
          setMessage('物理マスターキーが解錠されていない。');
        } else {
          closeModal();
          triggerGameClear();
        }
      };
    }
  }

  // [東1] 配電グリッド制御盤（パワージャンクション）
  const elS2PowerPanel = document.getElementById('s2-obj-power-panel');
  if (elS2PowerPanel) {
    elS2PowerPanel.addEventListener('click', () => openS2PowerModal());
  }

  function openS2PowerModal() {
    const usedPwr = getStage2UsedPower();
    const maxPwr = getStage2MaxPower();

    const breakers = [
      { key: 'powerVent', name: '1. 換気タービンファン', cost: 40, desc: '西ダクトの送風・サーバー冷却' },
      { key: 'powerCryo', name: '2. 極低温クライオ保管庫', cost: 40, desc: '西ロッカーの冷凍維持(-80°C)' },
      { key: 'powerServer', name: '3. メインサーバー＆波形機', cost: 60, desc: '南サーバー・東オシロスコープ起動' },
      { key: 'powerAux', name: '4. 補助電磁バスライン', cost: 40, desc: 'サーバー保管庫の電磁ロック給電' }
    ];

    let html = `
      <div class="zoom-view-header"><h3>配電グリッド制御盤</h3></div>
      <div class="zoom-body">
        <div style="background:#0b0f14; border:2px solid #c89b3c; padding:10px 16px; border-radius:4px; text-align:center; width:100%; max-width:360px;">
          <div style="font-family:var(--font-mono); font-size:1.25rem; color:${usedPwr === maxPwr ? '#f1c40f' : '#2ecc71'};">
            使用電力: ${usedPwr}V / 最大容量: ${maxPwr}V
          </div>
          <div style="font-size:0.78rem; color:#9e988e; margin-top:2px;">
            ${state.fuseInserted ? '★高圧増設ヒューズ(+40V) 装着済み' : '※増設スロットが空です（基本容量 100V）'}
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:360px; margin:10px 0;">
          ${breakers.map(b => {
            const isOn = state[b.key];
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#161b22; border:1px solid ${isOn ? '#2ecc71' : '#323c4a'}; padding:8px 12px; border-radius:3px;">
                <div>
                  <div style="font-family:var(--font-mono); font-size:0.9rem; color:#e2ddd5;">${b.name} (${b.cost}V)</div>
                  <div style="font-size:0.74rem; color:#9e988e;">${b.desc}</div>
                </div>
                <button type="button" class="btn-s2-breaker" data-key="${b.key}" data-cost="${b.cost}" style="background:${isOn ? '#1e4620' : '#2c1818'}; color:${isOn ? '#2ecc71' : '#e74c3c'}; border:1px solid ${isOn ? '#2ecc71' : '#e74c3c'}; padding:6px 0; width:56px; text-align:center; font-family:var(--font-mono); font-weight:bold; border-radius:2px; cursor:pointer; flex-shrink:0;">
                  ${isOn ? 'ON' : 'OFF'}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        ${!state.fuseInserted ? getItemPickerHtml('増設ヒューズスロットに使うアイテムを選択') : ''}
      </div>
    `;
    openModal(html);

    document.querySelectorAll('.btn-s2-breaker').forEach(btn => {
      btn.onclick = () => {
        const key = btn.getAttribute('data-key');
        const cost = parseInt(btn.getAttribute('data-cost'));
        if (state[key]) {
          state[key] = false;
          soundManager.playSwitch();
          saveGame();
          updateRoomDomState();
          openS2PowerModal();
        } else {
          if (getStage2UsedPower() + cost > getStage2MaxPower()) {
            soundManager.playClick();
            setMessage(`容量オーバー！ 最大容量(${getStage2MaxPower()}V)を超えるためONにできない。他の回路を切るかヒューズを増設しよう。`);
          } else {
            state[key] = true;
            soundManager.playSwitch();
            saveGame();
            updateRoomDomState();
            openS2PowerModal();
          }
        }
      };
    });

    document.querySelectorAll('.btn-use-item').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId === 's2_fuse') {
          soundManager.playSolved();
          state.fuseInserted = true;
          removeItem('s2_fuse');
          saveGame();
          updateRoomDomState();
          setMessage('バチン！ 高圧増設ヒューズを装着し、配電盤の最大容量が【140V】に拡張された！');
          openS2PowerModal();
        } else {
          soundManager.playClick();
          setMessage('増設スロットには適合しない。');
        }
      };
    });
  }

  // [東2] 波形同調オシロスコープ（4項目1,920通り＋手動同調ボタン＋PIN算出フォーミュラ）
  const elS2Osc = document.getElementById('s2-obj-oscilloscope');
  if (elS2Osc) {
    elS2Osc.addEventListener('click', () => openS2OscModal());
  }

  function computeOscWavePath(waveType, freq, phaseDeg, ampLv) {
    const pts = [];
    const cycles = freq / 40;
    const phaseRad = (phaseDeg * Math.PI) / 180;
    const ampPx = ampLv * 6.2;
    for (let x = 0; x <= 280; x += 2) {
      const t = (x / 280) * Math.PI * 2 * cycles + phaseRad;
      let val = 0;
      if (waveType === 'SINE') {
        val = Math.sin(t);
      } else if (waveType === 'SQUARE') {
        val = Math.sin(t) >= 0 ? 1 : -1;
      } else if (waveType === 'TRIANGLE') {
        val = (2 / Math.PI) * Math.asin(Math.sin(t));
      } else {
        // SAW
        const norm = ((t / (2 * Math.PI)) % 1 + 1) % 1;
        val = 2 * norm - 1;
      }
      const y = 45 - val * ampPx;
      pts.push((x === 0 ? 'M ' : 'L ') + x + ',' + y.toFixed(1));
    }
    return pts.join(' ');
  }

  function openS2OscModal() {
    if (!state.powerServer) {
      openModal(`
        <div class="zoom-view-header"><h3>波形同調オシロスコープ</h3></div>
        <div class="zoom-body">
          <p style="color:#9e988e; text-align:center;">
            <span class="phrase">電源が入っていない。</span><br>
            <span class="phrase">配電盤で「3. メインサーバー＆波形機 (60V)」を</span><span class="phrase">ONにする必要がある。</span>
          </p>
        </div>
      `);
      return;
    }

    const waves = ['SINE', 'SQUARE', 'TRIANGLE', 'SAW'];
    const waveLabels = {
      SINE: 'SINE (正弦波)',
      SQUARE: 'SQUARE (矩形波)',
      TRIANGLE: 'TRIANGLE (三角波)',
      SAW: 'SAW (ノコギリ波)'
    };
    const freqs = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
    const phases = [0, 45, 90, 135, 180, 225, 270, 315];
    const amps = [1, 2, 3, 4, 5, 6];

    const wavePath = computeOscWavePath(state.oscWave, state.oscFreq, state.oscPhase, state.oscAmp);

    let html = `
      <div class="zoom-view-header"><h3>波形同調オシロスコープ</h3></div>
      <div class="zoom-body">
        <div style="background:#071612; border:2px solid #2ecc71; padding:10px 12px; border-radius:4px; text-align:center; width:100%; max-width:360px; font-family:var(--font-mono);">
          <div style="color:${state.oscSolved ? '#f1c40f' : '#2ecc71'}; font-size:0.82rem; margin-bottom:6px;">
            ${state.oscSolved ? '★ SIGNAL SYNCHRONIZED ★' : 'MANUAL WAVEFORM GENERATOR'}
          </div>
          <svg viewBox="0 0 280 90" style="width:100%; height:82px; background:#040d0a; border:1px solid #14382d; border-radius:3px; margin-bottom:6px;">
            <line x1="0" y1="45" x2="280" y2="45" stroke="#14382d" stroke-width="1"/>
            <line x1="70" y1="0" x2="70" y2="90" stroke="#14382d" stroke-width="0.7" stroke-dasharray="2,2"/>
            <line x1="140" y1="0" x2="140" y2="90" stroke="#14382d" stroke-width="1"/>
            <line x1="210" y1="0" x2="210" y2="90" stroke="#14382d" stroke-width="0.7" stroke-dasharray="2,2"/>
            <path d="${wavePath}" fill="none" stroke="${state.oscSolved ? '#f1c40f' : '#2ecc71'}" stroke-width="2.2"/>
          </svg>
          <div style="font-size:0.88rem; color:#e2ddd5;">
            ${state.oscWave} | ${state.oscFreq}Hz | ${state.oscPhase}° | Lv.${state.oscAmp}
          </div>
          ${state.oscSolved ? `
            <div style="margin-top:10px; padding:10px 12px; background:#0a1a15; border:1px solid #c89b3c; border-radius:4px; color:#e2ddd5; font-size:0.76rem; text-align:left; line-height:1.75; box-sizing:border-box; width:100%;">
              <div style="color:#f1c40f; font-weight:bold; text-align:center; margin-bottom:6px; letter-spacing:0.05em; font-size:0.82rem;">【緊急解除PIN 算出フォーミュラ】</div>
              <div style="display:flex; flex-direction:column; gap:4px; font-family:var(--font-serif);">
                <div style="display:flex; justify-content:space-between; align-items:center; white-space:nowrap;">
                  <span>・<strong>1桁目</strong>：火災センサー警報温度の</span>
                  <span style="color:#f1c40f; font-weight:bold; margin-left:6px;">【十の位】</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; white-space:nowrap;">
                  <span>・<strong>2桁目</strong>：同調に成功した</span>
                  <span style="color:#f1c40f; font-weight:bold; margin-left:6px;">【振幅 Lv】</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; white-space:nowrap;">
                  <span>・<strong>3桁目</strong>：最上位特例 ART-00 の</span>
                  <span style="color:#f1c40f; font-weight:bold; margin-left:6px;">【条番号】</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; white-space:nowrap;">
                  <span>・<strong>4桁目</strong>：同調した位相角(°)の</span>
                  <span style="color:#f1c40f; font-weight:bold; margin-left:6px;">【各桁の和】</span>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; width:100%; max-width:360px; margin:8px 0;">
          <button type="button" id="btn-s2-osc-wave" class="btn-secondary" ${state.oscSolved ? 'disabled style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:default; opacity:0.85;"' : 'style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:pointer;"'}>波形タイプ<br><span style="color:#f1c40f;">${waveLabels[state.oscWave]}</span></button>
          <button type="button" id="btn-s2-osc-freq" class="btn-secondary" ${state.oscSolved ? 'disabled style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:default; opacity:0.85;"' : 'style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:pointer;"'}>周波数 (FREQ)<br><span style="color:#f1c40f;">${state.oscFreq} Hz</span></button>
          <button type="button" id="btn-s2-osc-phase" class="btn-secondary" ${state.oscSolved ? 'disabled style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:default; opacity:0.85;"' : 'style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:pointer;"'}>位相角 (PHASE)<br><span style="color:#f1c40f;">${state.oscPhase} °</span></button>
          <button type="button" id="btn-s2-osc-amp" class="btn-secondary" ${state.oscSolved ? 'disabled style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:default; opacity:0.85;"' : 'style="font-family:var(--font-mono); font-size:0.78rem; padding:6px; cursor:pointer;"'}>振幅 (AMP)<br><span style="color:#f1c40f;">Lv. ${state.oscAmp}</span></button>
        </div>

        ${state.oscSolved ? `
          <button type="button" id="btn-s2-osc-sync" class="btn-secondary" disabled style="width:100%; max-width:360px; margin-top:4px; background:#0a1a15; border:1px solid #2ecc71; color:#2ecc71; font-family:var(--font-mono); font-size:0.86rem; padding:9px 12px; cursor:default; font-weight:bold;">
            ● 波形同調完了 (SYNCHRONIZED)
          </button>
        ` : `
          <button type="button" id="btn-s2-osc-sync" class="btn-primary" style="width:100%; max-width:360px; margin-top:4px;">
            同調波形を送信する (TRANSMIT SYNC)
          </button>
        ` }
      </div>
    `;
    openModal(html);

    if (!state.oscSolved) {
      document.getElementById('btn-s2-osc-wave').onclick = () => {
        soundManager.playTick();
        state.oscWave = waves[(waves.indexOf(state.oscWave) + 1) % waves.length];
        saveGame();
        openS2OscModal();
      };
      document.getElementById('btn-s2-osc-freq').onclick = () => {
        soundManager.playTick();
        state.oscFreq = freqs[(freqs.indexOf(state.oscFreq) + 1) % freqs.length];
        saveGame();
        openS2OscModal();
      };
      document.getElementById('btn-s2-osc-phase').onclick = () => {
        soundManager.playTick();
        state.oscPhase = phases[(phases.indexOf(state.oscPhase) + 1) % phases.length];
        saveGame();
        openS2OscModal();
      };
      document.getElementById('btn-s2-osc-amp').onclick = () => {
        soundManager.playTick();
        state.oscAmp = amps[(amps.indexOf(state.oscAmp) + 1) % amps.length];
        saveGame();
        openS2OscModal();
      };

      const btnSync = document.getElementById('btn-s2-osc-sync');
      if (btnSync) {
        btnSync.onclick = () => {
          if (state.oscWave === 'TRIANGLE' && state.oscFreq === 120 && state.oscPhase === 225 && state.oscAmp === 4) {
            soundManager.playSolved();
            state.oscSolved = true;
            if (!state.hasIgniter) {
              state.hasIgniter = true;
              addItem('s2_igniter');
            }
            saveGame();
            updateRoomDomState();
            setMessage('ピピピッ！ 4つの波形パラメータが完全同調し、「圧電着火ユニット」と「緊急解除PINの算出式」が開示された！');
            openS2OscModal();
          } else {
            soundManager.playClick();
            setMessage('ブーッ！ AIジャミング波に阻まれ同調失敗。マニュアルの規定に従い【波形・周波数・位相・振幅】を計算しよう。');
          }
        };
      }
    }
  }

  // [南1] メインフレーム・サーバーラック
  const elS2Server = document.getElementById('s2-obj-server-rack');
  if (elS2Server) {
    elS2Server.addEventListener('click', () => openS2ServerModal());
  }

  function openS2ServerModal() {
    let statusHtml = '';
    if (!state.powerServer) {
      statusHtml = `<div style="color:#e74c3c;">● MAINFRAME OFFLINE（配電盤で3.メインサーバー60VをONにしてください）</div>`;
    } else if (!state.powerVent) {
      statusHtml = `<div style="color:#e67e22;">● OVERHEAT WARNING（冷却不足！1.換気タービン40Vも同時にONにしてください）</div>`;
    } else {
      statusHtml = `
        <div style="color:#2ecc71;">● SYSTEM ONLINE（区画コード：SEC-03 [深層演算室]）</div>
        <div style="color:#f1c40f; margin-top:4px;">● 電磁監視ログ：現在AIが【 位相角 45° 】のジャミング妨害波を発信中</div>
        <div style="color:#85c1e9; margin-top:4px;">● マスターキー保管庫：${state.powerAux ? '電磁バス給電OK (140Vフル稼働)' : '※解錠には4.補助電磁バス(40V)の同時給電が必要'}</div>
      `;
    }

    let html = `
      <div class="zoom-view-header"><h3>メインフレーム＆マスターキー保管庫</h3></div>
      <div class="zoom-body">
        <div style="background:#090d14; border:2px solid #4a5568; padding:14px; border-radius:4px; font-family:var(--font-mono); font-size:0.86rem; width:100%; max-width:360px; line-height:1.6;">
          ${statusHtml}
        </div>
        ${!state.keyboxUnlocked ? getItemPickerHtml('IDカードリーダーに使うアイテムを選択') : '<div style="color:#2ecc71; margin-top:10px;">● マスターキー保管庫は解錠済みです</div>'}
      </div>
    `;
    openModal(html);

    document.querySelectorAll('.btn-use-item').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId === 's2_id_card') {
          if (state.powerServer && state.powerVent && state.powerAux) {
            soundManager.playUnlock();
            state.keyboxUnlocked = true;
            state.hasOverrideKey = true;
            addItem('s2_override_key');
            saveGame();
            updateRoomDomState();
            setMessage('ピピッ！ 140Vフル給電状態でIDカードが承認され、保管庫から「物理マスターキー」を入手した！');
            openS2ServerModal();
          } else {
            soundManager.playClick();
            setMessage('IDカードを読み取ったが電力不足だ。サーバー(60V)・換気ファン(40V)・補助電磁バス(40V)の計140Vを同時給電しよう。');
          }
        } else {
          soundManager.playClick();
          setMessage('カードリーダーには使えない。');
        }
      };
    });
  }

  // [南2] 保守マニュアル（机上：答え直書きを廃止し、推論・計算ルールを記載）
  const elS2Manual = document.getElementById('s2-obj-manual');
  if (elS2Manual) {
    elS2Manual.addEventListener('click', () => {
      openModal(`
        <div class="zoom-view-header"><h3>シェルター保守運用マニュアル</h3></div>
        <div class="zoom-body">
          <div class="diary-page" style="background:#1c1e22; border:1px solid #c89b3c; padding:14px; border-radius:3px; font-size:0.81rem; line-height:1.65; color:#e2ddd5; max-height:62vh; overflow-y:auto;">
            <h4 style="color:#c89b3c; border-bottom:1px solid #4a443b; padding-bottom:4px; margin-bottom:6px;">【1. 防衛AI「ARES」特別規約・論理監査】</h4>
            <p>・<strong>火災特例（第0条 / ART-00）</strong>：第1条（機密保持）および第2条（防疫隔離）よりも優先される最上位規定。壁面火災センサーが<strong>75℃以上</strong>を検知した際、延焼・焼死回避のため耐爆ハッチの油圧ロックを強制開放する。</p>
            <p style="margin-top:6px;">・<strong>論理監査コンソールの突破条件</strong>：<br>
            AIの封鎖を解除するには、<strong>現在地の区画コード</strong>を指定した上で、「外部はすでに<strong>大気浄化完了</strong>している」にもかかわらず「区画内で<strong>火災・高熱危険</strong>が発生しており、<strong>最上位の延焼・焼死回避条項</strong>を適用すべきである」という論理式を入力せよ。<br>
            <span style="color:#e67e22;">※注意：実際に壁面センサーを75℃以上に加熱していない状態で火災申告を行うと、センサー実測値との矛盾により虚偽申告として却下される。</span></p>
            <h4 style="color:#c89b3c; border-bottom:1px solid #4a443b; padding-bottom:4px; margin:12px 0 6px;">【2. 非常通信オシロスコープ同調規定】</h4>
            <p>・<strong>波形タイプ</strong>：鉛隔壁を透過するため、頂点が鋭角に折り返す<strong>【三角波 (TRIANGLE)】</strong>を選択せよ。<br>
            ・<strong>周波数 (FREQ)</strong>：主任研究員IDカードに記載された『固有基準クロック』の<strong>第3高調波（×3倍）</strong>に設定せよ。<br>
            ・<strong>位相角 (PHASE)</strong>：南サーバーが検知している『AIジャミング妨害波の位相角』に対し、それを打ち消す<strong>逆位相（＋180°）を加算</strong>せよ。<br>
            ・<strong>振幅 (AMP)</strong>：ヒューズ増設後の『配電盤の最大許容電力(V)』から『メインサーバー回路単体の消費電力(V)』を引いた差を、<strong>20で割った値</strong>をLvに設定せよ。</p>
          </div>
        </div>
      `);
    });
  }

  // [南3] デスクの工具引き出し
  const elS2Drawer = document.getElementById('s2-obj-s2-drawer');
  if (elS2Drawer) {
    elS2Drawer.addEventListener('click', () => {
      if (!state.hasS2Driver) {
        state.hasS2Driver = true;
        addItem('s2_driver');
        saveGame();
        updateRoomDomState();
      } else {
        soundManager.playClick();
        setMessage('工具引き出しの中はもう空だ。');
      }
    });
  }

  // [西1] 極低温クライオロッカー
  const elS2Cryo = document.getElementById('s2-obj-cryo-locker');
  if (elS2Cryo) {
    elS2Cryo.addEventListener('click', () => {
      if (state.powerCryo) {
        soundManager.playClick();
        setMessage('マイナス80℃で分厚い氷に閉ざされている。東の配電盤で「2. クライオ保管庫(40V)」の電源を切れば解凍できそうだ。');
      } else if (!state.hasFrozenPack) {
        state.hasFrozenPack = true;
        addItem('s2_frozen_pack');
        saveGame();
        updateRoomDomState();
        setMessage('氷が溶けた保管庫から「密閉冷凍カプセル」を取り出した！ アイテム欄で【調べる】と分解できそうだ。');
      } else {
        soundManager.playClick();
        setMessage('解凍されたクライオロッカーの中は空だ。');
      }
    });
  }

  // [西2] 換気ダクト＆タービンファン
  const elS2Duct = document.getElementById('s2-obj-vent-duct');
  if (elS2Duct) {
    elS2Duct.addEventListener('click', () => openS2DuctModal());
  }

  function openS2DuctModal() {
    let html = `
      <div class="zoom-view-header"><h3>大型換気ダクト</h3></div>
      <div class="zoom-body">
    `;
    if (!state.ductGrilleRemoved) {
      html += `
        <p style="font-size:0.88rem; text-align:center;">
          <span class="phrase">ダクトの保護グリルが</span><span class="phrase">4隅のネジで固定されている。</span><br>
          <span class="phrase">奥に青いカードのような物が見える。</span>
        </p>
        ${getItemPickerHtml('保護グリルのネジを外す工具を選択')}
      `;
    } else if (state.powerVent) {
      html += `
        <p style="font-size:0.88rem; color:#e67e22; text-align:center;">
          <span class="phrase">保護グリルは外れたが、</span><span class="phrase">タービンファンが猛烈な速度で回転している！</span><br>
          <span class="phrase">手を入れるには配電盤で</span><span class="phrase">「1. 換気タービン(40V)」をOFFにする必要がある。</span>
        </p>
      `;
    } else if (!state.hasIdCard) {
      html += `
        <p style="font-size:0.88rem; color:#2ecc71; text-align:center;">
          <span class="phrase">タービンファンが完全に停止している。</span><br>
          <span class="phrase">今なら奥のカードを安全に回収できる！</span>
        </p>
        <button id="btn-s2-take-card" class="btn-primary" style="margin-top:10px;">奥のIDカードを取り出す</button>
      `;
    } else {
      html += `<p style="color:#9e988e; text-align:center;">ダクトの奥にはもう何もない。</p>`;
    }
    html += `</div>`;
    openModal(html);

    document.querySelectorAll('.btn-use-item').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId === 's2_driver') {
          soundManager.playScrewdriver();
          state.ductGrilleRemoved = true;
          saveGame();
          updateRoomDomState();
          setMessage('絶縁ドライバーで4隅のネジを外し、保護グリルを取り外した！');
          openS2DuctModal();
        } else {
          soundManager.playClick();
          setMessage('ネジを外すにはドライバーが必要だ。');
        }
      };
    });

    const btnCard = document.getElementById('btn-s2-take-card');
    if (btnCard) {
      btnCard.onclick = () => {
        state.hasIdCard = true;
        addItem('s2_id_card');
        saveGame();
        updateRoomDomState();
        closeModal();
      };
    }
  }

  // [西3] 壁面火災温度センサー（加熱後 78.0°C に到達）
  const elS2Sensor = document.getElementById('s2-obj-temp-sensor');
  if (elS2Sensor) {
    elS2Sensor.addEventListener('click', () => openS2SensorModal());
  }

  function openS2SensorModal() {
    let html = `
      <div class="zoom-view-header"><h3>壁面火災温度センサー</h3></div>
      <div class="zoom-body">
        <div style="background:#090d12; border:2px solid ${state.sensorHeated ? '#e74c3c' : '#3498db'}; padding:12px 20px; border-radius:4px; font-family:var(--font-mono); font-size:1.3rem; color:${state.sensorHeated ? '#e74c3c' : '#3498db'}; margin-bottom:8px;">
          検知温度: ${state.sensorHeated ? '78.0 °C [FIRE ALERT]' : '18.0 °C [NORMAL]'}
        </div>
        <p style="font-size:0.86rem; text-align:center;">
          ${state.sensorHeated
            ? '<span class="phrase">火災防衛プロトコル（第0条）が作動中！</span><br><span class="phrase">耐爆ハッチの【油圧ロック】が開放されている。</span>'
            : '<span class="phrase">75℃以上の高熱を検知すると、</span><span class="phrase">第0条により耐爆ハッチの油圧ロックが</span><span class="phrase">強制開放される仕組みだ。</span>'}
        </p>
        ${!state.sensorHeated ? getItemPickerHtml('感熱バルブを加熱するアイテムを選択') : ''}
      </div>
    `;
    openModal(html);

    document.querySelectorAll('.btn-use-item').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId === 's2_heat_torch') {
          soundManager.playSolved();
          state.sensorHeated = true;
          removeItem('s2_heat_torch');
          saveGame();
          updateRoomDomState();
          setMessage('ボォォッ！ サーマルトーチで感熱部を加熱し【78.0℃】に到達！ AI「火災検知！ 第0条ニ従イ油圧ロックヲ強制開放シマス」');
          openS2SensorModal();
        } else if (itemId === 's2_thermal_gel') {
          soundManager.playClick();
          setMessage('燃料カートリッジ単体では火がつかない。着火ユニットと結合させよう。');
        } else {
          soundManager.playClick();
          setMessage('これでは75℃以上に加熱できない。');
        }
      };
    });
  }

  // --- ナビゲーション & スワイプ ---
  document.getElementById('btn-turn-left').addEventListener('click', () => changeDirection(-1));
  document.getElementById('btn-turn-right').addEventListener('click', () => changeDirection(1));

  const elViewport = document.getElementById('viewport-wrapper');
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  elViewport.addEventListener('touchstart', (e) => {
    soundManager.init();
    if (!elModalOverlay.classList.contains('modal-hidden') ||
        !elItemDetailModal.classList.contains('modal-hidden') ||
        !elSettingsModal.classList.contains('modal-hidden') ||
        !elGameClearModal.classList.contains('modal-hidden')) {
      return;
    }
    const touch = e.changedTouches[0];
    touchStartX = touch.screenX;
    touchStartY = touch.screenY;
  }, { passive: true });

  elViewport.addEventListener('touchend', (e) => {
    if (!elModalOverlay.classList.contains('modal-hidden') ||
        !elItemDetailModal.classList.contains('modal-hidden') ||
        !elSettingsModal.classList.contains('modal-hidden') ||
        !elGameClearModal.classList.contains('modal-hidden')) {
      return;
    }
    const touch = e.changedTouches[0];
    touchEndX = touch.screenX;
    touchEndY = touch.screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const minSwipeDistance = 45;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        changeDirection(-1);
      } else {
        changeDirection(1);
      }
    }
  }

  // --- 設定モーダル制御 ---
  function openSettingsModal(fromMenu = false) {
    soundManager.playClick();
    updateSoundSettingUI();

    // メニュー画面から開いた場合は「メニューに戻る」「最初からやり直す」を非表示にする
    if (fromMenu) {
      elBlockMenuReturn.style.display = 'none';
      elBlockRestartStage.style.display = 'none';
    } else {
      elBlockMenuReturn.style.display = 'flex';
      elBlockRestartStage.style.display = 'flex';
    }

    elSettingsModal.classList.remove('modal-hidden');
  }

  function closeSettingsModal() {
    elSettingsModal.classList.add('modal-hidden');
  }

  function updateSoundSettingUI() {
    const isMuted = soundManager.muted;
    elSoundSettingStatus.textContent = isMuted ? 'OFF (消音)' : 'ON (有効)';
    elSoundSettingStatus.style.color = isMuted ? '#e74c3c' : '#2ecc71';
  }

  elBtnGameSettings.addEventListener('click', () => openSettingsModal(false));
  elMenuBtnSettings.addEventListener('click', () => openSettingsModal(true));
  elSettingsModalClose.addEventListener('click', closeSettingsModal);

  // 音量ON/OFF切替
  elBtnToggleSound.addEventListener('click', () => {
    soundManager.toggleMute();
    soundManager.playClick();
    updateSoundSettingUI();
  });

  // 設定からメニューへ戻る
  elBtnSettingToMenu.addEventListener('click', () => {
    soundManager.playClick();
    closeSettingsModal();
    closeModal();
    elItemDetailModal.classList.add('modal-hidden');
    showMenu();
  });

  // 設定から最初からやり直す
  elBtnSettingRestart.addEventListener('click', () => {
    if (confirm('このステージを最初からやり直しますか？（セーブデータはリセットされます）')) {
      closeSettingsModal();
      launchStage(true, currentStage);
    }
  });

  // クリア画面からメニューへ戻る
  elBtnClearToMenu.addEventListener('click', () => {
    soundManager.playClick();
    elGameClearModal.classList.add('modal-hidden');
    showMenu();
  });

  elBtnPlayAgain.addEventListener('click', () => {
    elGameClearModal.classList.add('modal-hidden');
    launchStage(true, currentStage);
  });

  // ステージ1選択ボタン
  elBtnPlayStage1.addEventListener('click', () => {
    const saved = getSavedData(1);
    if (saved && !saved.state.gameCleared) {
      launchStage(false, 1);
    } else {
      launchStage(true, 1);
    }
  });

  elBtnRestartStage1.addEventListener('click', () => {
    if (confirm('STAGE 1の進行データを破棄して、はじめから遊びますか？')) {
      launchStage(true, 1);
    }
  });

  // ステージ2選択ボタン
  if (elBtnPlayStage2) {
    elBtnPlayStage2.addEventListener('click', () => {
      const saved2 = getSavedData(2);
      if (saved2 && !saved2.state.gameCleared) {
        launchStage(false, 2);
      } else {
        launchStage(true, 2);
      }
    });
  }

  if (elBtnRestartStage2) {
    elBtnRestartStage2.addEventListener('click', () => {
      if (confirm('STAGE 2の進行データを破棄して、はじめから遊びますか？')) {
        launchStage(true, 2);
      }
    });
  }

  // キーボード
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeDirection(-1);
    if (e.key === 'ArrowRight') changeDirection(1);
    if (e.key === 'Escape') {
      closeModal();
      elItemDetailModal.classList.add('modal-hidden');
      closeSettingsModal();
    }
  });

  // モーダル閉じる
  elModalClose.addEventListener('click', closeModal);
  elItemDetailClose.addEventListener('click', () => {
    elItemDetailModal.classList.add('modal-hidden');
  });

  // iOS Safari初回アンロック
  const unlockAudioOnce = () => {
    soundManager.init();
    document.removeEventListener('touchstart', unlockAudioOnce);
    document.removeEventListener('click', unlockAudioOnce);
  };
  document.addEventListener('touchstart', unlockAudioOnce, { passive: true });
  document.addEventListener('click', unlockAudioOnce, { passive: true });

  // 初期起動：メニュー表示（?play=1 クエリがある場合は即座にゲームを開始）
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('play')) {
    launchStage(false);
    if (urlParams.has('dir')) {
      state.currentDirection = parseInt(urlParams.get('dir')) || 0;
      updateViewDirection();
    }
    if (urlParams.has('dark')) {
      state.isLightOn = false;
      updateRoomDomState();
    }
  } else {
    showMenu();
  }
});
