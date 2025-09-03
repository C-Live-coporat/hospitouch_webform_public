// scripts/requestforInformation.js
import { initFormValidation, attachSelectAriaSelected } from "./common/form-utils.js";

// HTMLの form name / id と一致させる
const ZOHO_FORM_NAME = "WebToLeads5103321000002008018";
const ZOHO_FORM_ID   = "webform5103321000002008018";

// 初期化（このページ用の設定）
const doValidate = initFormValidation({
  formId:   ZOHO_FORM_ID,
  formName: ZOHO_FORM_NAME,

  // 必須（name属性ベース）
  requiredNames:  ["Company", "Last Name", "Email", "Phone", "Website", "LEADCF1", "LEADCF2"],
  requiredLabels: ["法人名・団体名", "ご担当者さま氏名", "メールアドレス", "電話番号", "貴社のWebサイトURL", "お問い合わせの内容を選択してください", "メールアドレス（再入力）"],

  // blur検証
  emailSelector:        "#Email",
  emailConfirmSelector: "#LEADCF2",
  phoneSelector:        "#Phone",
  phoneErrorSelector:   "#redText",

  // 排他チェック（はい/いいえ）
  exclusiveCheckboxIds: ["LEADCF258", "checkboxFalse"],

  // smarturl hidden 付与
  smarturl: { paramKey: "service", expected: "smarturl" },

  // 追加バリデーション：はい/いいえ どちらか必須
  extraValidate: () => {
    const yes = document.getElementById("LEADCF258");
    const no  = document.getElementById("checkboxFalse");
    if (!(yes && yes.checked) && !(no && no.checked)) {
      alert("フォーム項目１つ目「初めての資料請求・お問い合わせですか？」にお答えください。");
      return false;
    }
    return true;
  }
});

// Zoho の onsubmit="return checkMandatory...()" に対応
window.checkMandatory5103321000002008018 = doValidate;

// --- HTML側が onChange="addAriaSelected5103321000002008018()" を呼ぶための互換関数 ---
window.addAriaSelected5103321000002008018 = function () {
  // selectのaria-selectedを切り替える（Zoho互換の動作）
  attachSelectAriaSelected("LEADCF1");
  // 1回バインドすれば良いので、即座に現在の値に対しても適用
  const sel = document.getElementById("LEADCF1");
  if (sel) {
    const prev = sel.querySelector("[aria-selected=true]");
    if (prev) prev.removeAttribute("aria-selected");
    sel.options[sel.selectedIndex].ariaSelected = "true";
  }
};
