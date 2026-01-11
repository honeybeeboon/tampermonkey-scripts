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
        '[tabindex="0"][data-testid]:not([tpf-checked])'
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
      /*
            elems=targets[i].querySelectorAll('div:last-child > svg[viewBox="0 0 24 24"]:first-child + :last-child > span:last-child'); //Change here for other language (e.g. '(...) > span:first-child' for English)
            for(j=0,n=elems.length;j<n;j++){
                if(elems[j].textContent.slice(-7)==="プロモーション"){ //Change here for other language (e.g. slice(0,8)==="Promoted" for English)
                    console.log("TPF: Hit");
                    targets[i].parentNode.removeChild(targets[i]);
                    continue topfor;
                }
            }
            */
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
    document
      .querySelectorAll(
        ".css-175oi2r.r-1awozwy.r-18u37iz.r-16y2uox.r-w7s2jr.r-3pj75a"
      )
      .forEach((element) => {
        if (
          element.textContent.includes("求人") ||
          element.textContent.includes("収益化") ||
          element.textContent.includes("広告") ||
          element.textContent.includes("認証済み組織") ||
          element.textContent.includes("ビジネス") ||
          element.textContent.includes("チャット") ||
          element.textContent.includes("Creator Studio") ||
          element.textContent.includes("クリエイター")
        ) {
          element.style.display = "none";
        }
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
