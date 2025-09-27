<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ほすぴタッチ｜お問い合わせ・資料請求フォーム</title>

  <!-- ▼ローカルCSS -->
  <link rel="stylesheet" href="./styles/form.css" />

  <!-- 任意：送信完了ブロックで使用 -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</head>
<body>

  <!-- ===== セクション：入力フォーム（注意事項を内包） ===== -->
  <main class="container">

    <h1 class="title">お問い合わせ・資料請求フォーム</h1>

    <section class="notice">
      <h2>ご入力前のご案内</h2>
      <p>［１］　こちらのフォームに必要事項をご入力のうえ［送信］してください。</p>
      <p>［２］　メールアドレスはお間違いのないようにご入力ください。メールアドレスが間違っていました場合、弊社からのメールが届きません。</p>
      <p>［３］　［ c-live.jp ］のドメインが受信できるように（迷惑メール扱いにならないよう）お願いいたします。</p>
      <p>［４］　カタログや見積書等のご郵送は対応しておりませんので何卒ご了承くださいませ。</p>
      <hr />
    </section>

    <p class="zcwf_text" style="margin-top:0;">＊は必須項目です</p>

    <hr class="section-divider">

    <form
      id="webform5103321000002008018"
      action="https://crm.zoho.com/crm/WebToLeadForm"
      name="WebToLeads5103321000002008018"
      method="POST"
      accept-charset="UTF-8"
      onsubmit="return checkMandatory5103321000002008018()"
    >
      <!-- Zoho hidden -->
      <input type="text" style="display:none;" name="xnQsjsdp" value="***（元の値そのまま）***" />
      <input type="hidden" name="zc_gad" id="zc_gad" value="" />
      <input type="text" style="display:none;" name="xmIwtLD" value="***（元の値そのまま）***" />
      <input type="text" style="display:none;" name="actionType" value="TGVhZHM=" />
      <!-- 送信後のサンクスURL -->
      <input type="text" style="display:none;" name="returnURL" value="https&#x3a;&#x2f;&#x2f;test.hospi.ai&#x2f;transmission-completed&#x2f;" />

      <!-- ====== 入力ブロック ====== -->
      <section id="editSection">
        <!-- 初回かどうか（UIはラジオだが Zoho の LEADCF258 に同期させるための hidden checkbox を利用） -->
        <div class="form-row">
          <label class="form-label">初めての資料請求・お問い合わせ<span class="req">*</span></label>
          <div class="form-field">
            <label><input type="radio" name="first_time" value="yes" /> はい</label>
            <label><input type="radio" name="first_time" value="no"  /> いいえ</label>
            <!-- Zoho 必須チェックボックス（JSで同期） -->
            <input type="checkbox" id="LEADCF258" name="LEADCF258" class="visually-hidden" />
          </div>
        </div>

        <div class="form-row">
          <label for="Email" class="form-label">メールアドレス<span class="req">*</span></label>
          <div class="form-field"><input type="email" id="Email" name="Email" maxlength="100" autocomplete="email" /></div>
        </div>

        <div class="form-row">
          <label for="LEADCF2" class="form-label">メールアドレス（再入力）<span class="req">*</span></label>
          <div class="form-field"><input type="email" id="LEADCF2" name="LEADCF2" maxlength="100" autocomplete="email" /></div>
        </div>

        <div class="form-row">
          <label for="Company" class="form-label">法人名・団体名<span class="req">*</span></label>
          <div class="form-field"><input type="text" id="Company" name="Company" maxlength="200" /></div>
        </div>

        <div class="form-row">
          <label for="Last_Name" class="form-label">ご担当者さま氏名<span class="req">*</span></label>
          <div class="form-field"><input type="text" id="Last_Name" name="Last Name" maxlength="80" /></div>
        </div>

        <div class="form-row">
          <label for="Website" class="form-label">法人・団体さまのホームぺージURL<span class="req">*</span></label>
          <div class="form-field"><input type="url" id="Website" name="Website" maxlength="255" placeholder="https://example.com" /></div>
        </div>

        <div class="form-row">
          <label for="Phone" class="form-label">電話番号（ハイフンアリ）<span class="req">*</span></label>
          <div class="form-field">
            <input type="text" id="Phone" name="Phone" maxlength="30" />
            <small id="phone-error" class="error-msg">電話番号の形式が正しくありません</small>
          </div>
        </div>

        <div class="form-row">
          <label for="LEADCF1" class="form-label">お問い合わせの内容を選択してください<span class="req">*</span></label>
          <div class="form-field">
            <select id="LEADCF1" name="LEADCF1" onchange="addAriaSelected5103321000002008018()">
              <option value="-None-">-None-</option>
              <option value="資料請求">資料請求</option>
              <option value="一度オンラインで相談をしたい（無料）">一度オンラインで相談をしたい（無料）</option>
              <option value="デモ画面を見たい">デモ画面を見たい</option>
              <option value="トライアルがしたい（有償）">トライアルがしたい（有償）</option>
              <option value="見積のご依頼">見積のご依頼</option>
              <option value="一度電話が欲しい">一度電話が欲しい</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label for="Description" class="form-label">ご要望等ございましたら、ご記入ください。（1500文字以内）</label>
          <div class="form-field">
            <textarea id="Description" name="Description"></textarea>
            <div class="char-counter">現在 <span id="desc-count">0</span> 文字</div>
          </div>
        </div>

        <!-- 蜜壺対策 -->
        <input type="text" style="display:none;" name="aG9uZXlwb3Q" value=""/>

        <div class="actions">
          <button type="button" id="goConfirmBtn" class="btn primary">確認へ進む</button>
        </div>
      </section>

      <!-- ====== 確認画面 ====== -->
      <section id="confirmSection" style="display:none;">
        <h2>入力内容の確認</h2>
        <dl class="confirm-list">
          <dt>初めての資料請求・お問い合わせ</dt><dd id="conf-first_time"></dd>
          <dt>メールアドレス</dt><dd id="conf-Email"></dd>
          <dt>メールアドレス（再入力）</dt><dd id="conf-LEADCF2"></dd>
          <dt>法人名・団体名</dt><dd id="conf-Company"></dd>
          <dt>ご担当者さま氏名</dt><dd id="conf-Last_Name"></dd>
          <dt>ホームページURL</dt><dd id="conf-Website"></dd>
          <dt>電話番号</dt><dd id="conf-Phone"></dd>
          <dt>お問い合わせ内容</dt><dd id="conf-LEADCF1"></dd>
          <dt>ご要望等</dt><dd id="conf-Description" class="prewrap"></dd>
        </dl>

        <div class="actions">
          <button type="button" id="backToEditBtn" class="btn">修正する</button>
          <!-- ここが最終送信ボタン（type="submit"） -->
          <button type="submit" id="submitFinalBtn" class="btn primary">送信する</button>
        </div>
      </section>

      <!-- Zoho Analytics -->
      <script id="wf_anal" src="https://crm.zohopublic.com/crm/WebFormAnalyticsServeServlet?rid=***省略***"></script>
    </form>

    <hr class="section-divider" />

    <section class="privacy">
      <h2>個人情報の取り扱いについて</h2>
      <p>当社の個人情報保護方針に基づき、適切に取り扱います。</p>
    </section>

    <!-- 送信完了のスタブ（サーバー側リダイレクト後に表示されます） -->
    <section id="thanks" class="thanks" style="display:none;">
      <span class="material-icons">check_circle</span>
      <p>送信が完了しました。ありがとうございました。</p>
    </section>

  </main>

  <!-- ESModule -->
  <script type="module" src="./scripts/requestforInformation.js"></script>
</body>
</html>
