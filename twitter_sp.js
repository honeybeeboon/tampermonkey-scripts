// ==UserScript==
// @name         Twitter Promotion Filter Ver
// @name:ja      Twitterプロモーションフィルター SP
// @version      1.0.2
// @description  Hides promotion on twitter
// @description:ja Twitterのプロモーションを隠します
// @match        https://x.com/*
// ==/UserScript==

(function () {
  var MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
  if (MutationObserver)
    console.log("TPF: Twitter Promotion Filter is enabled.");

  var style = document.createElement("style");
  style.textContent =
    '[tabindex="0"][data-testid][tpf-checked="hidden"]{ display:none!important; }';
  document.head.appendChild(style);

  var root = document.getElementById("react-root") || document.body;
  var check = function () {
    var targets = root.querySelectorAll(
        '[tabindex="0"][data-testid]:not([tpf-checked])'
      ),
      elems,
      i,
      j,
      m,
      n;
    topfor: for (i = 0, m = targets.length; i < m; i++) {
      // 1. 従来のSVGパス判定
      elems = targets[i].getElementsByTagName("path");
      for (j = 0, n = elems.length; j < n; j++) {
        if (
          elems[j].getAttribute("d") ===
          "M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"
        ) {
          console.log("TPF: Hit " + targets[i].dataset.testid);
          targets[i].setAttribute("tpf-checked", "hidden");
          continue topfor;
        }
      }

      // 2. テキスト「広告」「Ad」「プロモーション」単独一致判定
      elems = targets[i].querySelectorAll('div[dir="ltr"], span');
      for (j = 0, n = elems.length; j < n; j++) {
        var txt = (elems[j].textContent || "").trim();
        if (txt === "広告" || txt === "Ad" || txt === "プロモーション") {
          console.log("TPF: Hit (text=" + txt + ")");
          targets[i].setAttribute("tpf-checked", "hidden");
          continue topfor;
        }
      }

      // 3. 広告計測用ピクセル（placementTracking内のtop-impression-pixel）判定
      var trackingWrap = targets[i].closest('[data-testid="placementTracking"]');
      if (
        trackingWrap &&
        trackingWrap.querySelector('[data-testid="top-impression-pixel"]')
      ) {
        console.log("TPF: Hit (impression-pixel)");
        targets[i].setAttribute("tpf-checked", "hidden");
        continue topfor;
      }

      // 4. 「Ad from 〜」「〜からの広告」や広告用パラメータ(twclid=)判定
      elems = targets[i].getElementsByTagName("a");
      for (j = 0, n = elems.length; j < n; j++) {
        var linkText = (elems[j].textContent || "").trim();
        var href = elems[j].getAttribute("href") || "";
        if (
          linkText.startsWith("Ad from ") ||
          linkText.endsWith("からの広告") ||
          href.includes("twclid=")
        ) {
          console.log("TPF: Hit (Ad link)");
          targets[i].setAttribute("tpf-checked", "hidden");
          continue topfor;
        }
      }

      targets[i].setAttribute("tpf-checked", "");
    }

    // ★新規追加：プッシュ通知などのインラインプロンプトを枠・閉じるボタンごと非表示
    document.querySelectorAll('[data-testid="inlinePrompt"]').forEach((prompt) => {
      const container =
        prompt.closest('[data-testid="cellInnerDiv"] > div') ||
        prompt.parentElement;
      if (container) {
        container.style.setProperty("display", "none", "important");
      }
    });

    document
      .querySelectorAll('a[href="/i/premium_sign_up"]')
      .forEach((element) => {
        element.style.display = "none";
      });
    document
      .querySelectorAll('button[aria-label="Grokのアクション"]')
      .forEach((element) => {
        element.style.display = "none";
      });
    document
      .querySelectorAll('button[aria-label="プロフィールの要約"]')
      .forEach((element) => {
        element.style.display = "none";
      });
    // クリエイタースタジオを非表示
    document
      .querySelector('a[href="/i/jf/creators/studio"]')
      ?.style.setProperty("display", "none", "important");

    // ビジネスを非表示
    document
      .querySelector('a[href="/i/verified-orgs-signup"]')
      ?.style.setProperty("display", "none", "important");

    // 広告を非表示
    document
      .querySelector('a[href^="https://ads.x.com/"]')
      ?.style.setProperty("display", "none", "important");

    // タブの＋ボタンを非表示
    document
      .querySelectorAll(".css-g5y9jx.r-1h3ijdo.r-bt5hs4")
      .forEach((el) => {
        el.style.setProperty("display", "none", "important");
      });

    document.querySelectorAll('[role="tab"]').forEach((tab) => {
      if (tab.textContent.trim() === "MLB") {
        tab.closest('[role="presentation"]')?.remove();
      }
    });

    document.querySelector('a[aria-label="Grok"]')?.style.setProperty("display", "none");

    // おすすめを消す＋フォロー中を選ぶ（安全版）
    const tablist = document.querySelector('[role="tablist"]');
    if (tablist) {
      const tabs = tablist.querySelectorAll('[role="tab"]');
      tabs.forEach((tab) => {
        const t = tab.textContent || "";
        if (t.includes("おすすめ") || t.includes("For you")) {
          tab.style.display = "none";
        }
        if (
          (t.includes("フォロー中") || t.includes("Following")) &&
          tab.getAttribute("aria-selected") !== "true"
        ) {
          tab.click();
        }
      });
    }

    const links = document.querySelectorAll('a[href*="/communities"]');
    links.forEach((link) => {
      link.style.display = "none";
    });
  };
  new MutationObserver(check).observe(root, { childList: true, subtree: true });
  check();
})();
