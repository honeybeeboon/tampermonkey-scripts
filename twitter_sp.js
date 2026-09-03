// ==UserScript==
// @name         Twitter Promotion Filter Ver
// @name:ja      Twitterプロモーションフィルター SP
// @version      1.0.0
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
        '[tabindex="0"][data-testid]:not([tpf-checked])',
      ),
      elems,
      i,
      j,
      m,
      n;
    topfor: for (i = 0, m = targets.length; i < m; i++) {
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
      // ★追加（復活）：テキスト「広告」で判定（あなたのHTMLに一致）
      // 「広告」はヘッダ付近のどこかに単独で出るので、article内の div[dir="ltr"] を見て一致チェック
      elems = targets[i].querySelectorAll('div[dir="ltr"]');
      for (j = 0, n = elems.length; j < n; j++) {
        if ((elems[j].textContent || "").trim() === "広告") {
          console.log("TPF: Hit (text=広告)");
          targets[i].setAttribute("tpf-checked", "hidden");
          continue topfor;
        }
      }

      targets[i].setAttribute("tpf-checked", "");
    }
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

    document.querySelector('a[aria-label="Grok"]').style.display = "none";
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
