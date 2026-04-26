(function () {
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var slug = currentScript.dataset.publicSlug || currentScript.dataset.businessId || "";
  var badgeToken = currentScript.dataset.badgeToken || "";
  var siteUrl = currentScript.dataset.siteUrl || window.location.origin;
  var supabaseUrl = currentScript.dataset.supabaseUrl || "";
  var supabaseAnonKey = currentScript.dataset.supabaseAnonKey || "";
  var theme = currentScript.dataset.theme || "dark";

  if (!slug) return;

  function createFallbackPayload() {
    return {
      status: "not_found",
      publicSlug: slug,
      domain: slug.replace(/-/g, "."),
    };
  }

  function fetchPayload() {
    if (!supabaseUrl || !supabaseAnonKey) {
      return Promise.resolve(createFallbackPayload());
    }

    return fetch(supabaseUrl.replace(/\/$/, "") + "/functions/v1/public-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: "Bearer " + supabaseAnonKey,
      },
      body: JSON.stringify({ slug: slug }),
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Badge lookup failed");
        return response.json();
      })
      .catch(function () {
        return createFallbackPayload();
      });
  }

  function buildStyles(status) {
    if (status === "expired") {
      return {
        accent: "#f59e0b",
        text: "Verification expired",
      };
    }

    if (status === "suspended") {
      return {
        accent: "#f87171",
        text: "Verification suspended",
      };
    }

    if (status === "not_found") {
      return {
        accent: "#94a3b8",
        text: "Verification unavailable",
      };
    }

    return {
      accent: "#34d399",
      text: "Trust checked",
    };
  }

  function render(payload) {
    var styles = buildStyles(payload.status);
    var link = document.createElement("a");
    link.href = siteUrl.replace(/\/$/, "") + "/verify/" + encodeURIComponent(payload.publicSlug || slug);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "View Crozora verification");
    link.style.display = "inline-flex";
    link.style.alignItems = "center";
    link.style.gap = "10px";
    link.style.padding = "10px 14px";
    link.style.borderRadius = "14px";
    link.style.border = "1px solid rgba(59,130,246,0.34)";
    link.style.background = theme === "light"
      ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
      : "linear-gradient(135deg, #13233f 0%, #0b1730 100%)";
    link.style.boxShadow = "0 10px 30px rgba(8,15,31,0.12)";
    link.style.fontFamily = "Inter, Arial, sans-serif";
    link.style.textDecoration = "none";
    link.style.cursor = "pointer";

    var iconWrap = document.createElement("span");
    iconWrap.style.width = "28px";
    iconWrap.style.height = "28px";
    iconWrap.style.borderRadius = "9999px";
    iconWrap.style.display = "inline-flex";
    iconWrap.style.alignItems = "center";
    iconWrap.style.justifyContent = "center";
    iconWrap.style.background = "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)";
    iconWrap.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3L18.5 5.6V12.3C18.5 18 14.6 21.9 12 23.2C9.4 21.9 5.5 18 5.5 12.3V5.6L12 3Z" fill="white"/><path d="M9.7 12.3L11.4 14L14.8 10.6" stroke="#0EA5E9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var textWrap = document.createElement("span");
    textWrap.style.display = "flex";
    textWrap.style.flexDirection = "column";

    var title = document.createElement("span");
    title.textContent = "Crozora Verified";
    title.style.fontSize = "14px";
    title.style.fontWeight = "700";
    title.style.color = theme === "light" ? "#0f172a" : "#f8fafc";

    var subtitle = document.createElement("span");
    subtitle.textContent = styles.text + (badgeToken ? " - Live badge" : "");
    subtitle.style.fontSize = "11px";
    subtitle.style.fontWeight = "600";
    subtitle.style.color = styles.accent;

    textWrap.appendChild(title);
    textWrap.appendChild(subtitle);

    link.appendChild(iconWrap);
    link.appendChild(textWrap);

    currentScript.parentNode.insertBefore(link, currentScript);
  }

  fetchPayload().then(render);
})();
