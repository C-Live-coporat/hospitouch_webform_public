// 直送デバッグ版：余計な検証・確認画面ロジックは一切なし
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('webform5103321000002008018');

  // Zohoの onsubmit フックは常に通す
  window.checkMandatory5103321000002008018 = () => true;

  // 送信直前に「はい/いいえ → LEADCF258」を同期
  form.addEventListener('submit', () => {
    const r  = document.querySelector('input[name="first_time"]:checked');
    const cb = document.getElementById('LEADCF258');
    if (cb) cb.checked = !!(r && r.value === 'yes');
  });
});
