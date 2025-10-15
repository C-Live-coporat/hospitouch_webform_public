// scripts/quotationform.js
import { initFormValidation } from "./common/form-utils.js";

const ZOHO_FORM_NAME = "WebToLeads5103321000003697021";
const ZOHO_FORM_ID   = "webform5103321000003697021";

document.addEventListener("DOMContentLoaded", () => {
  const form           = document.getElementById(ZOHO_FORM_ID);
  const editSection    = document.getElementById("editSection");
  const confirmSection = document.getElementById("confirmSection");
  const goConfirmBtn   = document.getElementById("goConfirmBtn");
  const backBtn        = document.getElementById("backToEditBtn");
  const finalBtn       = document.getElementById("submitFinalBtn");

  // ===== バリデーション初期化 =====
  const doValidate = initFormValidation({
    formId:   ZOHO_FORM_ID,
    formName: ZOHO_FORM_NAME,

    requiredNames:  ["Company", "Last Name", "Website", "LEADCF9", "LEADCF10", "LEADCF10_confirm", "LEADCF130", "LEADCF52"],
    requiredLabels: [
      "法人名・団体名",
      "ご担当者さま氏名",
      "法人・団体さまのホームぺージURL",
      "お電話番号",
      "メールアドレス",
      "メールアドレス（再入力）",
      "チーム① 名称",
      "チーム① 想定人数"
    ],

    emailSelector:        "#LEADCF10",
    emailConfirmSelector: "#LEADCF10_confirm",
    phoneSelector:        "#LEADCF9",
    phoneErrorSelector:   "#phone-error",

    selectAriaIds: [],

    extraValidate: () => {
      // 1) 初回/非初回（ラジオ必須）
      // const radios  = document.querySelectorAll('input[name="first_time"]');
      // const checked = Array.from(radios).some(r => r.checked);
      // if (!checked) {
      //   alert("「初めての見積依頼ですか？」にお答えください。");
      //   return false;
      // }

      // // ラジオ → Zoho hiddenチェックボックス（はい=true）
      // const r  = document.querySelector('input[name="first_time"]:checked');
      // const cb = document.getElementById("LEADCF263");
      // if (cb) cb.checked = !!(r && r.value === "yes");

      const firstTimeSelect = document.getElementById("LEADCF3");
      if (!firstTimeSelect || !firstTimeSelect.value) {
        alert("フォーム項目１つ目「初めての資料請求・お問い合わせですか？」にお答えください。");
        firstTimeSelect?.focus();
        return false;
      }
      const sel = document.getElementById("LEADCF3");
      document.getElementById("conf-first_time").textContent = sel?.selectedOptions?.[0]?.textContent || "";


      // 2) 電話番号チェック（ハイフン必須 + 国内/E.164）
      const phoneEl = document.getElementById("LEADCF9");
      const errEl   = document.getElementById("phone-error");
      const raw     = (phoneEl?.value || "").trim();

      const allowed   = /^[0-9+\-\s]+$/.test(raw);
      const hasHyphen = raw.includes("-");
      if (allowed && !hasHyphen) {
        phoneEl?.classList.add("redBorder");
        errEl?.classList.add("open");
        alert("電話番号には必ずハイフン（-）を含めて入力してください。\n例：03-1234-5678 / 090-1234-5678 / +81-3-1234-5678");
        phoneEl?.focus();
        return false;
      }

      const noSep  = raw.replace(/[\s-]/g, "");
      const digits = noSep.replace(/\D/g, "");
      let ok = false;
      if (allowed) {
        if (noSep.startsWith("+")) ok = /^\+[1-9]\d{7,14}$/.test(noSep);
        else ok = digits.startsWith("0") && (digits.length === 10 || digits.length === 11);
      }
      phoneEl?.classList.toggle("redBorder", !ok);
      errEl?.classList.toggle("open", !ok);
      if (!ok) {
        alert("電話番号の形式が正しくありません。\n国内は「0」始まりで数字合計10〜11桁、または国際形式（+81 〜）で入力してください。");
        phoneEl?.focus();
        return false;
      }

      // 3) 人数は半角数字のみ（②③は任意入力なら数字チェックだけ）
      const mustNum = (id) => /^\d+$/.test((document.getElementById(id)?.value || "").trim());
      const optNum  = (id) => {
        const v = (document.getElementById(id)?.value || "").trim();
        return v === "" || /^\d+$/.test(v);
      };

      if (!mustNum("LEADCF52")) {
        alert("チーム① 想定人数は半角数字で入力してください。");
        document.getElementById("LEADCF52")?.focus();
        return false;
      }
      if (!optNum("LEADCF53")) {
        alert("チーム② 想定人数は半角数字で入力してください。");
        document.getElementById("LEADCF53")?.focus();
        return false;
      }
      if (!optNum("LEADCF54")) {
        alert("チーム③ 想定人数は半角数字で入力してください。");
        document.getElementById("LEADCF54")?.focus();
        return false;
      }

      return true;
    },

    submitBtnSelector: "#submitFinalBtn",
  });

  // Zoho onsubmit 互換
  window.checkMandatory5103321000003697021 = doValidate;

  // === 文字数カウンタ（Description） ===
  (function setupCounter(){
    const ta  = document.getElementById("Description");
    const cnt = document.getElementById("desc-count");
    if (!ta || !cnt) return;
    const update = () => { cnt.textContent = String(ta.value.length); };
    ["input","keyup","change","paste","cut","compositionend"].forEach(ev =>
      ta.addEventListener(ev, update)
    );
    update(); // 初期表示
  })();

  // ====== 確認画面へ ======
  const val = (id) => document.getElementById(id)?.value || "";

  function fillConfirm() {
    // const r = document.querySelector('input[name="first_time"]:checked');
    // document.getElementById("conf-first_time").textContent = r ? (r.value === "yes" ? "はい" : "いいえ") : "";
    const sel = document.getElementById("LEADCF3");
    document.getElementById("conf-first_time").textContent = sel?.selectedOptions[0].textContent || "";
    document.getElementById("conf-LEADCF10").textContent          = val("LEADCF10");
    document.getElementById("conf-LEADCF10_confirm").textContent  = val("LEADCF10_confirm");
    document.getElementById("conf-Company").textContent           = val("Company");
    document.getElementById("conf-Last_Name").textContent         = val("Last_Name");
    document.getElementById("conf-Website").textContent           = val("Website");
    document.getElementById("conf-LEADCF9").textContent           = val("LEADCF9");

    document.getElementById("conf-LEADCF130").textContent         = val("LEADCF130");
    document.getElementById("conf-LEADCF52").textContent          = val("LEADCF52");
    document.getElementById("conf-LEADCF151").textContent         = val("LEADCF151");
    document.getElementById("conf-LEADCF53").textContent          = val("LEADCF53");
    document.getElementById("conf-LEADCF152").textContent         = val("LEADCF152");
    document.getElementById("conf-LEADCF54").textContent          = val("LEADCF54");

    // 任意：確認画面に要望欄がある場合のみ転記（無ければ何もしない）
    const confDesc = document.getElementById("conf-Description");
    if (confDesc) confDesc.textContent = val("Description");
  }

  goConfirmBtn?.addEventListener("click", () => {
    if (!doValidate()) return;
    fillConfirm();
    editSection.style.display    = "none";
    confirmSection.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  backBtn?.addEventListener("click", () => {
    confirmSection.style.display = "none";
    editSection.style.display    = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  finalBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // 念のため hidden 同期
    const sel = document.getElementById("LEADCF3");
    document.getElementById("conf-first_time").textContent = sel?.selectedOptions[0].textContent || "";

    form.setAttribute("novalidate", "novalidate");
    form.submit();
  });
});
