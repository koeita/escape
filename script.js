/**
 * 古びた書斎と賢者の鍵 - フルリメイク版
 * 多層暗号、照明スイッチ（暗闇モード）、アイテム分解・合成、隠し金庫ギミック
 */

document.addEventListener('DOMContentLoaded', () => {
  const SAVE_KEY = 'escape_game_stage1_save_v2';

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

  let state = createInitialState();

  // --- DOM要素 ---
  const elMenuScreen = document.getElementById('menu-screen');
  const elGameContainer = document.getElementById('game-container');
  const elBtnPlayStage1 = document.getElementById('btn-play-stage-1');
  const elBtnRestartStage1 = document.getElementById('btn-restart-stage-1');
  const elStage1Badge = document.getElementById('stage-1-badge');
  const elStage1Meta = document.getElementById('stage-1-meta');
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

      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.warn('Failed to save game:', e);
    }
  }

  function getSavedData() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
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

  function updateRoomDomState() {
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

  function updateMenuScreenInfo() {
    const saved = getSavedData();
    if (!saved) {
      elStage1Badge.textContent = 'STAGE 1';
      elStage1Badge.className = 'stage-card-badge';
      elStage1Meta.textContent = '未プレイ';
      elBtnPlayStage1.textContent = 'プレイする';
      elBtnRestartStage1.style.display = 'none';
    } else if (saved.state.gameCleared) {
      elStage1Badge.textContent = 'CLEARED ⭐';
      elStage1Badge.className = 'stage-card-badge cleared';
      const mins = Math.floor(saved.elapsedMs / 60000);
      const secs = Math.floor((saved.elapsedMs % 60000) / 1000);
      elStage1Meta.textContent = `クリア済み (タイム: ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')})`;
      elBtnPlayStage1.textContent = 'もう一度プレイ';
      elBtnRestartStage1.style.display = 'none';
    } else {
      elStage1Badge.textContent = 'プレイ中 💾';
      elStage1Badge.className = 'stage-card-badge saved';
      const itemsCount = (saved.state.inventoryIds || []).length;
      elStage1Meta.textContent = `セーブデータあり（アイテム: ${itemsCount}個）`;
      elBtnPlayStage1.textContent = 'つづきから';
      elBtnRestartStage1.style.display = 'block';
    }
  }

  function launchStage(isNewGame) {
    soundManager.playClick();
    if (isNewGame) {
      state = createInitialState();
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (e) {}
      updateRoomDomState();
    } else {
      const saved = getSavedData();
      if (saved) {
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
    state.directions.forEach((dir, idx) => {
      const el = document.getElementById(dir.id);
      if (idx === state.currentDirection) {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
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
    elItemDetailDesc.innerText = item.desc;

    // アクションボタンの表示制御
    if (itemId === 'music_box') {
      elItemDetailActionArea.style.display = 'block';
      elBtnItemAction.textContent = '工具でネジを外す';
      elBtnItemAction.onclick = handleDisassembleBox;
    } else if (itemId === 'broken_key') {
      elItemDetailActionArea.style.display = 'block';
      elBtnItemAction.textContent = '紋章をはめ込んで結合する';
      elBtnItemAction.onclick = handleAssembleKey;
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

  // アイテムピッカーUIヘルパー
  function getItemPickerHtml(actionTitle) {
    if (state.inventory.length === 0) {
      return `
        <div class="item-picker-container">
          <span class="item-picker-title">${actionTitle}</span>
          <p style="font-size:0.8rem; color:#a8947d;">（所持アイテムはありません。部屋を探索してみよう）</p>
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
        <div style="background:#151b22; border:2px solid #58d68d; border-radius:8px; padding:18px; text-align:center;">
          <p style="color:#58d68d; font-weight:bold; font-size:1.05rem; margin-bottom:8px;">★ 天球儀の仕掛けが解放された ★</p>
          <div style="width:120px; height:80px; margin:10px auto; display:flex; align-items:center; justify-content:center;">
            <span style="font-size:44px;">🌐✨</span>
          </div>
          <p style="color:#f7ede2; font-size:0.9rem;">内部の空洞から「真鍮の火かき棒」を取り出した。</p>
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
        <p style="color:#d5cac0; font-size:0.9rem;">上段の引き出しには銀色の小さな鍵穴がついている。</p>
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
        content += `<p style="color:#888; font-size:0.85rem;">引き出しの中はもう空だ。</p>`;
      }
      content += `
          </div>
        </div>
        <p style="color:#ecc57e; font-size:0.9rem;">引き出しが開いている。</p>
      `;
    }

    content += `
        </div>
        <div style="margin-top:14px; border-top:1px solid #4a3422; padding-top:10px; width:100%; text-align:center;">
          <button id="btn-open-diary" class="btn-secondary" style="padding:8px 16px; font-size:0.88rem;">
            📖 机の上の天体日誌を読む
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
          <p style="color:#a8947d; font-size:0.8rem; margin-top:6px;">金庫の奥に羊皮紙の暗号書が保管されていた。</p>
      `;

      if (!state.hasArmillaryPin) {
        content += `
          <div style="margin-top:12px; border-top:1px dashed #543c26; padding-top:10px; width:100%;">
            <p style="font-size:0.85rem; color:#f39c12; margin-bottom:8px;">暗号書の脇に小さな真鍮ピンが落ちている！</p>
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
        <p style="color:#d5cac0; font-size:0.9rem; text-align:center;">
          鉄格子が外れた！ 灰の中に何か光る金属が埋もれている。
        </p>
        <button id="btn-take-emblem" class="btn-primary" style="margin:16px 0;">
          灰の中から光るメダルを拾い上げる
        </button>
      `;
    } else {
      content += `
        <p style="color:#a8947d; font-size:0.9rem; text-align:center;">
          灰の中はもう探り尽くした。
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
        <p style="color:#d5cac0; font-size:0.85rem; text-align:center;">天体日誌に記された【西】と【東】の方位にならい、針を合わせよう。</p>
      `;
    } else {
      content += `
        <div style="text-align:center;">
          <p style="color:#58d68d; font-weight:bold; margin-bottom:8px;">★ 9時15分でからくりが作動した ★</p>
      `;
      if (!state.hasBrokenKey) {
        content += `
          <p style="color:#f7f9f9; font-size:0.9rem; margin-bottom:12px;">振り子室の底から真鍮の鍵身が落ちてきた！</p>
          <button id="btn-take-broken-key" class="btn-primary" style="font-size:0.9rem;">
            鍵身を拾い上げる
          </button>
        `;
      } else {
        content += `<p style="color:#a8947d; font-size:0.85rem;">パーツは回収済みだ。</p>`;
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
                ${state.doorKeyUnlocked ? '🔓' : '🔒'}
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
    if (confirm('書斎を最初からやり直しますか？（セーブデータはリセットされます）')) {
      closeSettingsModal();
      launchStage(true);
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
    launchStage(true);
  });

  // ステージ選択ボタン
  elBtnPlayStage1.addEventListener('click', () => {
    const saved = getSavedData();
    if (saved && !saved.state.gameCleared) {
      launchStage(false);
    } else {
      launchStage(true);
    }
  });

  elBtnRestartStage1.addEventListener('click', () => {
    if (confirm('現在の進行データを破棄して、はじめから遊びますか？')) {
      launchStage(true);
    }
  });

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

  // 初期起動：メニュー表示
  showMenu();
});
