// scripts/common/form-utils.js

/** 任意のチェックボックス群を「排他（1つだけ選択）」にする */
export function setExclusiveCheckboxes(ids = []) {
  const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
  nodes.forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) nodes.forEach((b) => b !== box && (b.checked = false));
    });
  });
}

/** 電話：半角数字とハイフンのみ許可（blur時に赤枠/エラーテキストを切替） */
export function attachPhoneHalfWidthHyphenOnly(phoneSelector, errorTextSelector) {
  const phone = document.querySelector(phoneSelector);
  const err = errorTextSelector ? document.querySelector(errorTextSelector) : null;
  if (!phone) return () => true;

  const regex = /^[0-9\-]*$/;
  const handler = () => {
    const ok = regex.test(phone.value);
    phone.classList.toggle("redBorder", !ok);
    if (err) err.classList.toggle("open", !ok);
  };
  phone.addEventListener("blur", handler);
  return () => regex.test(phone.value);
}

/** メール形式（非常に軽いチェック） */
export function attachEmailFormatBlur(emailSelector) {
  const el = document.querySelector(emailSelector);
  if (!el) return () => true;

  const handler = () => {
    const v = el.value.trim();
    const at = v.indexOf("@");
    const dot = v.lastIndexOf(".");
    const ok = at > 0 && dot > at + 1 && v.length - dot > 2;
    el.classList.toggle("redBorder", !ok);
  };
  el.addEventListener("blur", handler);
  return () => {
    const v = el.value.trim();
    const at = v.indexOf("@");
    const dot = v.lastIndexOf(".");
    return at > 0 && dot > at + 1 && v.length - dot > 2;
  };
}

/** メール再入力一致チェック */
export function attachEmailConfirmBlur(emailSelector, confirmSelector) {
  const email = document.querySelector(emailSelector);
  const confirm = document.querySelector(confirmSelector);
  if (!email || !confirm) return () => true;

  const handler = () => {
    const ok = email.value === confirm.value;
    confirm.classList.toggle("redBorder", !ok);
  };
  confirm.addEventListener("blur", handler);
  return () => email.value === confirm.value;
}

/** Zohoの ftype=email を軽量チェック（Zoho出力互換） */
export function validateZohoEmailFtype(formName) {
  const form = document.forms[formName];
  const fld = form ? form.querySelectorAll("[ftype=email]") : [];
  for (let i = 0; i < fld.length; i++) {
    const v = fld[i].value.trim();
    if (!v) continue;
    const at = v.indexOf("@");
    const dot = v.lastIndexOf(".");
    if (at < 1 || dot < at + 2 || dot + 2 >= v.length) {
      alert("有効なメールアドレスを入力してください。");
      fld[i].focus();
      return false;
    }
  }
  return true;
}

/** 必須チェック（name属性ベース・SELECTの -None-・checkbox未チェックも対応） */
export function checkRequiredByNames(formName, requiredNames = [], labels = []) {
  const form = document.forms[formName];
  if (!form) return true;

  for (let i = 0; i < requiredNames.length; i++) {
    const name = requiredNames[i];
    const label = labels[i] || name;
    const field = form[name];
    if (!field) continue;

    const val = (field.value || "").replace(/^\s+|\s+$/g, "");
    if (!val) {
      if (field.type === "file") {
        alert("アップロードするファイルを選択してください。");
      } else {
        alert(`${label} は入力必須です。`);
      }
      field.focus();
      return false;
    }
    if (field.nodeName === "SELECT" && field.options[field.selectedIndex].value === "-None-") {
      alert(`${label} は入力必須です。`);
      field.focus();
      return false;
    }
    if (field.type === "checkbox" && !field.checked) {
      alert(`Please accept ${label}`);
      field.focus();
      return false;
    }
  }
  return true;
}

/** URLに ?service=smarturl があれば hidden を付与 */
export function addSmartUrlHiddenIfNeeded(formId, paramKey = "service", expected = "smarturl") {
  const urlparams = new URLSearchParams(window.location.search);
  if (urlparams.get(paramKey) === expected) {
    const webform = document.getElementById(formId);
    if (!webform) return;
    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = paramKey;
    hidden.value = expected;
    webform.appendChild(hidden);
  }
}

/** 二重送信防止 */
export function disableSubmit(selector) {
  const btn = document.querySelector(selector);
  if (btn) btn.setAttribute("disabled", true);
}

/** select の aria-selected を切り替え（Zoho出力互換の動き） */
export function attachSelectAriaSelected(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.addEventListener("change", () => {
    const prev = sel.querySelector("[aria-selected=true]");
    if (prev) prev.removeAttribute("aria-selected");
    sel.options[sel.selectedIndex].ariaSelected = "true";
  });
}

/**
 * 初期化一括関数：設定だけ渡せば onsubmit 用の validate 関数を返す
 *  - extraValidate: 追加ルール（true を返せばOK）
 */
export function initFormValidation(config) {
  const {
    formId,
    formName,
    requiredNames = [],
    requiredLabels = [],
    emailSelector,
    emailConfirmSelector,
    phoneSelector,
    phoneErrorSelector,
    exclusiveCheckboxIds = [],   // ["A","B"] or [["A","B"],["C","D"]]
    selectAriaIds = [],          // ["LEADCF1", ...]
    smarturl = { paramKey: "service", expected: "smarturl" },
    submitBtnSelector = ".crmWebToEntityForm .formsubmit",
    extraValidate = null
  } = config;

  // 排他チェックボックス
  if (exclusiveCheckboxIds.length) {
    const groups = Array.isArray(exclusiveCheckboxIds[0]) ? exclusiveCheckboxIds : [exclusiveCheckboxIds];
    groups.forEach((ids) => setExclusiveCheckboxes(ids));
  }

  // blur チェック
  const checkPhoneOk = phoneSelector
    ? attachPhoneHalfWidthHyphenOnly(phoneSelector, phoneErrorSelector)
    : () => true;
  const checkEmailFormatOk = emailSelector
    ? attachEmailFormatBlur(emailSelector)
    : () => true;
  const checkEmailConfirmOk = emailSelector && emailConfirmSelector
    ? attachEmailConfirmBlur(emailSelector, emailConfirmSelector)
    : () => true;

  // select aria-selected
  selectAriaIds.forEach((id) => attachSelectAriaSelected(id));

  // onsubmit 本体
  function doValidate() {
    if (!checkRequiredByNames(formName, requiredNames, requiredLabels)) return false;
    if (!validateZohoEmailFtype(formName)) return false;
    if (!checkEmailFormatOk()) return false;
    if (!checkEmailConfirmOk()) {
      alert("メールアドレスが一致しません。もう一度入力してください。");
      return false;
    }
    if (!checkPhoneOk()) {
      alert("電話番号記入欄に全角数字、または文字が入力されています。もう一度入力してください。");
      return false;
    }
    if (typeof extraValidate === "function" && !extraValidate()) return false;

    addSmartUrlHiddenIfNeeded(formId, smarturl.paramKey, smarturl.expected);
    disableSubmit(submitBtnSelector);
    return true;
  }

  return doValidate;
}
