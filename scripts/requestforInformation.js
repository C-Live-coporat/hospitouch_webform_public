// scripts/requestforInformation.js
import {
  initFormValidation,
  attachSelectAriaSelected,
} from "./common/form-utils.js";

const ZOHO_FORM_NAME = "WebToLeads5103321000002008018";
const ZOHO_FORM_ID = "webform5103321000002008018";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById(ZOHO_FORM_ID);
  const editSection = document.getElementById("editSection");
  const confirmSection = document.getElementById("confirmSection");
  const goConfirmBtn = document.getElementById("goConfirmBtn");
  const backBtn = document.getElementById("backToEditBtn");
  const finalBtn = document.getElementById("submitFinalBtn");

  // ===== バリデーション初期化 =====
  const doValidate = initFormValidation({
    formId: ZOHO_FORM_ID,
    formName: ZOHO_FORM_NAME,

    requiredNames: [
      "Company",
      "Last Name",
      "Email",
      "Phone",
      "Website",
      "LEADCF1",
      "LEADCF2",
    ],
    requiredLabels: [
      "法人名・団体名",
      "ご担当者さま氏名",
      "メールアドレス",
      "電話番号",
      "貴社のWebサイトURL",
      "お問い合わせの内容を選択してください",
      "メールアドレス（再入力）",
    ],

    emailSelector: "#Email",
    emailConfirmSelector: "#LEADCF2",
    phoneSelector: "#Phone",
    phoneErrorSelector: "#phone-error", // HTML側に <small id="phone-error">... を置いてください

    // select の aria-selected を補助（Zoho互換）
    selectAriaIds: ["LEADCF1"],

    // 追加：はい/いいえ必須 ＋ 電話番号の国内/国際チェック（※ハイフン必須）
    extraValidate: () => {
      // 1) はい/いいえ（ラジオ）の必須
      // const radios = document.querySelectorAll('input[name="first_time"]');
      // const checked = Array.from(radios).some(r => r.checked);
      // if (!checked) {
      //   alert("フォーム項目１つ目「初めての資料請求・お問い合わせですか？」にお答えください。");
      //   return false;
      // }

      const sel = document.getElementById("LEADCF3");
      if (!sel?.value) {
        alert(
          "フォーム項目１つ目「初めての資料請求・お問い合わせですか？」にお答えください。"
        );
        sel?.focus();
        return false;
      }

      // 2) 電話番号の日本向けルール（ハイフン必須）
      const phoneEl = document.getElementById("Phone");
      const errEl = document.getElementById("phone-error");
      const raw = (phoneEl?.value || "").trim();

      // 許可：半角数字・ハイフン・空白・+ のみ（他は弾く）
      const allowed = /^[0-9+\-\s]+$/.test(raw);
      // 追加：ハイフン必須
      const hasHyphen = raw.includes("-");
      if (allowed && !hasHyphen) {
        phoneEl?.classList.add("redBorder");
        if (errEl) errEl.classList.add("open");
        alert(
          "電話番号には必ずハイフン（-）を含めて入力してください。\n例：03-1234-5678 / 090-1234-5678 / +81-3-1234-5678"
        );
        phoneEl?.focus();
        return false;
      }

      // 正規化：区切りを除外
      const noSep = raw.replace(/[\s-]/g, "");
      const digits = noSep.replace(/\D/g, ""); // 数字だけ

      let ok = false;

      if (allowed) {
        if (noSep.startsWith("+")) {
          // 国際形式：E.164目安（+ と 8〜15桁）
          ok = /^\+[1-9]\d{7,14}$/.test(noSep);
        } else {
          // 国内形式：先頭 0、数字合計 10〜11 桁
          ok =
            digits.startsWith("0") &&
            (digits.length === 10 || digits.length === 11);
        }
      }

      phoneEl?.classList.toggle("redBorder", !ok);
      if (errEl) errEl.classList.toggle("open", !ok);

      if (!ok) {
        alert(
          "電話番号の形式が正しくありません。\n国内は「0」始まりで数字合計10〜11桁、または国際形式（+81 〜）で入力してください。"
        );
        phoneEl?.focus();
        return false;
      }
      return true;
    },

    // 二重送信防止の対象ボタンは「送信する」に限定
    submitBtnSelector: "#submitFinalBtn",
  });

  // Zoho の onsubmit="return checkMandatory...()" 互換
  window.checkMandatory5103321000002008018 = doValidate;

  // Zoho互換 aria-selected（セレクト）
  window.addAriaSelected5103321000002008018 = function () {
    attachSelectAriaSelected("LEADCF1");
    const sel = document.getElementById("LEADCF1");
    if (sel) {
      const prev = sel.querySelector("[aria-selected=true]");
      if (prev) prev.removeAttribute("aria-selected");
      sel.options[sel.selectedIndex].ariaSelected = "true";
    }
  };

  // ラジオ（はい/いいえ）→ Zohoのcheckbox(LEADCF258)に同期
  (function syncFirstTimeToZoho() {
    // const hiddenZohoCheckbox = document.getElementById("LEADCF258");
    // const radios = document.querySelectorAll('input[name="first_time"]');
    // if (!hiddenZohoCheckbox || radios.length === 0) return;
    // radios.forEach(r => {
    //   r.addEventListener("change", e => {
    //     hiddenZohoCheckbox.checked = (e.target.value === "yes"); // はい=true、いいえ=false
    //   });
    // });
    const sel = document.getElementById("LEADCF3");
    sel?.addEventListener("change", () => {
      const hiddenZohoCheckbox = document.getElementById("LEADCF258");
      if (hiddenZohoCheckbox) {
        hiddenZohoCheckbox.checked = sel.value === "はい"; // 「はい」の場合 true
      }
    });
  })();

  // 文字数カウンタ（IME・貼付対応）
  (function setupCounter() {
    const ta = document.getElementById("Description");
    const cnt = document.getElementById("desc-count");
    if (!ta || !cnt) return;
    const update = () => {
      cnt.textContent = String(ta.value.length);
    };
    ["input", "keyup", "change", "paste", "cut", "compositionend"].forEach(
      (ev) => ta.addEventListener(ev, update)
    );
    update();
  })();

  // ====== 確認画面へ ======
  function fillConfirm() {
    const $ = (id) => document.getElementById(id);

    // はい/いいえ
    const sel2 = document.getElementById("LEADCF3");
    document.getElementById("conf-first_time").textContent = sel2?.value || "";
    document.getElementById("conf-Email").textContent =
      document.getElementById("Email")?.value || "";
    document.getElementById("conf-LEADCF2").textContent =
      document.getElementById("LEADCF2")?.value || "";
    document.getElementById("conf-Company").textContent =
      document.getElementById("Company")?.value || "";
    document.getElementById("conf-Last_Name").textContent =
      document.getElementById("Last_Name")?.value || "";
    document.getElementById("conf-Website").textContent =
      document.getElementById("Website")?.value || "";
    document.getElementById("conf-Phone").textContent =
      document.getElementById("Phone")?.value || "";

    const sel = document.getElementById("LEADCF1");
    document.getElementById("conf-LEADCF1").textContent =
      sel?.selectedOptions?.[0]?.textContent || "";

    document.getElementById("conf-Description").textContent =
      document.getElementById("Description")?.value || "";
  }

  goConfirmBtn?.addEventListener("click", () => {
    // 入力チェック（ここで送信はしない）
    if (!doValidate()) return;

    // 確認画面へ値を転記
    fillConfirm();

    // 画面切り替え
    editSection.style.display = "none";
    confirmSection.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 修正に戻る
  backBtn?.addEventListener("click", () => {
    confirmSection.style.display = "none";
    editSection.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 送信（確認画面の「送信する」）
  finalBtn?.addEventListener("click", (e) => {
    e.preventDefault(); // 既定のsubmitは止める（ネイティブ検証の影響を完全排除）

    // はい/いいえ → Zohoのhiddenチェックボックスへ同期（はい=true）
    const sel = document.getElementById("LEADCF3");
    const cb = document.getElementById("LEADCF258");
    if (cb) cb.checked = sel.value === "はい";

    // 念押しでHTML5検証をOFF
    form.setAttribute("novalidate", "novalidate");

    // 確実にPOST
    form.submit();
  });

  // 送信確定（type="submit" なので通常どおり Zoho にPOST）
  // → 追加コードは不要（window.checkMandatory... が発火）
});
