(function () {
  const data = window.KB_DATA || { docs: [], sections: [], counts: {}, home: {}, featured: {} };
  const assets = window.KB_ASSETS || {};
  const docMap = new Map(data.docs.map((doc) => [doc.id, doc]));
  const sectionMap = new Map(data.sections.map((section) => [section.id, section]));

  const UI = {
    home: "\u9996\u9875",
    product: "\u4ea7\u54c1",
    cases: "\u6848\u4f8b",
    tools: "\u5de5\u5177",
    internal: "\u5185\u90e8",
    internalMode: "\u5185\u90e8\u6a21\u5f0f",
    notFound: "\u6ca1\u6709\u627e\u5230\u8fd9\u7bc7\u6587\u6863",
    notFoundBody:
      "\u4f60\u53ef\u4ee5\u8fd4\u56de\u9996\u9875\uff0c\u6216\u8005\u4ece\u5de6\u4fa7\u76ee\u5f55\u91cd\u65b0\u8fdb\u5165\u3002",
    backHome: "\u56de\u5230\u9996\u9875",
    backPrevious: "\u8fd4\u56de\u4e0a\u4e00\u9875",
    backModule: "\u56de\u5230\u6a21\u5757",
    readBrand: "\u8fdb\u5165\u54c1\u724c",
    readCoCreate: "\u8fdb\u5165\u5171\u521b",
    readProduct: "\u4ece\u4ea7\u54c1\u5f00\u59cb",
    readingFlow:
      "\u5148\u7406\u89e3\u54c1\u724c\u662f\u4ec0\u4e48\uff0c\u518d\u7406\u89e3\u600e\u4e48\u901a\u8fc7\u5171\u521b\u628a\u5b83\u63a8\u8fdb\u51fa\u6765\uff0c\u6700\u540e\u843d\u5230\u4ea7\u54c1\u3001\u6848\u4f8b\u4e0e\u5de5\u5177\u3002",
    readingPath: "\u9605\u8bfb\u8def\u5f84",
    recommended: "\u5efa\u8bae\u9605\u8bfb\u65b9\u5f0f",
    recommendedBody:
      "\u4e0d\u786e\u5b9a\u600e\u4e48\u8fdb\u5165\u65f6\uff0c\u5148\u8bfb\u54c1\u724c\uff0c\u518d\u8bfb\u5171\u521b\uff1b\u4e5f\u53ef\u4ee5\u76f4\u63a5\u4ece\u4ea7\u54c1\u5f00\u59cb\u3002",
    enterSection: "\u8fdb\u5165",
    enterDoc: "\u8fdb\u5165\u6b63\u6587",
    watchSystem: "\u770b\u7cfb\u7edf",
    watchWorkshop: "\u770b\u5de5\u4f5c\u574a",
    fromProduct: "\u4ece\u4ea7\u54c1\u8fdb\u5165",
    readOverview: "\u5148\u8bfb\u603b\u89c8",
    openSource: "\u6253\u5f00\u6e90 Markdown",
    pageLocation: "\u672c\u9875\u4f4d\u7f6e",
    relatedLinks: "\u76f8\u5173\u8df3\u8f6c",
    relatedCases: "\u76f8\u5173\u6848\u4f8b",
    relatedTools: "\u76f8\u5173\u5de5\u5177",
    relatedPages: "\u7ee7\u7eed\u9605\u8bfb",
    currentModule: "\u6240\u5c5e\u6a21\u5757",
    currentDirectory: "\u5f53\u524d\u76ee\u5f55",
    keyDirectory: "\u91cd\u70b9\u76ee\u5f55",
    keyDirectoryBody:
      "\u5148\u4ece 6 \u4e2a\u6700\u91cd\u8981\u7684\u8282\u70b9\u8fdb\u5165\uff0c\u5b8c\u6574\u76ee\u5f55\u518d\u4ece\u4fa7\u680f\u5c55\u5f00\u3002",
    contentEvidence: "\u5185\u5bb9\u8bc1\u636e",
    contentEvidenceBody:
      "\u7528\u54c1\u724c\u3001\u5171\u521b\u3001\u4ea7\u54c1\u4e09\u6761\u8def\u5f84\uff0c\u76f4\u89c2\u770b\u61c2\u8fd9\u5957\u77e5\u8bc6\u5e93\u5728\u8bf4\u4ec0\u4e48\u3002",
    currentFocus: "\u5f53\u524d\u91cd\u70b9",
    searchEmpty: "\u6ca1\u6709\u627e\u5230\u5339\u914d\u5185\u5bb9\u3002",
    internalLockedTitle: "\u5185\u90e8\u6a21\u5f0f",
    internalLockedBody:
      "\u8fd9\u7bc7\u5185\u5bb9\u5df2\u88ab\u6807\u8bb0\u4e3a\u5185\u90e8\u6587\u6863\u3002\u82e5\u4f60\u9700\u8981\u67e5\u770b\uff0c\u8bf7\u6253\u5f00\u53f3\u4e0a\u89d2\u7684\u201c\u5185\u90e8\u6a21\u5f0f\u201d\u3002",
    enableInternal: "\u5f00\u542f\u5185\u90e8\u6a21\u5f0f",
    publicDoc: "\u516c\u5f00\u6587\u6863",
    internalDoc: "\u5185\u90e8\u6587\u6863",
    noRelated: "\u672c\u9875\u6682\u65e0\u5df2\u6536\u5f55\u7684\u76f8\u5173\u8df3\u8f6c\u3002",
    sectionDocFallback: "\u6587\u6863",
    searchLabel: "\u641c\u7d22",
    directoryTitle: "\u77e5\u8bc6\u76ee\u5f55"
  };

  const state = {
    showInternal: localStorage.getItem("yamian-formal-show-internal") === "1",
    query: "",
    sidebarOpen: (() => {
      try {
        const parsed = JSON.parse(sessionStorage.getItem("yamian-formal-sidebar-open") || "[]");
        return new Set(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        return new Set();
      }
    })()
  };

  const els = {
    brandHomeButton: document.getElementById("brandHomeButton"),
    brandLogo: document.getElementById("brandLogo"),
    searchInput: document.getElementById("searchInput"),
    internalToggle: document.getElementById("internalToggle"),
    statTotal: document.getElementById("statTotal"),
    statPublic: document.getElementById("statPublic"),
    statInternal: document.getElementById("statInternal"),
    focusPanel: document.getElementById("focusPanel"),
    focusContent: document.getElementById("focusContent"),
    searchPanel: document.getElementById("searchPanel"),
    searchResults: document.getElementById("searchResults"),
    sidebarTree: document.getElementById("sidebarTree"),
    viewRoot: document.getElementById("viewRoot"),
    navButtons: Array.from(document.querySelectorAll(".top-nav button"))
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function humanizeSegment(segment) {
    return segment
      .replace(/\.md$/i, "")
      .replace(/^【需内部】/, "")
      .replace(/^\d+_/, "")
      .replace(/_/g, " / ");
  }

  function clipText(value, maxLength = 82) {
    const text = String(value || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) {
      return "";
    }
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength).replace(/[，。；、：,.;!?！？]$/, "")}…`;
  }

  function docLabel(doc, fallback) {
    return fallback || doc.folderLabel || humanizeSegment(doc.folderKey || "") || UI.sectionDocFallback;
  }

  function splitSectionGroups(section) {
    const primaryIds = new Set(section.primaryGroupIds || []);
    const supportIds = new Set(section.supportGroupIds || []);
    const primary = [];
    const support = [];

    (section.groups || []).forEach((group) => {
      if (primaryIds.has(group.id)) {
        primary.push(group);
        return;
      }
      if (supportIds.has(group.id)) {
        support.push(group);
        return;
      }
      support.push(group);
    });

    return { primary, support };
  }

  function routeForSection(sectionId) {
    if (sectionId === "brand") {
      return "#/brand";
    }
    if (sectionId === "co-create") {
      return "#/co-create";
    }
    if (sectionId === "product") {
      return "#/product";
    }
    return "#/";
  }

  function routeForDoc(docId) {
    return `#/doc/${encodeURIComponent(docId)}`;
  }

  function sectionRouteForDoc(doc) {
    if (!doc) {
      return "#/";
    }
    if (doc.isProductDoc) {
      return "#/product";
    }
    if (doc.sectionId === "brand") {
      return "#/brand";
    }
    if (doc.sectionId === "co-create") {
      return "#/co-create";
    }
    return "#/";
  }

  function sectionTitleForDoc(doc) {
    if (!doc) {
      return UI.home;
    }
    if (doc.isProductDoc && sectionMap.get("product")) {
      return sectionMap.get("product").title;
    }
    if (doc.sectionId && sectionMap.get(doc.sectionId)) {
      return sectionMap.get(doc.sectionId).title;
    }
    return UI.home;
  }

  function getAssetUrl(assetId) {
    return assets[assetId] ? assets[assetId].publicPath : "";
  }

  function rememberRouteHistory() {
    const current = window.location.hash || "#/";
    try {
      const previousCurrent = sessionStorage.getItem("yamian-formal-current-hash");
      if (previousCurrent && previousCurrent !== current) {
        sessionStorage.setItem("yamian-formal-previous-hash", previousCurrent);
      }
      sessionStorage.setItem("yamian-formal-current-hash", current);
    } catch (error) {
      // ignore storage failures in static preview
    }
  }

  function previousRouteHash() {
    try {
      return sessionStorage.getItem("yamian-formal-previous-hash") || "#/";
    } catch (error) {
      return "#/";
    }
  }

  function parseRoute() {
    const hash = window.location.hash || "#/";
    if (hash === "#" || hash === "#/") {
      return { type: "home" };
    }
    if (hash === "#/brand") {
      return { type: "section", sectionId: "brand" };
    }
    if (hash === "#/co-create") {
      return { type: "section", sectionId: "co-create" };
    }
    if (hash === "#/product") {
      return { type: "section", sectionId: "product" };
    }
    if (hash.startsWith("#/doc/")) {
      const encoded = hash.slice("#/doc/".length).split("#")[0];
      return { type: "doc", docId: decodeURIComponent(encoded) };
    }
    return { type: "home" };
  }

  function isVisible(doc) {
    return state.showInternal || !doc.internal;
  }

  function filteredDocs() {
    const docs = data.docs.filter(isVisible);
    const query = state.query.trim().toLowerCase();
    if (!query) {
      return docs;
    }
    return docs.filter((doc) => doc.searchText.toLowerCase().includes(query));
  }

  function visibleSection(sectionId) {
    const section = sectionMap.get(sectionId);
    if (!section) {
      return null;
    }
    return {
      ...section,
      groups: section.groups
        .map((group) => ({
          ...group,
          docs: group.docs.filter(isVisible)
        }))
        .filter((group) => group.docs.length > 0),
      readingPath: section.readingPath
        .map((item) => (typeof item === "string" ? docMap.get(item) : item))
        .filter(Boolean)
        .filter(isVisible)
    };
  }

  function docsForSidebar() {
    const route = parseRoute();
    const docs = filteredDocs();

    if (route.type === "home") {
      return docs;
    }

    if (route.type === "section" && route.sectionId === "brand") {
      return docs.filter((doc) => doc.sectionId === "brand" || doc.sectionId === "entry");
    }

    if (route.type === "section" && route.sectionId === "co-create") {
      return docs.filter((doc) => doc.sectionId === "co-create" || doc.sectionId === "entry");
    }

    if (route.type === "section" && route.sectionId === "product") {
      return docs.filter((doc) => doc.isProductDoc || doc.sectionId === "entry");
    }

    if (route.type === "doc") {
      const current = docMap.get(route.docId);
      if (!current) {
        return docs;
      }
      if (current.isProductDoc) {
        return docs.filter((doc) => doc.isProductDoc || doc.sectionId === "entry");
      }
      if (current.sectionId === "brand") {
        return docs.filter((doc) => doc.sectionId === "brand" || doc.sectionId === "entry");
      }
      if (current.sectionId === "co-create") {
        return docs.filter((doc) => doc.sectionId === "co-create" || doc.sectionId === "entry");
      }
    }

    return docs;
  }

  function resolveLink(link) {
    if (!link) {
      return "#/";
    }
    if (link.type === "section") {
      return routeForSection(link.sectionId);
    }
    return routeForDoc(link.docId);
  }

  function buildTree(docs) {
    const root = { type: "folder", key: "root", label: "root", children: [] };

    docs.forEach((doc) => {
      const parts = doc.relativePath.split("/");
      let cursor = root;

      parts.slice(0, -1).forEach((segment, index) => {
        const key = parts.slice(0, index + 1).join("/");
        let folder = cursor.children.find((item) => item.type === "folder" && item.key === key);
        if (!folder) {
          folder = {
            type: "folder",
            key,
            raw: segment,
            label: humanizeSegment(segment),
            children: []
          };
          cursor.children.push(folder);
        }
        cursor = folder;
      });

      cursor.children.push({
        type: "doc",
        key: doc.id,
        doc
      });
    });

    const sortNode = (node) => {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        const aLabel = a.type === "folder" ? a.raw || a.label : a.doc.relativePath;
        const bLabel = b.type === "folder" ? b.raw || b.label : b.doc.relativePath;
        return aLabel.localeCompare(bLabel, "zh-CN");
      });
      node.children.forEach((child) => {
        if (child.type === "folder") {
          sortNode(child);
        }
      });
      return node;
    };

    return sortNode(root);
  }

  function folderHasActive(folder, activeId) {
    return folder.children.some((child) => {
      if (child.type === "doc") {
        return child.doc.id === activeId;
      }
      return folderHasActive(child, activeId);
    });
  }

  function renderTreeNode(node, activeId) {
    if (node.type === "doc") {
      const activeClass = node.doc.id === activeId ? " active" : "";
      const badge = node.doc.internal ? `<span class="tree-badge">${UI.internal}</span>` : "";
      return `<a class="tree-doc${activeClass}" href="${routeForDoc(node.doc.id)}">${escapeHtml(node.doc.title)}${badge}</a>`;
    }

    const shouldOpen = state.sidebarOpen.has(node.key) || folderHasActive(node, activeId) || node.key.split("/").length <= 2;
    const open = shouldOpen ? " open" : "";
    const children = node.children.map((child) => renderTreeNode(child, activeId)).join("");
    return `<details data-key="${escapeHtml(node.key)}"${open}><summary>${escapeHtml(node.label)}</summary>${children}</details>`;
  }

  function renderSidebar() {
    const tree = buildTree(docsForSidebar());
    const route = parseRoute();
    const activeId = route.type === "doc" ? route.docId : null;
    els.sidebarTree.innerHTML = tree.children.map((node) => renderTreeNode(node, activeId)).join("");
  }

  function persistSidebarState() {
    const openKeys = Array.from(els.sidebarTree.querySelectorAll("details[open]"))
      .map((item) => item.getAttribute("data-key"))
      .filter(Boolean);
    state.sidebarOpen = new Set(openKeys);
    try {
      sessionStorage.setItem("yamian-formal-sidebar-open", JSON.stringify(openKeys));
    } catch (error) {
      // ignore storage failures in static preview
    }
  }

  function renderStats() {
    els.statTotal.textContent = data.counts.total || 0;
    els.statPublic.textContent = data.counts.public || 0;
    els.statInternal.textContent = data.counts.internal || 0;
  }

  function renderSearchResults() {
    const query = state.query.trim();
    if (!query) {
      els.searchPanel.hidden = true;
      els.searchResults.innerHTML = "";
      return;
    }

    const matches = filteredDocs().slice(0, 16);
    els.searchPanel.hidden = false;

    if (!matches.length) {
      els.searchResults.innerHTML = `<div class="empty-state">${UI.searchEmpty}</div>`;
      return;
    }

    els.searchResults.innerHTML = matches
      .map(
        (doc) => `
          <a class="search-item" href="${routeForDoc(doc.id)}">
            <strong>${escapeHtml(doc.title)}</strong>
            <span>${escapeHtml(doc.relativePath)}</span>
          </a>
        `
      )
      .join("");
  }

  function renderDocCard(doc, options = {}) {
    const kicker = docLabel(doc, options.kicker);
    const cta = options.cta || UI.enterDoc;
    const summary = clipText(doc.shortExcerpt || doc.excerpt || "", options.maxChars || 92);
    return `
      <article class="doc-card">
        <div class="doc-card-head">
          <span class="doc-card-kicker">${escapeHtml(kicker)}</span>
          ${doc.internal ? `<span class="status-pill internal">${UI.internal}</span>` : ""}
        </div>
        <h3 class="doc-card-title"><a href="${routeForDoc(doc.id)}">${escapeHtml(doc.title)}</a></h3>
        <p class="doc-card-excerpt">${escapeHtml(summary)}</p>
        <div class="doc-card-actions">
          <span>${escapeHtml(kicker)}</span>
          <a class="card-cta secondary" href="${routeForDoc(doc.id)}">${cta}</a>
        </div>
      </article>
    `;
  }

  function renderHighlightCard(item, index) {
    const doc = docMap.get(item.docId);
    if (!doc || !isVisible(doc)) {
      return "";
    }
    const assetUrl = item.assetId ? getAssetUrl(item.assetId) : "";
    const style = assetUrl ? `style="--card-image:url('${escapeHtml(assetUrl)}')"` : "";
    const largeClass = index < 2 ? " large" : "";
    const summary = clipText(item.blurb || doc.shortExcerpt || doc.excerpt || "", index < 2 ? 86 : 68);
    return `
      <article class="highlight-card${largeClass}${assetUrl ? " has-media" : ""}" ${style}>
        ${assetUrl ? `<div class="highlight-card-media"></div>` : ""}
        <div class="highlight-card-copy">
          <span class="doc-card-kicker">${escapeHtml(item.eyebrow || docLabel(doc))}</span>
          <h3><a href="${routeForDoc(doc.id)}">${escapeHtml(doc.title)}</a></h3>
          <p>${escapeHtml(summary)}</p>
          <a class="card-cta primary" href="${routeForDoc(doc.id)}">${escapeHtml(item.cta || UI.enterDoc)}</a>
        </div>
      </article>
    `;
  }

  function renderShowcaseCard(item) {
    const href = resolveLink(item.link);
    const assetUrl = item.assetId ? getAssetUrl(item.assetId) : "";
    const style = assetUrl ? `style="--showcase-image:url('${escapeHtml(assetUrl)}')"` : "";
    return `
      <article class="showcase-card" ${style}>
        <div class="showcase-overlay">
          <span class="doc-card-kicker">${UI.contentEvidence}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.blurb)}</p>
          <a class="highlight-link" href="${href}">${UI.enterSection}</a>
        </div>
      </article>
    `;
  }

  function renderEntryCard(section, options = {}) {
    const assetUrl = getAssetUrl(options.assetId || section.heroAssetId);
    const style = assetUrl ? `style="--entry-image:url('${escapeHtml(assetUrl)}')"` : "";
    return `
      <article class="entry-card" ${style}>
        <div class="entry-card-shell">
          <span class="doc-card-kicker">${escapeHtml(options.eyebrow || section.eyebrow)}</span>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(options.blurb || section.description)}</p>
          <a class="hero-button primary" href="${routeForSection(section.id)}">${escapeHtml(options.cta || UI.enterSection)}</a>
        </div>
      </article>
    `;
  }

  function renderLineIcon(type) {
    const icons = {
      brand: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 8 48 24 32 40 16 24 32 8Z"></path>
          <path d="M32 24 56 32 32 56 8 32 32 24Z"></path>
          <path d="M24 32h16M32 24v16"></path>
        </svg>
      `,
      cocreate: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M22 18c-8 0-14 6-14 14s6 14 14 14c6 0 11-4 13-9"></path>
          <path d="M42 18c-6 0-11 4-13 9 2 5 7 9 13 9 8 0 14-6 14-14s-6-14-14-14Z"></path>
          <path d="M24 32h16"></path>
        </svg>
      `,
      spiral: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 10c-11 0-20 8-20 18 0 11 9 18 20 18 8 0 14-5 14-12 0-6-5-10-11-10-5 0-9 3-9 8 0 4 3 6 6 6 3 0 5-2 5-4"></path>
          <path d="M44 46l8 8"></path>
        </svg>
      `,
      growth: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M12 48h40"></path>
          <path d="M18 42l10-10 8 8 16-18"></path>
          <path d="M44 22h8v8"></path>
        </svg>
      `,
      toolbox: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M14 24h36l4 8v16H10V32l4-8Z"></path>
          <path d="M24 24v-6h16v6"></path>
          <path d="M10 36h44"></path>
        </svg>
      `,
      case: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="14" y="12" width="36" height="40" rx="4"></rect>
          <path d="M22 24h20M22 32h20M22 40h12"></path>
        </svg>
      `,
      workshop: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="10" y="14" width="44" height="28" rx="3"></rect>
          <path d="M20 50h24M24 42v8M40 42v8"></path>
          <path d="M18 24h28M18 30h18"></path>
        </svg>
      `
    };
    return icons[type] || icons.brand;
  }

  function renderSystemMap(nodes) {
    const connections = [
      ["definition", "product-system"],
      ["definition", "channel-system"],
      ["definition", "communication-system"],
      ["definition", "construction-system"],
      ["definition", "operation-system"],
      ["definition", "person-system"],
      ["definition", "innovation-spiral"],
      ["definition", "growth-path"]
    ];
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    const lines = connections
      .map(([from, to]) => {
        const start = nodeMap.get(from);
        const end = nodeMap.get(to);
        if (!start || !end) {
          return "";
        }
        return `<line x1="${start.position.x}" y1="${start.position.y}" x2="${end.position.x}" y2="${end.position.y}" />`;
      })
      .join("");

    const labels = nodes
      .map((node) => {
        const href = routeForDoc(node.docId);
        return `
          <a
            class="system-node ${node.kind}"
            href="${href}"
            style="left:${node.position.x}%;top:${node.position.y}%"
          >
            <span>${escapeHtml(node.shortTitle || node.title)}</span>
          </a>
        `;
      })
      .join("");

    return `
      <section class="home-section system-section" id="home-system">
        <div class="home-section-head">
          <span class="home-section-kicker">System Map</span>
          <h2>品牌传建系统地图</h2>
          <p>从品牌定义出发，进入产品、渠道、传播、建设、运营，以及品牌创新与增长路径。</p>
        </div>
        <div class="system-map-wrap">
          <div class="system-map-stage">
            <svg class="system-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              ${lines}
            </svg>
            ${labels}
          </div>
        </div>
      </section>
    `;
  }

  function renderQuickAccessCard(item) {
    return `
      <a class="quick-access-card" href="${routeForDoc(item.docId)}">
        <span class="quick-access-icon">${renderLineIcon(item.icon)}</span>
        <div class="quick-access-copy">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.description)}</span>
        </div>
      </a>
    `;
  }

  function renderFocusDirectory() {
    const route = parseRoute();
    let items = data.home.highlightCards || [];

    if (route.type === "section") {
      const section = visibleSection(route.sectionId);
      items = (section && section.keyHighlights) || items;
    } else if (route.type === "doc") {
      const doc = docMap.get(route.docId);
      if (doc) {
        const sectionId = doc.isProductDoc ? "product" : doc.sectionId;
        const section = visibleSection(sectionId);
        items = (section && section.keyHighlights) || items;
      }
    }

    els.focusContent.innerHTML = items
      .map((item) => {
        const doc = docMap.get(item.docId);
        if (!doc || !isVisible(doc)) {
          return "";
        }
        return `
          <a class="focus-link" href="${routeForDoc(doc.id)}">
            <strong>${escapeHtml(item.eyebrow || doc.title)}</strong>
            <span>${escapeHtml(item.blurb || doc.shortExcerpt || "")}</span>
          </a>
        `;
      })
      .join("");
  }

  function renderQuickLink(item) {
    const href = item.type === "section" ? routeForSection(item.sectionId) : routeForDoc(item.docId);
    return `
      <a class="quick-chip" href="${href}">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.description)}</span>
      </a>
    `;
  }

  function renderReadingStep(doc, index) {
    return `
      <a class="reading-step" href="${routeForDoc(doc.id)}">
        <span>${index + 1}</span>
        <strong>${escapeHtml(doc.title)}</strong>
      </a>
    `;
  }

  function renderSectionPreview(section) {
    const previewDocs = section.groups.slice(0, 3).flatMap((group) => group.docs.slice(0, 1));
    return `
      <section class="section-panel">
        <div class="section-panel-head">
          <div>
            <span class="doc-card-kicker">${escapeHtml(section.eyebrow)}</span>
            <h2>${escapeHtml(section.title)}</h2>
            <p>${escapeHtml(section.description)}</p>
          </div>
          <a class="action-link" href="${routeForSection(section.id)}">${UI.enterSection}${escapeHtml(section.title)}</a>
        </div>
        <div class="card-grid">
          ${previewDocs.map((doc) => renderDocCard(doc)).join("")}
        </div>
      </section>
    `;
  }

  function renderGroup(group, options = {}) {
    const gridClass = options.gridClass || "card-grid";
    const variantClass = options.variant ? ` ${options.variant}` : "";
    const cta = options.cta || UI.enterDoc;
    return `
      <section class="section-group${variantClass}">
        <div class="group-head">
          <div>
            <span class="doc-card-kicker">${escapeHtml(group.title)}</span>
            <h2>${escapeHtml(group.title)}</h2>
            <p>${escapeHtml(group.description || "")}</p>
          </div>
        </div>
        <div class="${gridClass}">
          ${group.docs.map((doc) => renderDocCard(doc, { kicker: group.title, cta, maxChars: options.maxChars || 92 })).join("")}
        </div>
      </section>
    `;
  }

  function docsFromIds(ids) {
    return (ids || [])
      .map((id) => docMap.get(id))
      .filter(Boolean)
      .filter(isVisible);
  }

  function renderJourneyDoc(doc) {
    return `
      <a class="journey-doc" href="${routeForDoc(doc.id)}">
        <span class="journey-doc-kicker">${escapeHtml(humanizeSegment(doc.folderKey || ""))}</span>
        <strong>${escapeHtml(doc.title)}</strong>
        <p>${escapeHtml(doc.shortExcerpt || doc.excerpt || "")}</p>
      </a>
    `;
  }

  function renderJourneyGroup(group, index) {
    const docs = docsFromIds(group.docIds);
    if (!docs.length) {
      return "";
    }

    const leadDoc = (group.leadDocId && docMap.get(group.leadDocId) && isVisible(docMap.get(group.leadDocId)))
      ? docMap.get(group.leadDocId)
      : docs[0];
    const indexLabel = String(index + 1).padStart(2, "0");

    return `
      <article class="journey-group-card">
        <div class="journey-group-head">
          <span class="journey-group-index">${indexLabel}</span>
          <div class="journey-group-copy">
            <span class="doc-card-kicker">主阅读路径</span>
            <h3>${escapeHtml(group.title)}</h3>
            <p>${escapeHtml(group.description || "")}</p>
          </div>
          ${leadDoc ? `<a class="action-link journey-cta" href="${routeForDoc(leadDoc.id)}">${escapeHtml(group.cta || UI.enterDoc)}</a>` : ""}
        </div>
        <div class="journey-doc-grid">
          ${docs.map(renderJourneyDoc).join("")}
        </div>
      </article>
    `;
  }

  function renderSupplementalGroup(group) {
    const docs = docsFromIds(group.docIds);
    if (!docs.length) {
      return "";
    }

    const leadDoc = (group.leadDocId && docMap.get(group.leadDocId) && isVisible(docMap.get(group.leadDocId)))
      ? docMap.get(group.leadDocId)
      : docs[0];

    return `
      <article class="supplemental-group-card">
        <div class="journey-group-head supplemental">
          <div class="journey-group-copy">
            <span class="doc-card-kicker">辅助内容</span>
            <h3>${escapeHtml(group.title)}</h3>
            <p>${escapeHtml(group.description || "")}</p>
          </div>
          ${leadDoc ? `<a class="action-link journey-cta" href="${routeForDoc(leadDoc.id)}">${escapeHtml(group.cta || UI.enterDoc)}</a>` : ""}
        </div>
        <div class="journey-doc-grid compact">
          ${docs.map(renderJourneyDoc).join("")}
        </div>
      </article>
    `;
  }

  function renderCoCreateSection(section, heroStyle, leadDoc) {
    const journeyGroups = (section.journeyGroups || []).map((group, index) => renderJourneyGroup(group, index)).join("");
    const supplementalGroups = (section.supplementalGroups || []).map(renderSupplementalGroup).join("");
    const highlightedDocs = (section.keyHighlights || []).map(renderHighlightCard).join("");

    return `
      <div class="section-page co-create-section-page">
        <section class="section-hero directory-hero" ${heroStyle}>
          <div class="section-hero-card">
            <span class="doc-card-kicker">${escapeHtml(section.eyebrow)}</span>
            <h1>${escapeHtml(section.title)}</h1>
            <p>${escapeHtml(section.description)}</p>
            <div class="hero-actions">
              ${leadDoc ? `<a class="hero-button primary" href="${routeForDoc(leadDoc.id)}">${UI.readOverview}</a>` : ""}
              <a class="hero-button" href="#/">${UI.backHome}</a>
            </div>
          </div>
          <div class="section-hero-card side section-hero-side">
            <span class="doc-card-kicker">怎么读这一部分</span>
            <div class="reading-path compact">
              ${section.readingPath.map(renderReadingStep).join("")}
            </div>
          </div>
        </section>

        <section class="section-panel journey-panel">
          <div class="section-panel-head">
            <div>
              <span class="doc-card-kicker">Co-create Journey</span>
              <h2>共创阅读路径</h2>
              <p>先理解共创，再进入工作坊推进、关键会议与产出，最后用工具和案例把方法落到真实项目里。</p>
            </div>
          </div>
          <div class="journey-grid">
            ${journeyGroups}
          </div>
        </section>

        ${supplementalGroups ? `
          <section class="section-panel supplemental-panel">
            <div class="section-panel-head">
              <div>
                <span class="doc-card-kicker">Supplemental</span>
                <h2>辅助阅读</h2>
                <p>当你已经理解主路径后，可以再通过案例、工具与方法随笔，把共创方法带回日常工作。</p>
              </div>
            </div>
            <div class="supplemental-grid">
              ${supplementalGroups}
            </div>
          </section>
        ` : ""}

        <section class="spotlight-section compact-spotlight">
          <div class="section-panel-head">
            <div>
              <span class="doc-card-kicker">${UI.keyDirectory}</span>
              <h2>重点入口</h2>
              <p>如果你已经有明确目的，可以直接从下面几个高频入口进入。</p>
            </div>
          </div>
          <div class="highlight-grid section-highlight-grid">
            ${(section.keyHighlights || []).map(renderHighlightCard).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderHome() {
    const brand = visibleSection("brand");
    const coCreate = visibleSection("co-create");
    const systemMap = data.home.systemMapNodes || [];
    const quickAccess = data.home.quickAccessCards || [];

    els.viewRoot.innerHTML = `
      <div class="home-page home-index">
        <section class="home-hero" id="home-hero">
          <div class="home-hero-inner">
            <div class="home-hero-copy">
              <h1>${escapeHtml(data.home.definition || "")}</h1>
              <p>${escapeHtml("\u4ece\u91cd\u65b0\u5b9a\u4e49\u54c1\u724c\u5f00\u59cb\uff0c\u63a2\u7d22\u54c1\u724c\u5171\u521b\u77e5\u8bc6\u4f53\u7cfb")}</p>
            </div>
            <button class="home-scroll-hint" type="button" data-scroll-target="home-entry">
              <span>\u5411\u4e0b\u6eda\u52a8</span>
              <i aria-hidden="true"></i>
            </button>
          </div>
        </section>

        <section class="home-section dual-entry-section" id="home-entry">
          <div class="dual-entry-grid">
            <a class="dual-entry-card brand" href="#/brand">
              <div class="dual-entry-icon">${renderLineIcon("brand")}</div>
              <div class="dual-entry-copy">
                <h2>\u54c1\u724c</h2>
                <h3>\u7406\u89e3\u54c1\u724c\u7684\u672c\u8d28\u4e0e\u7cfb\u7edf</h3>
                <p>\u4ece\u54c1\u724c\u5b9a\u4e49\u51fa\u53d1\uff0c\u4e86\u89e3\u54c1\u724c\u4f20\u5efa\u7cfb\u7edf\uff0c\u4ee5\u53ca\u54c1\u724c\u5982\u4f55\u843d\u5230\u4ea7\u54c1\u4e0e\u4e1a\u52a1\u3002</p>
                <span class="dual-entry-button">\u8fdb\u5165\u54c1\u724c</span>
              </div>
            </a>
            <a class="dual-entry-card cocreate" href="#/co-create">
              <div class="dual-entry-icon">${renderLineIcon("cocreate")}</div>
              <div class="dual-entry-copy">
                <h2>\u5171\u521b</h2>
                <h3>\u638c\u63e1\u5171\u521b\u7684\u65b9\u6cd5\u4e0e\u5de5\u5177</h3>
                <p>\u4ece\u5de5\u4f5c\u574a\u51fa\u53d1\uff0c\u4e86\u89e3\u5171\u521b\u5de5\u4f5c\u6cd5\u3001\u5173\u952e\u5bf9\u8bdd\u548c\u73b0\u573a\u63a8\u8fdb\u5de5\u5177\u3002</p>
                <span class="dual-entry-button">\u8fdb\u5165\u5171\u521b</span>
              </div>
            </a>
          </div>
        </section>

        ${renderSystemMap(systemMap)}

        <section class="home-section quick-access-section" id="home-quick">
          <div class="home-section-head">
            <span class="home-section-kicker">Quick Access</span>
            <h2>\u5feb\u901f\u5165\u53e3</h2>
            <p>\u7ed9\u6709\u660e\u786e\u76ee\u6807\u7684\u8bfb\u8005\u4e00\u6761\u66f4\u77ed\u7684\u8def\u5f84\uff0c\u4e0d\u5fc5\u4e00\u5c42\u5c42\u70b9\u8fdb\u53bb\u3002</p>
          </div>
          <div class="quick-access-grid">
            ${quickAccess.map(renderQuickAccessCard).join("")}
          </div>
        </section>

        <footer class="home-footer">
          <div class="home-footer-main">\u54c1\u724c\u5171\u521b\u77e5\u8bc6\u5e93 \u00b7 \u4e9a\u6d32\u5403\u9762\u516c\u53f8</div>
          <div class="home-footer-meta">\u00a9 ${new Date().getFullYear()} Asia Chimian Company</div>
        </footer>
      </div>
    `;
  }

  function renderSystemMapOriginal(nodes) {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const findDocIdByRelative = (needle) => {
      const match = data.docs.find((doc) => doc.relativePath && doc.relativePath.includes(needle));
      return match ? match.id : "";
    };
    const hrefFor = (docId, fallback = "#/brand") => (docId ? routeForDoc(docId) : fallback);
    const mapAssetUrl = "./assets/extracted/system-map-original.svg";

    const relationDocId = findDocIdByRelative("10_品牌/10_品牌定义/12_品牌与消费者_利益相关者关系");
    const eraDocId = findDocIdByRelative("10_品牌/10_品牌定义/11_新一代品牌与时代变化");
    const interfaceDocId = findDocIdByRelative("10_品牌/30_品牌落地/44_产品与门店_场景_传播_运营接口");
    const definitionWriteDocId = findDocIdByRelative("10_品牌/10_品牌定义/15_品牌定义怎么写");
    const overviewDocId = findDocIdByRelative("10_品牌/20_品牌传建系统/20_品牌传建系统总览");

    const hotspots = [
      { className: "competitor", label: "竞争对手", href: hrefFor(relationDocId || eraDocId) },
      { className: "consumer", label: "消费者", href: hrefFor(relationDocId) },
      { className: "partner", label: "合作伙伴", href: hrefFor(relationDocId) },
      { className: "employee", label: "员工", href: hrefFor(nodeMap.get("person-system") && nodeMap.get("person-system").docId) },
      { className: "background", label: "背景", href: hrefFor(eraDocId || (nodeMap.get("definition") && nodeMap.get("definition").docId)) },
      { className: "product", label: "产品", href: hrefFor(nodeMap.get("product-system") && nodeMap.get("product-system").docId) },
      { className: "scenario", label: "场景", href: hrefFor(interfaceDocId || (nodeMap.get("channel-system") && nodeMap.get("channel-system").docId)) },
      { className: "channel", label: "渠道", href: hrefFor(nodeMap.get("channel-system") && nodeMap.get("channel-system").docId) },
      { className: "emotion", label: "情景", href: hrefFor(interfaceDocId || (nodeMap.get("channel-system") && nodeMap.get("channel-system").docId)) },
      { className: "communication", label: "品牌传播", href: hrefFor(nodeMap.get("communication-system") && nodeMap.get("communication-system").docId) },
      { className: "panorama", label: "全景", href: hrefFor(overviewDocId || (nodeMap.get("definition") && nodeMap.get("definition").docId)) },
      { className: "vision", label: "愿景", href: hrefFor(definitionWriteDocId || (nodeMap.get("construction-system") && nodeMap.get("construction-system").docId)) },
      { className: "operation", label: "品牌运营", href: hrefFor(nodeMap.get("operation-system") && nodeMap.get("operation-system").docId) },
      { className: "construction", label: "品牌建设", href: hrefFor(nodeMap.get("construction-system") && nodeMap.get("construction-system").docId) }
    ];

    const hotspotMarkup = hotspots
      .map(
        (item) => `
          <a class="system-hotspot ${item.className}" href="${item.href}" aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}">
            <span>${escapeHtml(item.label)}</span>
          </a>
        `
      )
      .join("");

    return `
      <section class="home-section system-section" id="home-system">
        <div class="home-section-head system-section-head">
          <div class="system-section-title-row">
            <h2>品牌传建系统</h2>
            <span class="system-map-hint">点击任一点进入对应知识页</span>
          </div>
        </div>
        <div class="system-map-wrap">
          <div class="system-map-original" style="--system-map-image:url('${escapeHtml(mapAssetUrl)}')">
            ${hotspotMarkup}
          </div>
        </div>
      </section>
    `;
  }

  function renderHomeV2() {
    const quickAccess = data.home.quickAccessCards || [];
    const brandLogoUrl = getAssetUrl("brand-logo") || "./assets/extracted/brand-logo.jpeg";
    const heroQuote = `
      品牌是利益相关者的<br>
      <span class="hero-accent">交互产物</span>，是<span class="hero-accent">价值创造</span><br>
      的总和。
    `;

    els.viewRoot.innerHTML = `
      <div class="home-page home-index home-index-v2">
        <section class="home-hero home-hero-v2" id="home-hero">
          <div class="home-masthead" data-home-masthead>
            <a class="home-masthead-brand" href="#/">
              <img class="home-masthead-logo" src="${escapeHtml(brandLogoUrl)}" alt="亚洲吃面">
              <span class="home-masthead-title">《品牌共创知识库》</span>
            </a>
            <div class="home-masthead-links">
              <a href="#/brand">品牌</a>
              <a href="#/co-create">共创</a>
            </div>
          </div>
          <div class="home-hero-inner home-hero-inner-v2">
            <div class="home-hero-copy home-hero-copy-v2">
              <h1>品牌是利益相关者的<span class="hero-accent">交互产物</span>，<br>是<span class="hero-accent">价值创造</span>的总和。</h1>
              <p>${escapeHtml("从重新定义品牌开始，探索品牌共创知识体系。")}</p>
            </div>
            <div class="dual-entry-grid dual-entry-grid-v2" id="home-entry">
              <a class="dual-entry-card brand" href="#/brand">
                <div class="dual-entry-icon">${renderLineIcon("brand")}</div>
                <div class="dual-entry-copy">
                  <h2>品牌</h2>
                  <h3>理解品牌的本质与系统</h3>
                  <p>从品牌定义出发，进入品牌传建系统，再看到品牌如何落到产品与业务。</p>
                  <span class="dual-entry-button">进入品牌</span>
                </div>
              </a>
              <a class="dual-entry-card cocreate" href="#/co-create">
                <div class="dual-entry-icon">${renderLineIcon("cocreate")}</div>
                <div class="dual-entry-copy">
                  <h2>共创</h2>
                  <h3>掌握共创的方法与推进方式</h3>
                  <p>从工作坊出发，进入关键对话、推进机制和共创工具，理解项目如何真正发生。</p>
                  <span class="dual-entry-button">进入共创</span>
                </div>
              </a>
            </div>
            <div class="home-scroll-cue" aria-hidden="true">
              <span>继续下滑</span>
              <strong>查看品牌传建系统</strong>
            </div>
          </div>
        </section>

        ${renderSystemMapOriginal(data.home.systemMapNodes || [])}

        <section class="home-section quick-access-section" id="home-quick">
          <div class="home-section-head">
            <span class="home-section-kicker">Quick Access</span>
            <h2>快速入口</h2>
            <p>如果你已经知道自己要找什么，可以从这里直接进入关键路径、工具和案例。</p>
          </div>
          <div class="quick-access-grid">
            ${quickAccess.map(renderQuickAccessCard).join("")}
          </div>
        </section>

        <footer class="home-footer">
          <div class="home-footer-main">品牌共创知识库 · 亚洲吃面公司</div>
          <div class="home-footer-meta">© ${new Date().getFullYear()} Asia Chimian Company</div>
        </footer>
      </div>
    `;
  }

  function renderSectionPage(sectionId) {
    const section = visibleSection(sectionId);
    if (!section) {
      renderHomeV2();
      return;
    }

    const assetUrl = getAssetUrl(section.heroAssetId);
    const heroStyle = assetUrl ? `style="--hero-image:url('${escapeHtml(assetUrl)}')"` : "";
    const leadDoc = section.leadDocId ? docMap.get(section.leadDocId) : null;

    if (sectionId === "co-create") {
      els.viewRoot.innerHTML = renderCoCreateSection(section, heroStyle, leadDoc);
      return;
    }

    els.viewRoot.innerHTML = `
      <div class="section-page">
        <section class="section-hero" ${heroStyle}>
          <div class="section-hero-card">
            <span class="doc-card-kicker">${escapeHtml(section.eyebrow)}</span>
            <h1>${escapeHtml(section.title)}</h1>
            <p>${escapeHtml(section.description)}</p>
            <div class="hero-actions">
              ${leadDoc ? `<a class="hero-button primary" href="${routeForDoc(leadDoc.id)}">${UI.readOverview}</a>` : ""}
              <a class="hero-button" href="#/">${UI.backHome}</a>
            </div>
          </div>
          <div class="section-hero-card side section-hero-side">
            <span class="doc-card-kicker">${UI.readingPath}</span>
            <div class="reading-path compact">
              ${section.readingPath.map(renderReadingStep).join("")}
            </div>
          </div>
        </section>

        <section class="spotlight-section">
          <div class="section-panel-head">
            <div>
              <span class="doc-card-kicker">${UI.keyDirectory}</span>
              <h2>${UI.keyDirectory}</h2>
              <p>${UI.keyDirectoryBody}</p>
            </div>
          </div>
          <div class="highlight-grid section-highlight-grid">
            ${(section.keyHighlights || []).map(renderHighlightCard).join("")}
          </div>
        </section>

        <div class="section-body">
          ${section.groups.map(renderGroup).join("")}
        </div>
      </div>
    `;
  }

  function renderCoCreateSectionV2(section, heroStyle, leadDoc) {
    const journeyGroups = (section.journeyGroups || []).map((group, index) => renderJourneyGroup(group, index)).join("");
    const supplementalGroups = (section.supplementalGroups || []).map(renderSupplementalGroup).join("");
    const highlightedDocs = (section.keyHighlights || []).map(renderHighlightCard).join("");

    return `
      <div class="section-page co-create-section-page">
        <section class="section-hero directory-hero" ${heroStyle}>
          <div class="section-hero-card">
            <span class="doc-card-kicker">${escapeHtml(section.eyebrow)}</span>
            <h1>${escapeHtml(section.title)}</h1>
            <p>${escapeHtml(section.description)}</p>
            <div class="hero-actions">
              ${leadDoc ? `<a class="hero-button primary" href="${routeForDoc(leadDoc.id)}">${UI.readOverview}</a>` : ""}
              <a class="hero-button" href="#/">${UI.backHome}</a>
            </div>
          </div>
          <div class="section-hero-card side section-hero-side">
            <span class="doc-card-kicker">阅读路径</span>
            <div class="reading-path compact">
              ${section.readingPath.map(renderReadingStep).join("")}
            </div>
          </div>
        </section>

        <section class="section-panel journey-panel">
          <div class="section-panel-head">
            <div>
              <span class="doc-card-kicker">Co-create Journey</span>
              <h2>共创阅读路径</h2>
              <p>先理解共创是什么，再进入工作坊推进、关键会议与产出，最后通过工具和案例把方法带回真实项目。</p>
            </div>
          </div>
          <div class="journey-grid">
            ${journeyGroups}
          </div>
        </section>

        ${highlightedDocs ? `
          <section class="spotlight-section compact-spotlight">
            <div class="section-panel-head">
              <div>
                <span class="doc-card-kicker">${UI.keyDirectory}</span>
                <h2>重点入口</h2>
                <p>如果你已经带着明确问题而来，可以直接从下面几个高频入口进入。</p>
              </div>
            </div>
            <div class="highlight-grid section-highlight-grid">
              ${highlightedDocs}
            </div>
          </section>
        ` : ""}

        ${supplementalGroups ? `
          <section class="section-panel supplemental-panel">
            <div class="section-panel-head">
              <div>
                <span class="doc-card-kicker">Supplemental</span>
                <h2>辅助阅读</h2>
                <p>当你已经理解主路径后，可以再通过案例、工具与方法随笔，把共创方法带回日常工作。</p>
              </div>
            </div>
            <div class="supplemental-grid">
              ${supplementalGroups}
            </div>
          </section>
        ` : ""}
      </div>
    `;
  }

  function renderSectionPageV2(sectionId) {
    const section = visibleSection(sectionId);
    if (!section) {
      renderHomeV2();
      return;
    }

    const assetUrl = getAssetUrl(section.heroAssetId);
    const heroStyle = assetUrl ? `style="--hero-image:url('${escapeHtml(assetUrl)}')"` : "";
    const leadDoc = section.leadDocId ? docMap.get(section.leadDocId) : null;

    if (sectionId === "co-create") {
      els.viewRoot.innerHTML = renderCoCreateSectionV2(section, heroStyle, leadDoc);
      return;
    }

    const { primary, support } = splitSectionGroups(section);
    const leadHighlights = (section.keyHighlights || []).map(renderHighlightCard).join("");
    const leadDescription = sectionId === "product"
      ? "从这几个入口先抓住产品主线，再进入完整正文，会更容易把品牌落地读顺。"
      : "先从这几个入口建立整体理解，再进入下面更完整的内容目录。";
    const primaryTitle = sectionId === "product" ? "主线内容" : "主体内容";
    const primaryBody = sectionId === "product"
      ? "按照这条顺序往下读，会更容易把产品放回品牌传建系统里理解。"
      : "先把主干内容读顺，再进入案例和工具，会更容易形成完整理解。";
    const supportBody = sectionId === "product"
      ? "案例与工具放在这里，帮助你把产品判断转成更具体的参考与动作。"
      : "案例、工具和延伸阅读放在这里，帮助你把主干判断转成更具体的学习与参考。";

    els.viewRoot.innerHTML = `
      <div class="section-page">
        <section class="section-hero directory-hero" ${heroStyle}>
          <div class="section-hero-card">
            <span class="doc-card-kicker">${escapeHtml(section.eyebrow)}</span>
            <h1>${escapeHtml(section.title)}</h1>
            <p>${escapeHtml(section.description)}</p>
            <div class="hero-actions">
              ${leadDoc ? `<a class="hero-button primary" href="${routeForDoc(leadDoc.id)}">${UI.readOverview}</a>` : ""}
              <a class="hero-button" href="#/">${UI.backHome}</a>
            </div>
          </div>
          <div class="section-hero-card side section-hero-side">
            <span class="doc-card-kicker">${UI.readingPath}</span>
            <div class="reading-path compact">
              ${section.readingPath.map(renderReadingStep).join("")}
            </div>
          </div>
        </section>

        ${leadHighlights ? `
          <section class="spotlight-section directory-lead-section">
            <div class="section-panel-head">
              <div>
                <span class="doc-card-kicker">${UI.keyDirectory}</span>
                <h2>重点入口</h2>
                <p>${leadDescription}</p>
              </div>
            </div>
            <div class="highlight-grid section-highlight-grid">
              ${leadHighlights}
            </div>
          </section>
        ` : ""}

        <div class="section-body directory-body">
          <section class="section-panel directory-panel">
            <div class="section-panel-head">
              <div>
                <span class="doc-card-kicker">Primary</span>
                <h2>${primaryTitle}</h2>
                <p>${primaryBody}</p>
              </div>
            </div>
            <div class="directory-group-stack">
              ${primary.map((group) => renderGroup(group, {
                variant: "primary-group",
                cta: sectionId === "product" ? "从这里进入" : UI.enterDoc,
                maxChars: sectionId === "product" ? 74 : 78
              })).join("")}
            </div>
          </section>

          ${support.length ? `
            <section class="section-panel directory-panel support-directory-panel">
              <div class="section-panel-head">
                <div>
                  <span class="doc-card-kicker">Supplemental</span>
                  <h2>辅助内容</h2>
                  <p>${supportBody}</p>
                </div>
              </div>
              <div class="directory-group-stack">
                ${support.map((group) => renderGroup(group, {
                  variant: "support-group",
                  cta: UI.enterDoc,
                  maxChars: 72
                })).join("")}
              </div>
            </section>
          ` : ""}
        </div>
      </div>
    `;
  }

  function breadcrumbHtml(doc) {
    const crumbs = [`<a href="#/">${UI.home}</a>`];
    if (doc.sectionId === "brand") {
      crumbs.push(`<a href="#/brand">${escapeHtml(sectionMap.get("brand").title)}</a>`);
    }
    if (doc.sectionId === "co-create") {
      crumbs.push(`<a href="#/co-create">${escapeHtml(sectionMap.get("co-create").title)}</a>`);
    }
    if (doc.isProductDoc) {
      crumbs.push(`<a href="#/product">${escapeHtml(sectionMap.get("product").title)}</a>`);
    }
    crumbs.push(`<span>${escapeHtml(doc.title)}</span>`);
    return crumbs.join('<span class="crumb-sep">/</span>');
  }

  function relatedDocsFor(doc) {
    return (doc.linkedDocIds || [])
      .map((docId) => docMap.get(docId))
      .filter(Boolean)
      .filter(isVisible)
      .slice(0, 6);
  }

  function categorizeDoc(doc) {
    if (!doc || !doc.relativePath) {
      return "page";
    }
    if (doc.relativePath.includes("/40_品牌案例/") || doc.relativePath.includes("/20_共创案例/")) {
      return "case";
    }
    if (doc.relativePath.includes("/50_品牌工具/") || doc.relativePath.includes("/30_共创工具/")) {
      return "tool";
    }
    return "page";
  }

  function relatedDocGroupsFor(doc) {
    const linked = relatedDocsFor(doc);
    const seen = new Set(linked.map((item) => item.id));
    const groups = { cases: [], tools: [], pages: [] };

    linked.forEach((item) => {
      const category = categorizeDoc(item);
      if (category === "case") {
        groups.cases.push(item);
      } else if (category === "tool") {
        groups.tools.push(item);
      } else {
        groups.pages.push(item);
      }
    });

    const supplemental = data.docs
      .filter((item) => item.id !== doc.id)
      .filter(isVisible)
      .filter((item) => !seen.has(item.id))
      .filter((item) => item.folderKey === doc.folderKey)
      .slice(0, Math.max(0, 3 - groups.pages.length));

    groups.pages.push(...supplemental);
    return groups;
  }

  function renderRailGroup(title, docs) {
    if (!docs || !docs.length) {
      return "";
    }
    return `
      <div class="rail-group">
        <div class="rail-group-title">${escapeHtml(title)}</div>
        <div class="rail-links">
          ${docs.map((item) => `<a class="rail-link" href="${routeForDoc(item.id)}">${escapeHtml(item.title)}</a>`).join("")}
        </div>
      </div>
    `;
  }

  function renderProtectedDoc(doc) {
    els.viewRoot.innerHTML = `
      <div class="protected-card">
        <span class="doc-card-kicker">${UI.internalLockedTitle}</span>
        <h1>${escapeHtml(doc.title)}</h1>
        <p>${UI.internalLockedBody}</p>
        <div class="hero-actions">
          <button class="hero-button primary" id="enableInternalButton" type="button">${UI.enableInternal}</button>
          <a class="hero-button" href="#/">${UI.backHome}</a>
        </div>
      </div>
    `;

    const button = document.getElementById("enableInternalButton");
    if (button) {
      button.addEventListener("click", function () {
        state.showInternal = true;
        localStorage.setItem("yamian-formal-show-internal", "1");
        els.internalToggle.checked = true;
        renderSearchResults();
        renderCurrentView();
      });
    }
  }

  function decorateDocHtml(html) {
    return String(html || "").replace(
      /<p>\s*(<img\b[^>]*alt="([^"]*)"[^>]*>)\s*<\/p>/gi,
      function (_match, imageTag, altText) {
        const caption = altText && altText.trim()
          ? `<figcaption>${escapeHtml(altText.trim())}</figcaption>`
          : "";
        return `<figure class="doc-figure"><div class="doc-figure-viewport">${imageTag}</div>${caption}</figure>`;
      }
    );
  }

  function renderDocPage(docId) {
    const doc = docMap.get(docId);
    if (!doc) {
      els.viewRoot.innerHTML = `
        <div class="protected-card">
          <span class="doc-card-kicker">Not Found</span>
          <h1>${UI.notFound}</h1>
          <p>${UI.notFoundBody}</p>
          <div class="hero-actions">
            <a class="hero-button primary" href="#/">${UI.backHome}</a>
          </div>
        </div>
      `;
      return;
    }

    if (!isVisible(doc)) {
      renderProtectedDoc(doc);
      return;
    }

    const assetId = doc.isProductDoc
      ? "product-scene"
      : doc.sectionId === "co-create"
        ? "co-create-space"
        : "brand-space";
    const assetUrl = getAssetUrl(assetId);
    const heroStyle = assetUrl ? `style="--hero-image:url('${escapeHtml(assetUrl)}')"` : "";
    const relatedGroups = relatedDocGroupsFor(doc);
    const moduleHref = sectionRouteForDoc(doc);
    const moduleTitle = sectionTitleForDoc(doc);
    const docSectionTitle = moduleTitle;
    const decoratedHtml = decorateDocHtml(doc.html);

    els.viewRoot.innerHTML = `
      <div class="doc-page">
        <section class="doc-hero" ${heroStyle}>
          <div class="doc-hero-copy">
            <div class="view-breadcrumb">${breadcrumbHtml(doc)}</div>
            <span class="doc-card-kicker">${escapeHtml(docSectionTitle)}</span>
            <h1>${escapeHtml(doc.title)}</h1>
            <p>${escapeHtml(doc.excerpt || "")}</p>
            <div class="back-links">
              <button class="hero-button subtle" type="button" data-go-back="${moduleHref}">${UI.backPrevious}</button>
              <a class="hero-button strong" href="${moduleHref}">${UI.backModule}：${escapeHtml(moduleTitle)}</a>
              <a class="hero-button" href="#/">${UI.backHome}</a>
              ${state.showInternal ? `<a class="hero-button subtle" href="${doc.sourceFileUrl}" target="_blank" rel="noreferrer">${UI.openSource}</a>` : ""}
            </div>
          </div>
        </section>

        <div class="doc-body-wrap">
          <article class="doc-body">
            <div class="doc-content">${decoratedHtml}</div>
          </article>
          <aside class="doc-rail">
            <section class="rail-card">
              <span class="doc-card-kicker">${UI.pageLocation}</span>
              <ul class="rail-list">
                <li>${UI.currentModule}：${escapeHtml(moduleTitle)}</li>
                <li>${UI.currentDirectory}：${escapeHtml(humanizeSegment(doc.folderKey || ""))}</li>
                <li>${escapeHtml(doc.relativePath)}</li>
                <li>${escapeHtml(doc.internal ? UI.internalDoc : UI.publicDoc)}</li>
              </ul>
            </section>
            <section class="rail-card">
              <span class="doc-card-kicker">${UI.relatedLinks}</span>
              ${renderRailGroup(UI.relatedCases, relatedGroups.cases)}
              ${renderRailGroup(UI.relatedTools, relatedGroups.tools)}
              ${renderRailGroup(UI.relatedPages, relatedGroups.pages)}
              ${!relatedGroups.cases.length && !relatedGroups.tools.length && !relatedGroups.pages.length ? `<div class="empty-state">${UI.noRelated}</div>` : ""}
            </section>
          </aside>
        </div>
      </div>
    `;
  }

  function updateActiveNav(route) {
    els.navButtons.forEach((button) => {
      button.classList.remove("active");

      if (button.dataset.route) {
        if (
          (button.dataset.route === "#/" && route.type === "home") ||
          (button.dataset.route === "#/brand" && route.type === "section" && route.sectionId === "brand") ||
          (button.dataset.route === "#/co-create" && route.type === "section" && route.sectionId === "co-create") ||
          (button.dataset.route === "#/product" && route.type === "section" && route.sectionId === "product")
        ) {
          button.classList.add("active");
        }
      }

      if (button.dataset.doc && route.type === "doc" && route.docId === button.dataset.doc) {
        button.classList.add("active");
      }
    });
  }

  function syncHomeMasthead() {
    const route = parseRoute();
    const masthead = document.querySelector("[data-home-masthead]");
    const shouldCondense = route.type === "home" && window.scrollY > 40;
    document.body.classList.toggle("home-scrolled", shouldCondense);
    if (masthead) {
      masthead.classList.toggle("is-condensed", shouldCondense);
    }
  }

  function renderCurrentView() {
    rememberRouteHistory();
    const route = parseRoute();
    document.body.classList.toggle("route-home", route.type === "home");
    document.body.classList.toggle("route-knowledge", route.type !== "home");
    if (route.type === "section") {
      renderSectionPageV2(route.sectionId);
    } else if (route.type === "doc") {
      renderDocPage(route.docId);
    } else {
      renderHomeV2();
    }

    updateActiveNav(route);
    renderFocusDirectory();
    renderSidebar();
    window.scrollTo({ top: 0, behavior: "auto" });
    syncHomeMasthead();
  }

  function bindEvents() {
    els.brandHomeButton.addEventListener("click", function () {
      window.location.hash = "#/";
    });

    els.searchInput.addEventListener("input", function (event) {
      state.query = event.target.value || "";
      renderSearchResults();
      renderSidebar();
    });

    els.internalToggle.checked = state.showInternal;
    els.internalToggle.addEventListener("change", function (event) {
      state.showInternal = Boolean(event.target.checked);
      localStorage.setItem("yamian-formal-show-internal", state.showInternal ? "1" : "0");
      renderSearchResults();
      renderCurrentView();
    });

    els.navButtons.forEach((button) => {
      button.addEventListener("click", function () {
        if (button.dataset.route) {
          window.location.hash = button.dataset.route;
        }
        if (button.dataset.doc) {
          window.location.hash = routeForDoc(button.dataset.doc);
        }
      });
    });

    els.viewRoot.addEventListener("click", function (event) {
      const backTrigger = event.target.closest("[data-go-back]");
      if (backTrigger) {
        const fallback = backTrigger.getAttribute("data-go-back") || "#/";
        const previous = previousRouteHash();
        event.preventDefault();
        window.location.hash = previous && previous !== (window.location.hash || "#/") ? previous : fallback;
        return;
      }

      const trigger = event.target.closest("[data-scroll-target]");
      if (!trigger) {
        return;
      }
      const targetId = trigger.getAttribute("data-scroll-target");
      if (!targetId) {
        return;
      }
      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    els.sidebarTree.addEventListener("toggle", function (event) {
      if (event.target instanceof HTMLDetailsElement) {
        persistSidebarState();
      }
    });

    window.addEventListener("scroll", syncHomeMasthead, { passive: true });
    window.addEventListener("hashchange", renderCurrentView);
  }

  function init() {
    if (els.brandLogo && getAssetUrl("brand-logo")) {
      els.brandLogo.src = getAssetUrl("brand-logo");
    }
    renderStats();
    renderSearchResults();
    renderCurrentView();
    bindEvents();
  }

  init();
})();
