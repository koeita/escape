/**
 * 古びた書斎と賢者の鍵 - メインゲームスクリプト
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- ゲーム状態管理 ---
  const state = {
    currentDirection: 0, // 0: 北(North), 1: 東(East), 2: 南(South), 3: 西(West)
    directions: [
      { name: '正面 (北)', id: 'view-north' },
      { name: '右側 (東)', id: 'view-east' },
      { name: '後方 (南)', id: 'view-south' },
      { name: '左側 (西)', id: 'view-west' }
    ],
    inventory: [], // { id, name, icon, desc }
    selectedItem: null,
    
    // パズルフラグ
    carpetFlipped: false,
    hasSilverKey: false,
    drawerUnlocked: false,
    hasBrush: false,
    hasMemo: false,
    booksSequence: [],
    booksPuzzleSolved: false,
    clockHour: 12,
    clockMinute: 0,
    clockPuzzleSolved: false,
    hasBrassKey: false,
    fireplaceCleaned: false,
    doorCode: [0, 0, 0, 0], // ダイヤル
    doorKeyUnlocked: false,
    doorCodeUnlocked: false,
    gameCleared: false,
    
    startTime: Date.now()
  };

  // アイテム定義
  const ITEMS = {
    silver_key: {
      id: 'silver_key',
      name: '銀の鍵',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><circle cx="15" cy="15" r="7" fill="none" stroke="#bdc3c7" stroke-width="3"/><line x1="20" y1="20" x2="30" y2="30" stroke="#bdc3c7" stroke-width="4" stroke-linecap="round"/><line x1="26" y1="26" x2="29" y2="23" stroke="#bdc3c7" stroke-width="3"/></svg>`,
      desc: '絨毯の隅に隠されていた小さな銀色の鍵。机の引き出しなどに合いそうだ。'
    },
    memo: {
      id: 'memo',
      name: '書斎主の覚え書き',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="8" y="6" width="24" height="28" fill="#fdfefe" stroke="#b2babb" stroke-width="2" rx="2"/><line x1="12" y1="12" x2="28" y2="12" stroke="#7f8c8d" stroke-width="1.5"/><line x1="12" y1="17" x2="28" y2="17" stroke="#7f8c8d" stroke-width="1.5"/><line x1="12" y1="22" x2="22" y2="22" stroke="#7f8c8d" stroke-width="1.5"/></svg>`,
      desc: '引き出しの中にあったメモ。\n「知識への扉は色によって開かれる。血の赤、深海の青、太陽の黄、若葉の緑。この順に書物を触れよ」と記されている。'
    },
    brush: {
      id: 'brush',
      name: '煤払い用ブラシ',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><rect x="18" y="6" width="4" height="20" fill="#a0522d" rx="2"/><polygon points="14,26 26,26 28,34 12,34" fill="#5d6d7e"/></svg>`,
      desc: '毛先がしっかりしたアンティークなブラシ。灰や煤（すす）を払うのに役立ちそうだ。'
    },
    brass_key: {
      id: 'brass_key',
      name: '賢者の真鍮鍵',
      icon: `<svg viewBox="0 0 40 40" class="item-icon-svg"><circle cx="15" cy="15" r="8" fill="none" stroke="#f1c40f" stroke-width="3.5"/><circle cx="15" cy="15" r="3" fill="#f1c40f"/><line x1="21" y1="21" x2="33" y2="33" stroke="#f1c40f" stroke-width="4.5" stroke-linecap="round"/><line x1="29" y1="29" x2="33" y2="25" stroke="#f1c40f" stroke-width="3"/><line x1="25" y1="25" x2="29" y2="21" stroke="#f1c40f" stroke-width="3"/></svg>`,
      desc: '古時計のからくりから落ちてきた、重厚で精巧な真鍮の鍵。部屋の大扉を開ける鍵だろうか。'
    }
  };

  // --- DOM要素 ---
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
  const elGameClearModal = document.getElementById('game-clear-modal');
  const elClearTimeDisplay = document.getElementById('clear-time-display');
  const elBtnSound = document.getElementById('btn-sound');
  const elBtnRestart = document.getElementById('btn-restart');
  const elBtnPlayAgain = document.getElementById('btn-play-again');

  // --- ヘルパー関数 ---
  function setMessage(msg) {
    elMessageBar.textContent = msg;
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

  // --- アイテムインベントリ管理 ---
  function addItem(itemId) {
    if (state.inventory.find(i => i.id === itemId)) return;
    const item = ITEMS[itemId];
    if (!item) return;

    state.inventory.push(item);
    soundManager.playItemGet();
    setMessage(`【${item.name}】を手に入れた！`);
    renderInventory();
  }

  function removeItem(itemId) {
    const idx = state.inventory.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      if (state.selectedItem === itemId) {
        state.selectedItem = null;
      }
      state.inventory.splice(idx, 1);
      renderInventory();
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
      // 既に選択中のアイテムをもう一度押したら詳細を表示
      showItemDetail(itemId);
    } else {
      state.selectedItem = itemId;
      renderInventory();
      const item = ITEMS[itemId];
      setMessage(`【${item.name}】を選択中（もう一度タップで詳細）`);
    }
  }

  function showItemDetail(itemId) {
    const item = ITEMS[itemId];
    if (!item) return;
    elItemDetailIcon.innerHTML = item.icon;
    elItemDetailName.textContent = item.name;
    elItemDetailDesc.innerText = item.desc;
    elItemDetailModal.classList.remove('modal-hidden');
  }

  // --- モーダル制御 ---
  function openModal(contentHtml) {
    elModalContent.innerHTML = contentHtml;
    elModalOverlay.classList.remove('modal-hidden');
    soundManager.playClick();
  }

  function closeModal() {
    elModalOverlay.classList.add('modal-hidden');
    elModalContent.innerHTML = '';
  }

  // --- 各ギミックの実装 ---

  // 1. 絨毯（西側）
  const elCarpet = document.getElementById('obj-carpet');
  if (elCarpet) {
    elCarpet.addEventListener('click', () => {
      if (!state.carpetFlipped) {
        state.carpetFlipped = true;
        soundManager.playClick();
        document.getElementById('carpet-corner-flat').style.display = 'none';
        document.getElementById('carpet-corner-folded').style.display = 'block';
        if (!state.hasSilverKey) {
          document.getElementById('carpet-silver-key').style.display = 'block';
          setMessage('絨毯の角をめくると、小さな銀色の鍵が落ちていた！');
        } else {
          setMessage('絨毯の角がめくられている。');
        }
      } else {
        if (!state.hasSilverKey) {
          state.hasSilverKey = true;
          document.getElementById('carpet-silver-key').style.display = 'none';
          addItem('silver_key');
        } else {
          setMessage('絨毯の下にはもう何もない。');
        }
      }
    });
  }

  // 2. 机と引き出し（東側）
  const elDesk = document.getElementById('obj-desk');
  if (elDesk) {
    elDesk.addEventListener('click', () => {
      openDeskDrawerModal();
    });
  }

  function openDeskDrawerModal() {
    let innerHtml = `
      <div class="zoom-view-header">
        <h3>机の引き出し</h3>
      </div>
      <div class="zoom-body">
        <div class="drawer-container">
    `;

    if (!state.drawerUnlocked) {
      innerHtml += `
          <p style="color:#d5cac0; font-size:0.9rem;">頑丈な鍵穴がついている。鍵がかかっているようだ。</p>
          <div class="drawer-box">
            <div id="modal-drawer-keyhole" class="drawer-keyhole" title="鍵穴"></div>
          </div>
          <p style="font-size:0.8rem; color:#a8947d;">アイテムを選んで鍵穴を調べよう</p>
      `;
    } else {
      innerHtml += `
          <div class="drawer-box drawer-opened">
            <div class="drawer-inside-items">
      `;
      if (!state.hasBrush) {
        innerHtml += `
          <button id="btn-take-brush" class="btn-icon" style="width:60px; height:60px;" title="ブラシを取る">
            ${ITEMS.brush.icon}
          </button>
        `;
      }
      if (!state.hasMemo) {
        innerHtml += `
          <button id="btn-take-memo" class="btn-icon" style="width:60px; height:60px;" title="メモを取る">
            ${ITEMS.memo.icon}
          </button>
        `;
      }
      if (state.hasBrush && state.hasMemo) {
        innerHtml += `<p style="color:#888; font-size:0.85rem;">引き出しの中はもう空っぽだ。</p>`;
      }
      innerHtml += `
            </div>
          </div>
          <p style="color:#ecc57e; font-size:0.9rem;">引き出しが開いている。</p>
      `;
    }

    innerHtml += `
        </div>
      </div>
    `;

    openModal(innerHtml);

    // イベントリスナー設定
    if (!state.drawerUnlocked) {
      const keyhole = document.getElementById('modal-drawer-keyhole');
      if (keyhole) {
        keyhole.onclick = () => {
          if (state.selectedItem === 'silver_key') {
            soundManager.playUnlock();
            state.drawerUnlocked = true;
            removeItem('silver_key');
            setMessage('銀の鍵がカチリと回った！ 引き出しが開いた。');
            openDeskDrawerModal();
          } else {
            soundManager.playClick();
            setMessage('鍵穴がある。銀の鍵が必要なようだ。');
          }
        };
      }
    } else {
      const btnBrush = document.getElementById('btn-take-brush');
      if (btnBrush) {
        btnBrush.onclick = () => {
          state.hasBrush = true;
          addItem('brush');
          openDeskDrawerModal();
        };
      }
      const btnMemo = document.getElementById('btn-take-memo');
      if (btnMemo) {
        btnMemo.onclick = () => {
          state.hasMemo = true;
          addItem('memo');
          openDeskDrawerModal();
        };
      }
    }
  }

  // 3. 本棚のパズル（東側）
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
          <p style="color:#d5cac0; font-size:0.9rem; text-align:center;">
            色とりどりの背表紙の本が並んでいる。<br>押し込める仕掛けのようだ。
          </p>
    `;

    if (!state.booksPuzzleSolved) {
      content += `
          <div class="shelf-row">
            <button class="puzzle-book book-red" data-color="red">赤</button>
            <button class="puzzle-book book-blue" data-color="blue">青</button>
            <button class="puzzle-book book-yellow" data-color="yellow">黄</button>
            <button class="puzzle-book book-green" data-color="green">緑</button>
          </div>
          <div style="font-size:0.85rem; color:#ecc57e; height:20px;" id="books-input-display">
            押した順: ${state.booksSequence.map(c => ({ red: '赤', blue: '青', yellow: '黄', green: '緑' }[c])).join(' → ')}
          </div>
          <button id="btn-reset-books" class="clock-control-btns" style="padding:4px 10px; font-size:0.8rem; background:#332215; color:#ccc; border:1px solid #664b31; border-radius:4px; cursor:pointer;">並び順をやり直す</button>
      `;
    } else {
      content += `
          <div style="background:#1c2833; border:2px solid #5d6d7e; border-radius:6px; padding:16px; text-align:center;">
            <p style="color:#58d68d; font-weight:bold; margin-bottom:8px;">★ 仕掛けが解除された ★</p>
            <p style="color:#f7f9f9; font-size:0.95rem; line-height:1.6;">
              奥から古い羊皮紙が滑り出てきた：<br>
              <strong style="color:#f39c12; font-size:1.1rem;">『扉の四桁 ＝ 灰の奥の数 ＋ 135』</strong>
            </p>
          </div>
      `;
    }

    content += `
        </div>
      </div>
    `;

    openModal(content);

    if (!state.booksPuzzleSolved) {
      const books = document.querySelectorAll('.puzzle-book');
      books.forEach(b => {
        b.onclick = () => {
          const color = b.getAttribute('data-color');
          soundManager.playClick();
          handleBookPress(color);
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

  function handleBookPress(color) {
    state.booksSequence.push(color);
    const correctSeq = ['red', 'blue', 'yellow', 'green'];
    const curIdx = state.booksSequence.length - 1;

    if (state.booksSequence[curIdx] !== correctSeq[curIdx]) {
      // 失敗
      soundManager.playClick();
      setMessage('カチャ…何かが噛み合わずに元に戻ってしまった。');
      state.booksSequence = [];
      setTimeout(() => openBookshelfModal(), 300);
      return;
    }

    if (state.booksSequence.length === correctSeq.length) {
      // 正解！
      soundManager.playSolved();
      state.booksPuzzleSolved = true;
      setMessage('カチリ！ 本棚の奥の小さな隠し扉が開いた！');
      setTimeout(() => openBookshelfModal(), 400);
    } else {
      openBookshelfModal();
    }
  }

  // 4. 絵画（南側）
  const elPainting = document.getElementById('obj-painting');
  if (elPainting) {
    elPainting.addEventListener('click', () => {
      openPaintingModal();
    });
  }

  function openPaintingModal() {
    const content = `
      <div class="zoom-view-header">
        <h3>油絵『星辰の刻』</h3>
      </div>
      <div class="zoom-body">
        <div class="painting-zoom-container">
          <svg class="painting-zoom-svg" viewBox="0 0 280 210">
            <!-- 背景空 -->
            <rect x="0" y="0" width="280" height="210" fill="#152238"/>
            <polygon points="0,210 60,130 140,170 240,110 280,180 280,210" fill="#2c3e50"/>
            <polygon points="40,210 110,150 180,190 280,130 280,210" fill="#1a252f"/>
            <!-- 満月と時計塔 -->
            <circle cx="140" cy="85" r="45" fill="#f9e79f" opacity="0.95"/>
            <!-- 尖塔 -->
            <path d="M 125,210 L 125,115 L 140,40 L 155,115 L 155,210 Z" fill="#0b0e14"/>
            <!-- 塔の大時計（9:15を指す） -->
            <circle cx="140" cy="115" r="18" fill="#fdfefe" stroke="#2c3e50" stroke-width="2"/>
            <!-- 短針 (9時 = 左) -->
            <line x1="140" y1="115" x2="128" y2="115" stroke="#922b21" stroke-width="3" stroke-linecap="round"/>
            <!-- 長針 (15分 = 右) -->
            <line x1="140" y1="115" x2="154" y2="115" stroke="#922b21" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p style="color:#d5cac0; font-size:0.9rem; text-align:center;">
            月明かりに浮かぶ古塔の絵画だ。<br>
            中央の時計台の針は<strong style="color:#ecc57e;">『短針が9、長針が3（15分）』</strong>を指している。
          </p>
        </div>
      </div>
    `;
    openModal(content);
  }

  // 5. 暖炉（南側）
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

    if (!state.fireplaceCleaned) {
      content += `
          <div class="ash-area" id="ash-click-area">
            <div class="ash-overlay" id="ash-overlay-view">
              灰が分厚く積もっている
            </div>
          </div>
          <p style="color:#d5cac0; font-size:0.85rem;">灰で奥が覆われていて見えない。ブラシがあれば払えそうだ。</p>
      `;
    } else {
      content += `
          <div class="secret-panel">
            <p style="color:#a8947d; font-size:0.85rem;">灰の奥に埋め込まれていた金属プレート</p>
            <div class="keypad-display" style="letter-spacing:4px;">刻印: 7284</div>
          </div>
          <p style="color:#ecc57e; font-size:0.9rem;">「7284」という4桁の数字が刻まれている。</p>
      `;
    }

    content += `
        </div>
      </div>
    `;

    openModal(content);

    if (!state.fireplaceCleaned) {
      const ashArea = document.getElementById('ash-click-area');
      if (ashArea) {
        ashArea.onclick = () => {
          if (state.selectedItem === 'brush') {
            soundManager.playBrush();
            state.fireplaceCleaned = true;
            document.getElementById('fireplace-plate-hint').style.opacity = '1';
            setMessage('ブラシで灰を払い落とした！ 奥から金属プレートが現れた。');
            openFireplaceModal();
          } else {
            soundManager.playClick();
            setMessage('素手で触ると煤だらけになりそうだ。掃除する道具が必要だ。');
          }
        };
      }
    }
  }

  // 6. 古時計（北側）
  const elClock = document.getElementById('obj-clock');
  if (elClock) {
    elClock.addEventListener('click', () => {
      openClockModal();
    });
  }

  function openClockModal() {
    // 角度計算
    // 短針: 1時間あたり30度 + 1分あたり0.5度
    const hourAngle = (state.clockHour % 12) * 30 + (state.clockMinute / 60) * 30;
    // 長針: 1分あたり6度
    const minuteAngle = state.clockMinute * 6;

    let content = `
      <div class="zoom-view-header">
        <h3>壁掛けの古時計</h3>
      </div>
      <div class="zoom-body">
        <div class="clock-puzzle-container">
          <svg class="clock-face-svg" viewBox="0 0 220 220">
            <!-- 時計文字盤 -->
            <circle cx="110" cy="110" r="95" fill="#fdfbf7" stroke="#8c6a3e" stroke-width="8"/>
            <circle cx="110" cy="110" r="88" fill="#f4ebd9" stroke="#b89344" stroke-width="2"/>
            <!-- 文字盤の数字 -->
            <text x="110" y="42" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">12</text>
            <text x="180" y="116" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">3</text>
            <text x="110" y="186" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">6</text>
            <text x="40" y="116" font-size="18" font-family="serif" text-anchor="middle" fill="#333" font-weight="bold">9</text>

            <!-- 短針 -->
            <line x1="110" y1="110" x2="110" y2="65" stroke="#2c3e50" stroke-width="6" stroke-linecap="round"
                  transform="rotate(${hourAngle} 110 110)" class="clock-hand"/>
            <!-- 長針 -->
            <line x1="110" y1="110" x2="110" y2="45" stroke="#b03a2e" stroke-width="4" stroke-linecap="round"
                  transform="rotate(${minuteAngle} 110 110)" class="clock-hand"/>
            <!-- 中心ピン -->
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
          <p style="color:#d5cac0; font-size:0.85rem; text-align:center;">針を回して正しい刻（とき）を刻もう。</p>
      `;
    } else {
      content += `
          <div style="text-align:center;">
            <p style="color:#58d68d; font-weight:bold; margin-bottom:8px;">★ 9時15分で機構が固定された ★</p>
      `;
      if (!state.hasBrassKey) {
        content += `
            <p style="color:#f7f9f9; font-size:0.9rem; margin-bottom:12px;">振り子室の底から何か落ちてきた！</p>
            <button id="btn-take-brass-key" class="btn-primary" style="font-size:0.9rem;">
              真鍮の鍵を拾う
            </button>
        `;
      } else {
        content += `
            <p style="color:#a8947d; font-size:0.85rem;">鍵は既に回収した。</p>
        `;
      }
      content += `
          </div>
      `;
    }

    content += `
        </div>
      </div>
    `;

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
      const btnTakeKey = document.getElementById('btn-take-brass-key');
      if (btnTakeKey) {
        btnTakeKey.onclick = () => {
          state.hasBrassKey = true;
          addItem('brass_key');
          openClockModal();
        };
      }
    }
  }

  function checkClockSolution() {
    // 目標: 9時15分
    if (state.clockHour === 9 && state.clockMinute === 15) {
      soundManager.playSolved();
      state.clockPuzzleSolved = true;
      setMessage('ガチャン！ 時計の中から重々しい音が鳴り響いた！');
    }
    openClockModal();
  }

  // 7. 大扉（北側）
  const elDoor = document.getElementById('obj-door');
  if (elDoor) {
    elDoor.addEventListener('click', () => {
      openDoorModal();
    });
  }

  function openDoorModal() {
    const codeDisplay = state.doorCode.join('');
    // 正解コード: 7284 + 135 = 7419
    const isCodeCorrect = codeDisplay === '7419';

    let content = `
      <div class="zoom-view-header">
        <h3>書斎の重厚な大扉</h3>
      </div>
      <div class="zoom-body">
        <div class="door-puzzle-container">
          <p style="color:#d5cac0; font-size:0.9rem; text-align:center;">
            頑丈な二重施錠が施されている。<br>
            【4桁の暗号錠】と【賢者の真鍮鍵穴】の解除が必要だ。
          </p>

          <div class="door-locks-status">
            <!-- 鍵穴 -->
            <div class="lock-box">
              <span class="lock-label">1. 真鍮鍵穴</span>
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

          <button id="btn-escape-door" class="btn-primary" style="margin-top:10px;">
            扉を開ける
          </button>
        </div>
      </div>
    `;

    openModal(content);

    // ダイヤルボタン操作
    const upBtns = document.querySelectorAll('.btn-dial-up');
    const downBtns = document.querySelectorAll('.btn-dial-down');

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
    const keyholeBtn = document.getElementById('btn-door-keyhole');
    if (keyholeBtn) {
      keyholeBtn.onclick = () => {
        if (state.doorKeyUnlocked) {
          setMessage('鍵はすでに解除されている。');
          return;
        }
        if (state.selectedItem === 'brass_key') {
          soundManager.playUnlock();
          state.doorKeyUnlocked = true;
          removeItem('brass_key');
          setMessage('真鍮の鍵がぴったりと合致し、重いシリンダーが解錠された！');
          openDoorModal();
        } else {
          soundManager.playClick();
          setMessage('重厚な鍵穴がある。ぴったりの鍵が必要だ。');
        }
      };
    }

    // ドアを開けるボタン
    const btnEscape = document.getElementById('btn-escape-door');
    if (btnEscape) {
      btnEscape.onclick = () => {
        if (!state.doorKeyUnlocked && !state.doorCodeUnlocked) {
          soundManager.playClick();
          setMessage('ガチャン！ 鍵も暗号も施錠されたままだ。');
        } else if (!state.doorKeyUnlocked) {
          soundManager.playClick();
          setMessage('暗号は合っているが、真鍮の鍵が開いていない！');
        } else if (!state.doorCodeUnlocked) {
          soundManager.playClick();
          setMessage('鍵は開いたが、ダイヤル暗号が解除されていない！');
        } else {
          // 両方解除！クリア！
          closeModal();
          triggerGameClear();
        }
      };
    }
  }

  function verifyDoorCode() {
    const code = state.doorCode.join('');
    if (code === '7419') {
      if (!state.doorCodeUnlocked) {
        soundManager.playSolved();
        state.doorCodeUnlocked = true;
        document.getElementById('door-lock-status-led').textContent = '● UNLOCKED';
        document.getElementById('door-lock-status-led').setAttribute('fill', '#2ecc71');
        setMessage('ピピッ！ 電子ダイヤル錠が認証された！');
      }
    } else {
      state.doorCodeUnlocked = false;
      document.getElementById('door-lock-status-led').textContent = '● LOCKED';
      document.getElementById('door-lock-status-led').setAttribute('fill', '#e74c3c');
    }
    openDoorModal();
  }

  // --- ゲームクリア演出 ---
  function triggerGameClear() {
    state.gameCleared = true;
    soundManager.playDoorOpen();

    const elapsedMs = Date.now() - state.startTime;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    const timeStr = `脱出タイム: ${String(minutes).padStart(2, '0')}分 ${String(seconds).padStart(2, '0')}秒`;

    elClearTimeDisplay.textContent = timeStr;
    setTimeout(() => {
      elGameClearModal.classList.remove('modal-hidden');
    }, 700);
  }

  // --- ナビゲーションイベント ---
  document.getElementById('btn-turn-left').addEventListener('click', () => changeDirection(-1));
  document.getElementById('btn-turn-right').addEventListener('click', () => changeDirection(1));

  // --- スマホ向けスワイプ操作対応 (iPhone 15 / 16 等) ---
  const elViewport = document.getElementById('viewport-wrapper');
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  elViewport.addEventListener('touchstart', (e) => {
    // 最初のタッチでiOS SafariのWeb Audio APIをアンロック
    soundManager.init();
    
    // モーダル表示中はスワイプ無効
    if (!elModalOverlay.classList.contains('modal-hidden') ||
        !elItemDetailModal.classList.contains('modal-hidden') ||
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
    const minSwipeDistance = 45; // 誤判定を防ぐスワイプ閾値(px)

    // 横方向の移動量が縦方向より大きく、かつ閾値を超えている場合
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // 右スワイプ → 左を向く
        changeDirection(-1);
      } else {
        // 左スワイプ → 右を向く
        changeDirection(1);
      }
    }
  }

  // キーボード操作対応（左右キーで方向転換、ESCでモーダル閉じる）
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeDirection(-1);
    if (e.key === 'ArrowRight') changeDirection(1);
    if (e.key === 'Escape') {
      closeModal();
      elItemDetailModal.classList.add('modal-hidden');
    }
  });

  // モーダル閉じる
  elModalClose.addEventListener('click', closeModal);
  elItemDetailClose.addEventListener('click', () => {
    elItemDetailModal.classList.add('modal-hidden');
  });

  // サウンドトグル
  elBtnSound.addEventListener('click', () => {
    const isMuted = soundManager.toggleMute();
    elBtnSound.textContent = isMuted ? '🔇' : '🔊';
  });

  // リセット
  function resetGame() {
    location.reload();
  }

  elBtnRestart.addEventListener('click', () => {
    if (confirm('ゲームを最初からやり直しますか？')) {
      resetGame();
    }
  });

  elBtnPlayAgain.addEventListener('click', resetGame);

  // 初回レンダリング
  updateViewDirection();
  renderInventory();

  // iOS Safari 向け：画面内の初回タップで確実にWeb Audioを有効化
  const unlockAudioOnce = () => {
    soundManager.init();
    document.removeEventListener('touchstart', unlockAudioOnce);
    document.removeEventListener('click', unlockAudioOnce);
  };
  document.addEventListener('touchstart', unlockAudioOnce, { passive: true });
  document.addEventListener('click', unlockAudioOnce, { passive: true });
});
