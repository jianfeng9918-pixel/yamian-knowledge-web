import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = __dirname;
const projectRoot = path.resolve(siteRoot, "..");
const contentRoot = path.resolve(projectRoot, "..", "\u4e9a\u9762\u77e5\u8bc6\u5185\u5bb9");

const outputFile = path.join(siteRoot, "site-data.js");
const assetJsFile = path.join(siteRoot, "asset-manifest.js");
const assetJsonFile = path.join(siteRoot, "asset-manifest.json");
const assetsDir = path.join(siteRoot, "assets", "extracted");

const EXCLUDED_DIRS = new Set([
  "_\u672c\u5730\u7f51\u9875\u9884\u89c8",
  "_\u672c\u5730\u6b63\u5f0f\u7248\u7f51\u7ad9",
  "_asset_probe",
  "node_modules",
  ".git"
]);

const UI = {
  homeDefinition:
    "\u54c1\u724c\u662f\u5229\u76ca\u76f8\u5173\u8005\u7684\u4ea4\u4e92\u4ea7\u7269\uff0c\u662f\u4ef7\u503c\u521b\u9020\u7684\u603b\u548c\u3002",
  homeSummary:
    "\u4ee5\u54c1\u724c\u4e3a\u8d77\u70b9\uff0c\u628a\u5171\u521b\u3001\u4ea7\u54c1\u3001\u6848\u4f8b\u4e0e\u5de5\u5177\u8fde\u6210\u4e00\u4e2a\u53ef\u76f4\u63a5\u9605\u8bfb\u7684\u77e5\u8bc6\u7cfb\u7edf\u3002",
  brandSection:
    "\u5148\u628a\u54c1\u724c\u5b9a\u4e49\u8bb2\u6e05\u695a\uff0c\u518d\u8fdb\u5165\u54c1\u724c\u4f20\u5efa\u7cfb\u7edf\u3001\u54c1\u724c\u843d\u5730\u3001\u6848\u4f8b\u4e0e\u5de5\u5177\u3002",
  coCreateSection:
    "\u901a\u8fc7\u5de5\u4f5c\u574a\u3001\u5173\u952e\u5bf9\u8bdd\u3001\u6848\u4f8b\u4e0e\u5de5\u5177\uff0c\u628a\u54c1\u724c\u95ee\u9898\u771f\u6b63\u63a8\u8fdb\u6210\u5171\u540c\u5de5\u4f5c\u3002",
  productSection:
    "\u4ece\u54c1\u724c\u843d\u5730\u91cc\u6700\u91cd\u8981\u7684\u4e00\u6761\u4e3b\u7ebf\u8fdb\u5165\uff0c\u7406\u89e3\u4ea7\u54c1\u5982\u4f55\u6210\u4e3a\u54c1\u724c\u7684\u73b0\u5b9e\u627f\u8f7d\u3002",
  qBrand: "\u5148\u7406\u89e3\u54c1\u724c\u662f\u4ec0\u4e48",
  qCoCreate: "\u518d\u7406\u89e3\u600e\u4e48\u63a8\u8fdb\u5171\u521b",
  qProduct: "\u4ece\u4ea7\u54c1\u4e3b\u7ebf\u5feb\u901f\u8fdb\u5165",
  qCases: "\u901a\u8fc7\u6848\u4f8b\u7406\u89e3\u65b9\u6cd5\u6210\u7acb",
  qTools: "\u76f4\u63a5\u62ff\u5de5\u5177\u5f00\u59cb\u5224\u65ad",
  brandGroups: {
    "10_": "\u7406\u89e3\u54c1\u724c\u662f\u4ec0\u4e48\uff0c\u4ee5\u53ca\u54c1\u724c\u4e3a\u4ec0\u4e48\u8981\u88ab\u91cd\u65b0\u5b9a\u4e49\u3002",
    "20_": "\u901a\u8fc7\u516d\u8981\u7d20\u548c\u7cfb\u7edf\u539f\u7406\u7406\u89e3\u54c1\u724c\u5982\u4f55\u534f\u540c\u6210\u7acb\u3002",
    "30_": "\u628a\u54c1\u724c\u7ffb\u8bd1\u6210\u4ea7\u54c1\u3001\u573a\u666f\u3001\u4f20\u64ad\u4e0e\u8fd0\u8425\u4e2d\u7684\u5177\u4f53\u52a8\u4f5c\u3002",
    "40_": "\u901a\u8fc7\u62bd\u8c61\u6848\u4f8b\u4e0e\u53c2\u7167\u54c1\u724c\u770b\u8fd9\u5957\u5224\u65ad\u5982\u4f55\u6210\u7acb\u3002",
    "50_": "\u628a\u5224\u65ad\u548c\u7ed3\u6784\u53d8\u6210\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u7684\u5de5\u4f5c\u5de5\u5177\u3002"
  },
  coCreateGroups: {
    "10_": "\u7406\u89e3\u5171\u521b\u662f\u4ec0\u4e48\uff0c\u5de5\u4f5c\u574a\u4e3a\u4ec0\u4e48\u4e0d\u662f\u666e\u901a\u4f1a\u8bae\u3002",
    "20_": "\u628a\u9879\u76ee\u7ecf\u9a8c\u8131\u654f\u540e\u6574\u7406\u6210\u53ef\u590d\u7528\u7684\u65b9\u6cd5\u4e0e\u5224\u65ad\u3002",
    "30_": "\u73b0\u573a\u63a8\u8fdb\u771f\u6b63\u4f1a\u7528\u5230\u7684\u56fe\u3001\u8868\u3001\u6846\u67b6\u548c\u5de5\u4f5c\u6cd5\u3002",
    "40_": "\u4ee5\u66f4\u8f7b\u7684\u65b9\u5f0f\u7406\u89e3\u4e9a\u9762\u7684\u7ec4\u7ec7\u89c2\u3001\u5de5\u4f5c\u89c2\u548c\u65b9\u6cd5\u89c2\u3002"
  },
  productGroups: {
    main: "\u4ece\u603b\u89c8\u5230\u7ed3\u6784\u3001\u8bca\u65ad\u548c\u63a5\u53e3\uff0c\u5efa\u7acb\u8fde\u7eed\u7684\u4ea7\u54c1\u9605\u8bfb\u8def\u5f84\u3002",
    evidence:
      "\u901a\u8fc7\u6848\u4f8b\u548c\u53c2\u7167\u54c1\u724c\uff0c\u770b\u4ea7\u54c1\u5982\u4f55\u6210\u4e3a\u54c1\u724c\u7684\u7b2c\u4e00\u73b0\u573a\u3002",
    tools:
      "\u4ece\u5224\u65ad\u5230\u7ed3\u6784\u642d\u5efa\uff0c\u7406\u89e3\u4ea7\u54c1\u9875\u6700\u5e38\u8df3\u8f6c\u7684\u5de5\u5177\u3002"
  }
};

marked.setOptions({
  gfm: true,
  breaks: false
});

function toPosix(value) {
  return value.replace(/\\/g, "/");
}

function normalizeFile(value) {
  return path.normalize(value);
}

function slugFromRelative(relativePath) {
  return toPosix(relativePath).replace(/\.md$/i, "");
}

function humanizeSegment(segment) {
  return segment
    .replace(/\.md$/i, "")
    .replace(/^\d+_/, "")
    .replace(/^【需内部】/, "")
    .replace(/_/g, " / ");
}

function extractTitle(markdown, fallbackName) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : humanizeSegment(fallbackName);
}

function stripBom(markdown) {
  return markdown.replace(/^\uFEFF/, "");
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toFileUrl(filePath) {
  return `file:///${encodeURI(toPosix(filePath))}`;
}

function addLinkTargets(html) {
  return html.replace(
    /<a href="(https?:\/\/[^"]+)">/g,
    '<a href="$1" target="_blank" rel="noreferrer">'
  );
}

function buildBreadcrumbs(relativePath) {
  const parts = toPosix(relativePath).split("/");
  return parts.map((part, index) => ({
    label: humanizeSegment(part),
    raw: part,
    level: index
  }));
}

async function walkMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(absolutePath);
    }
  }

  return files;
}

function collectInternalLinks(markdown, sourceFile, slugMap) {
  const linkedDocIds = new Set();
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match = regex.exec(markdown);

  while (match) {
    const href = match[2];
    if (!/^(https?:|#|mailto:|javascript:)/i.test(href) && href.toLowerCase().includes(".md")) {
      const hashIndex = href.indexOf("#");
      const targetPath = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
      const targetAbsolute = normalizeFile(path.resolve(path.dirname(sourceFile), targetPath));
      const targetSlug = slugMap.get(targetAbsolute);
      if (targetSlug) {
        linkedDocIds.add(targetSlug);
      }
    }
    match = regex.exec(markdown);
  }

  return [...linkedDocIds];
}

function rewriteMarkdownLinks(markdown, sourceFile, slugMap) {
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (fullMatch, text, href) => {
    if (/^(https?:|#|mailto:|javascript:)/i.test(href)) {
      return fullMatch;
    }

    const hashIndex = href.indexOf("#");
    const targetPath = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
    if (!targetPath.toLowerCase().endsWith(".md")) {
      return fullMatch;
    }

    const targetAbsolute = normalizeFile(path.resolve(path.dirname(sourceFile), targetPath));
    const targetSlug = slugMap.get(targetAbsolute);
    if (!targetSlug) {
      return fullMatch;
    }

    return `[${text}](#/doc/${encodeURIComponent(targetSlug)})`;
  });
}

function resolveSectionId(relativePath) {
  const first = relativePath.split("/")[0];
  if (first.startsWith("10_")) {
    return "brand";
  }
  if (first.startsWith("20_")) {
    return "co-create";
  }
  if (first.startsWith("90_")) {
    return "internal";
  }
  return "entry";
}

function resolveFolderKey(relativePath) {
  const parts = toPosix(relativePath).split("/");
  return parts.length > 1 ? parts[1] : parts[0];
}

function sortDocs(a, b) {
  return a.relativePath.localeCompare(b.relativePath, "zh-CN");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function pathBase(relativePath) {
  return path.posix.basename(relativePath);
}

function findTopLevel(docs, prefix) {
  return unique(docs.map((doc) => doc.relativePath.split("/")[0])).find((name) => name.startsWith(prefix));
}

function findSecondLevel(docs, topLevel, prefix) {
  return unique(
    docs
      .filter((doc) => doc.relativePath.startsWith(`${topLevel}/`))
      .map((doc) => doc.relativePath.split("/")[1])
  ).find((name) => name && name.startsWith(prefix));
}

function findDocId(docs, predicate) {
  const doc = docs.find(predicate);
  return doc ? doc.id : null;
}

function groupDocsByFolder(docs, folderNames) {
  return folderNames.map((folderName) => ({
    folderName,
    docs: docs.filter((doc) => doc.folderKey === folderName)
  }));
}

function resolveAssetSourceFiles() {
  return fs.readdir(contentRoot).then((files) => {
    const businessDeck = files.find((name) => /^2026.*\.pptx$/i.test(name));
    const onboardingDeck = files.find((name) => /v05_201124\.pptx$/i.test(name));

    if (!businessDeck || !onboardingDeck) {
      throw new Error("Unable to locate PPTX sources for visual assets.");
    }

    return {
      businessDeck: path.join(contentRoot, businessDeck),
      onboardingDeck: path.join(contentRoot, onboardingDeck)
    };
  });
}

async function prepareAssets(sourceFiles) {
  await fs.mkdir(assetsDir, { recursive: true });

  const baseAssets = [
    {
      id: "brand-logo",
      title: "\u4e9a\u9762 Logo",
      usage: "header logo",
      group: "identity",
      slot: "logo",
      sourceFile: sourceFiles.businessDeck,
      entryName: "ppt/media/image1.jpeg",
      outputName: "brand-logo.jpeg"
    },
    {
      id: "hero-cover",
      title: "\u9996\u9875\u54c1\u724c\u4fe1\u53f7\u56fe",
      usage: "home hero",
      group: "hero",
      slot: "home-cover",
      sourceFile: sourceFiles.businessDeck,
      entryName: "ppt/media/image13.png",
      outputName: "hero-cover.png"
    },
    {
      id: "company-profile",
      title: "\u516c\u53f8\u4ecb\u7ecd\u4e0e\u54c1\u724c\u6c14\u8d28\u56fe",
      usage: "brand content image",
      group: "content",
      slot: "company-profile",
      sourceFile: sourceFiles.businessDeck,
      entryName: "ppt/media/image12.jpeg",
      outputName: "company-profile.jpeg"
    },
    {
      id: "co-create-space",
      title: "\u5171\u521b\u7a7a\u95f4\u56fe",
      usage: "co-create hero",
      group: "section",
      slot: "co-create-hero",
      sourceFile: sourceFiles.onboardingDeck,
      entryName: "ppt/media/image8.png",
      outputName: "co-create-space.png"
    },
    {
      id: "brand-space",
      title: "\u54c1\u724c\u7a7a\u95f4\u4e0e\u95e8\u5e97\u56fe",
      usage: "brand hero",
      group: "section",
      slot: "brand-hero",
      sourceFile: sourceFiles.onboardingDeck,
      entryName: "ppt/media/image9.png",
      outputName: "brand-space.png"
    },
    {
      id: "product-scene",
      title: "\u4ea7\u54c1\u73b0\u573a\u56fe",
      usage: "product hero",
      group: "section",
      slot: "product-hero",
      sourceFile: sourceFiles.onboardingDeck,
      entryName: "ppt/media/image13.jpeg",
      outputName: "product-scene.jpeg"
    }
  ];

  const manifest = {};

  for (const asset of baseAssets) {
    const zip = new AdmZip(asset.sourceFile);
    const entry = zip.getEntry(asset.entryName);
    if (!entry) {
      throw new Error(`Asset entry not found: ${asset.entryName}`);
    }

    const outputPath = path.join(assetsDir, asset.outputName);
    await fs.writeFile(outputPath, entry.getData());

    manifest[asset.id] = {
      id: asset.id,
      title: asset.title,
      usage: asset.usage,
      group: asset.group,
      slot: asset.slot,
      sourceFile: asset.sourceFile,
      entryName: asset.entryName,
      relativePath: toPosix(path.relative(siteRoot, outputPath)),
      publicPath: `./${toPosix(path.relative(siteRoot, outputPath))}`
    };
  }

  const aliases = [
    {
      id: "home-brand-spotlight",
      title: "\u9996\u9875\u54c1\u724c\u805a\u7126\u56fe",
      usage: "home content image",
      group: "content",
      slot: "home-brand",
      sourceId: "company-profile"
    },
    {
      id: "home-cocreate-spotlight",
      title: "\u9996\u9875\u5171\u521b\u805a\u7126\u56fe",
      usage: "home content image",
      group: "content",
      slot: "home-co-create",
      sourceId: "co-create-space"
    },
    {
      id: "home-product-spotlight",
      title: "\u9996\u9875\u4ea7\u54c1\u805a\u7126\u56fe",
      usage: "home content image",
      group: "content",
      slot: "home-product",
      sourceId: "product-scene"
    },
    {
      id: "brand-section-detail",
      title: "\u54c1\u724c\u677f\u5757\u5185\u5bb9\u56fe",
      usage: "section content image",
      group: "content",
      slot: "brand-section-detail",
      sourceId: "brand-space"
    },
    {
      id: "co-create-section-detail",
      title: "\u5171\u521b\u677f\u5757\u5185\u5bb9\u56fe",
      usage: "section content image",
      group: "content",
      slot: "co-create-section-detail",
      sourceId: "co-create-space"
    },
    {
      id: "product-section-detail",
      title: "\u4ea7\u54c1\u677f\u5757\u5185\u5bb9\u56fe",
      usage: "section content image",
      group: "content",
      slot: "product-section-detail",
      sourceId: "product-scene"
    }
  ];

  for (const alias of aliases) {
    const source = manifest[alias.sourceId];
    manifest[alias.id] = {
      id: alias.id,
      title: alias.title,
      usage: alias.usage,
      group: alias.group,
      slot: alias.slot,
      sourceId: alias.sourceId,
      sourceFile: source.sourceFile,
      entryName: source.entryName,
      relativePath: source.relativePath,
      publicPath: source.publicPath
    };
  }

  await fs.writeFile(assetJsonFile, JSON.stringify(manifest, null, 2), "utf8");
  await fs.writeFile(assetJsFile, `window.KB_ASSETS = ${JSON.stringify(manifest, null, 2)};\n`, "utf8");

  return manifest;
}

function highlight(docId, eyebrow, blurb, cta, assetId) {
  return {
    docId,
    eyebrow,
    blurb,
    cta,
    assetId
  };
}

function buildSections(docs) {
  const brandTop = findTopLevel(docs, "10_");
  const coCreateTop = findTopLevel(docs, "20_");
  const entryTop = findTopLevel(docs, "00_");

  const brandDefinitionFolder = findSecondLevel(docs, brandTop, "10_");
  const brandSystemFolder = findSecondLevel(docs, brandTop, "20_");
  const brandLandingFolder = findSecondLevel(docs, brandTop, "30_");
  const brandCaseFolder = findSecondLevel(docs, brandTop, "40_");
  const brandToolFolder = findSecondLevel(docs, brandTop, "50_");

  const coCreateFoundationFolder = findSecondLevel(docs, coCreateTop, "10_");
  const coCreateCaseFolder = findSecondLevel(docs, coCreateTop, "20_");
  const coCreateToolFolder = findSecondLevel(docs, coCreateTop, "30_");
  const coCreateNotesFolder = findSecondLevel(docs, coCreateTop, "40_");

  const featured = {
    home: findDocId(
      docs,
      (doc) => doc.relativePath.startsWith(`${entryTop}/`) && pathBase(doc.relativePath).startsWith("00_")
    ),
    brand: findDocId(
      docs,
      (doc) => doc.relativePath.startsWith(`${brandTop}/`) && doc.relativePath.split("/").length === 2
    ),
    coCreate: findDocId(
      docs,
      (doc) =>
        doc.relativePath.startsWith(`${coCreateTop}/`) &&
        doc.relativePath.split("/").length === 2 &&
        pathBase(doc.relativePath).startsWith("20_")
    ),
    product: findDocId(
      docs,
      (doc) =>
        doc.relativePath.startsWith(`${brandTop}/${brandLandingFolder}/`) &&
        pathBase(doc.relativePath).startsWith("41_")
    ),
    cases: findDocId(
      docs,
      (doc) =>
        doc.relativePath.startsWith(`${brandTop}/${brandCaseFolder}/`) &&
        pathBase(doc.relativePath).startsWith("50_")
    ),
    tools: findDocId(
      docs,
      (doc) =>
        doc.relativePath.startsWith(`${brandTop}/${brandToolFolder}/`) &&
        pathBase(doc.relativePath).startsWith("60_")
    )
  };

  const brandDefinitionOverviewId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandDefinitionFolder}/`) &&
      pathBase(doc.relativePath).startsWith("10_")
  );
  const brandSystemOverviewId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandSystemFolder}/`) &&
      pathBase(doc.relativePath).startsWith("20_")
  );
  const brandLandingOverviewId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandLandingFolder}/`) &&
      pathBase(doc.relativePath).startsWith("40_")
  );
  const coCreateWorkOverviewId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("30_")
  );
  const coCreateWorkshopId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("32_")
  );
  const coCreateToolsIndexId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateToolFolder}/`) &&
      pathBase(doc.relativePath).startsWith("30_")
  );
  const coCreateCasesIndexId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateCaseFolder}/`) &&
      pathBase(doc.relativePath).startsWith("20_")
  );
  const coCreateDialogueId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("35_")
  );
  const coCreateOutputsId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("36_")
  );
  const coCreateWhyWorkshopId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("37_")
  );
  const coCreateDefinitionWorkshopId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("39_")
  );
  const coCreateDiscoveryWorkshopId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("45_")
  );
  const coCreateAlignmentId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("46_")
  );
  const coCreateDifferenceId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("47_")
  );
  const coCreateStakeholderId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("33_")
  );
  const coCreateLanguageId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("34_")
  );
  const coCreateJourneyToolId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateToolFolder}/`) &&
      pathBase(doc.relativePath).startsWith("63_")
  );
  const coCreateKickoffToolId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateToolFolder}/`) &&
      pathBase(doc.relativePath).startsWith("72_")
  );
  const coCreateNotesIndexId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateNotesFolder}/`) &&
      pathBase(doc.relativePath).startsWith("80_")
  );
  const productStructureId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandLandingFolder}/`) &&
      pathBase(doc.relativePath).startsWith("43_")
  );
  const productProblemId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandLandingFolder}/`) &&
      pathBase(doc.relativePath).startsWith("47_")
  );
  const personSystemId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandSystemFolder}/`) &&
      pathBase(doc.relativePath).startsWith("21_")
  );
  const productSystemId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandSystemFolder}/`) &&
      pathBase(doc.relativePath).startsWith("22_")
  );
  const channelSystemId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandSystemFolder}/`) &&
      pathBase(doc.relativePath).startsWith("23_")
  );
  const communicationSystemId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandSystemFolder}/`) &&
      pathBase(doc.relativePath).startsWith("24_")
  );
  const constructionSystemId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandSystemFolder}/`) &&
      pathBase(doc.relativePath).startsWith("25_")
  );
  const operationSystemId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandSystemFolder}/`) &&
      pathBase(doc.relativePath).startsWith("26_")
  );
  const innovationSpiralId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("41_")
  );
  const growthPathId = findDocId(
    docs,
    (doc) =>
      doc.relativePath.startsWith(`${coCreateTop}/${coCreateFoundationFolder}/`) &&
      pathBase(doc.relativePath).startsWith("31_")
  );

  const brandGroups = groupDocsByFolder(
    docs.filter((doc) => doc.sectionId === "brand"),
    [brandDefinitionFolder, brandSystemFolder, brandLandingFolder, brandCaseFolder, brandToolFolder]
  )
    .filter((group) => group.folderName && group.docs.length > 0)
    .map((group) => ({
      id: group.folderName,
      title: humanizeSegment(group.folderName),
      description: UI.brandGroups[group.folderName.slice(0, 3)] || "",
      docs: group.docs
    }));

  const coCreateGroups = groupDocsByFolder(
    docs.filter((doc) => doc.sectionId === "co-create"),
    [coCreateFoundationFolder, coCreateCaseFolder, coCreateToolFolder, coCreateNotesFolder]
  )
    .filter((group) => group.folderName && group.docs.length > 0)
    .map((group) => ({
      id: group.folderName,
      title: humanizeSegment(group.folderName),
      description: UI.coCreateGroups[group.folderName.slice(0, 3)] || "",
      docs: group.docs
    }));

  const coCreateJourneyGroups = [
    {
      id: "co-create-foundation",
      title: "先理解共创是什么",
      description: "先把共创的目的、角色和它与普通开会的区别讲清楚，再进入具体推进方式。",
      cta: "先读总论",
      leadDocId: featured.coCreate || coCreateWorkOverviewId,
      docIds: [featured.coCreate, coCreateWorkOverviewId, coCreateWhyWorkshopId, coCreateStakeholderId].filter(Boolean)
    },
    {
      id: "co-create-workshops",
      title: "再看工作坊如何推进",
      description: "围绕发现与定义两类关键工作坊，理解问题如何被识别、被聚焦、被变成行动。",
      cta: "看工作坊",
      leadDocId: coCreateDiscoveryWorkshopId || coCreateDefinitionWorkshopId,
      docIds: [coCreateDiscoveryWorkshopId, coCreateDefinitionWorkshopId, coCreateWorkshopId].filter(Boolean)
    },
    {
      id: "co-create-alignment",
      title: "再看关键会议与产出",
      description: "把需求对齐、项目启动和工作坊产出物连起来，看推进链如何真正落到项目里。",
      cta: "看关键会议",
      leadDocId: coCreateAlignmentId || coCreateDifferenceId,
      docIds: [coCreateAlignmentId, coCreateDifferenceId, coCreateOutputsId, coCreateDialogueId].filter(Boolean)
    },
    {
      id: "co-create-evidence",
      title: "最后看工具和案例",
      description: "通过工具与匿名项目经验，理解共创怎样服务品牌传建系统，而不只是服务一场会议。",
      cta: "看工具与案例",
      leadDocId: coCreateToolsIndexId || coCreateCasesIndexId,
      docIds: [coCreateToolsIndexId, coCreateCasesIndexId, coCreateJourneyToolId, coCreateKickoffToolId].filter(Boolean)
    }
  ];

  const coCreateSupplementalGroups = [
    {
      id: "co-create-supplemental",
      title: "延伸阅读与方法随笔",
      description: "当你已经理解共创主线后，可以再读这些方法观察和组织思考，帮助你把方法带回日常工作。",
      cta: "进入延伸阅读",
      leadDocId: coCreateNotesIndexId,
      docIds: [coCreateNotesIndexId, coCreateLanguageId].filter(Boolean)
    }
  ];

  const productMain = docs.filter(
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandLandingFolder}/`) &&
      ["40_", "41_", "42_", "43_", "44_", "47_"].some((prefix) => pathBase(doc.relativePath).startsWith(prefix))
  );
  const productEvidence = docs.filter(
    (doc) =>
      doc.relativePath.startsWith(`${brandTop}/${brandCaseFolder}/`) &&
      ["50_", "51_", "52_", "61_", "64_", "65_"].some((prefix) => pathBase(doc.relativePath).startsWith(prefix))
  );
  const productTools = docs.filter(
    (doc) =>
      (doc.relativePath.startsWith(`${brandTop}/${brandToolFolder}/`) &&
        ["61_", "62_", "71_"].some((prefix) => pathBase(doc.relativePath).startsWith(prefix))) ||
      (doc.relativePath.startsWith(`${coCreateTop}/${coCreateToolFolder}/`) &&
        pathBase(doc.relativePath).startsWith("70_"))
  );

  const brandTitle = humanizeSegment(brandTop);
  const coCreateTitle = humanizeSegment(coCreateTop);

  const sections = [
    {
      id: "brand",
      title: brandTitle,
      eyebrow: "Brand",
      description: UI.brandSection,
      heroAssetId: "brand-space",
      leadDocId: featured.brand,
      readingPath: [
        featured.brand,
        brandDefinitionOverviewId,
        brandSystemOverviewId,
        featured.product
      ].filter(Boolean),
      keyHighlights: [
        highlight(
          brandDefinitionOverviewId,
          "\u54c1\u724c\u5b9a\u4e49",
          "\u5148\u628a\u54c1\u724c\u662f\u4ec0\u4e48\u8bb2\u6e05\u695a\u3002",
          "\u5148\u770b\u5b9a\u4e49",
          "home-brand-spotlight"
        ),
        highlight(
          brandSystemOverviewId,
          "\u54c1\u724c\u4f20\u5efa\u7cfb\u7edf",
          "\u7528\u516d\u8981\u7d20\u770b\u54c1\u724c\u5982\u4f55\u534f\u540c\u6210\u7acb\u3002",
          "\u770b\u7cfb\u7edf",
          "brand-section-detail"
        ),
        highlight(
          featured.product,
          "\u4ea7\u54c1\u5373\u54c1\u724c",
          "\u4ece\u6700\u91cd\u8981\u7684\u843d\u5730\u4e3b\u7ebf\u8fdb\u5165\u3002",
          "\u4ece\u4ea7\u54c1\u8fdb\u5165",
          "home-product-spotlight"
        )
      ],
      primaryGroupIds: [brandDefinitionFolder, brandSystemFolder, brandLandingFolder],
      supportGroupIds: [brandCaseFolder, brandToolFolder],
      groups: brandGroups
    },
    {
      id: "co-create",
      title: coCreateTitle,
      eyebrow: "Co-create",
      description: UI.coCreateSection,
      heroAssetId: "co-create-space",
      leadDocId: featured.coCreate,
      readingPath: [
        featured.coCreate,
        coCreateWorkOverviewId,
        coCreateWorkshopId,
        coCreateCasesIndexId
      ].filter(Boolean),
      keyHighlights: [
        highlight(
          coCreateWorkOverviewId,
          "\u5171\u521b\u603b\u8bba",
          "\u5148\u7406\u89e3\u4e3a\u4ec0\u4e48\u8981\u7528\u5171\u521b\u800c\u4e0d\u662f\u53ea\u5f00\u4f1a\u3002",
          "\u5148\u770b\u5171\u521b",
          "home-cocreate-spotlight"
        ),
        highlight(
          coCreateWorkshopId,
          "\u5de5\u4f5c\u574a\u4f53\u7cfb",
          "\u770b\u53d1\u73b0\u3001\u5b9a\u4e49\u4e0e\u5173\u952e\u4f1a\u8bae\u600e\u4e48\u4e32\u8d77\u6765\u3002",
          "\u770b\u5de5\u4f5c\u574a",
          "co-create-section-detail"
        ),
        highlight(
          coCreateToolsIndexId,
          "\u5171\u521b\u5de5\u5177",
          "\u76f4\u63a5\u8fdb\u5165\u73b0\u573a\u63a8\u8fdb\u771f\u6b63\u4f1a\u7528\u5230\u7684\u5de5\u5177\u3002",
          "\u770b\u5de5\u5177",
          "co-create-section-detail"
        )
      ],
      primaryGroupIds: [coCreateFoundationFolder],
      supportGroupIds: [coCreateCaseFolder, coCreateToolFolder, coCreateNotesFolder],
      journeyGroups: coCreateJourneyGroups,
      supplementalGroups: coCreateSupplementalGroups,
      groups: coCreateGroups
    },
    {
      id: "product",
      title: "\u4ea7\u54c1",
      eyebrow: "Product",
      description: UI.productSection,
      heroAssetId: "product-scene",
      leadDocId: featured.product,
      readingPath: [
        brandLandingOverviewId,
        featured.product,
        productStructureId
      ].filter(Boolean),
      keyHighlights: [
        highlight(
          featured.product,
          "\u4ea7\u54c1\u603b\u89c8",
          "\u5148\u7406\u89e3\u4ea7\u54c1\u4e3a\u4ec0\u4e48\u662f\u54c1\u724c\u7684\u7b2c\u4e00\u73b0\u573a\u3002",
          "\u5148\u770b\u4ea7\u54c1",
          "home-product-spotlight"
        ),
        highlight(
          productStructureId,
          "\u7ed3\u6784\u4e0e\u4e0a\u5e02",
          "\u770b\u4ea7\u54c1\u7ed3\u6784\u3001\u83dc\u5355\u903b\u8f91\u548c\u4e0a\u5e02\u5982\u4f55\u8fde\u6210\u4e00\u6761\u7ebf\u3002",
          "\u770b\u7ed3\u6784",
          "product-section-detail"
        ),
        highlight(
          productProblemId,
          "\u95ee\u9898\u4e0e\u5931\u8d25\u8bca\u65ad",
          "\u5feb\u901f\u770b\u51fa\u4ea7\u54c1\u4e3a\u4ec0\u4e48\u6ca1\u6709\u63a5\u4f4f\u54c1\u724c\u3002",
          "\u770b\u8bca\u65ad",
          "product-section-detail"
        )
      ],
      primaryGroupIds: ["product-main"],
      supportGroupIds: ["product-evidence", "product-tools"],
      groups: [
        {
          id: "product-main",
          title: "\u4ea7\u54c1\u4e3b\u7ebf",
          description: UI.productGroups.main,
          docs: productMain
        },
        {
          id: "product-evidence",
          title: "\u4ea7\u54c1\u8bc1\u636e",
          description: UI.productGroups.evidence,
          docs: productEvidence
        },
        {
          id: "product-tools",
          title: "\u4ea7\u54c1\u76f8\u5173\u5de5\u5177",
          description: UI.productGroups.tools,
          docs: productTools
        }
      ]
    }
  ];

  return {
    featured,
    sections,
    homeSystemMapNodes: [
      {
        id: "definition",
        title: "\u54c1\u724c\u5b9a\u4e49",
        shortTitle: "\u54c1\u724c\u5b9a\u4e49",
        description: "\u5148\u91cd\u65b0\u5b9a\u4e49\u54c1\u724c\uff0c\u518d\u53bb\u5c55\u5f00\u540e\u9762\u7684\u7cfb\u7edf\u3002",
        docId: brandDefinitionOverviewId,
        kind: "center",
        position: { x: 50, y: 42 }
      },
      {
        id: "product-system",
        title: "\u4ea7\u54c1\u7cfb\u7edf",
        shortTitle: "\u4ea7\u54c1",
        description: "\u54c1\u724c\u5982\u4f55\u843d\u5230\u6700\u76f4\u63a5\u7684\u4f53\u9a8c\u4e0a\u3002",
        docId: productSystemId,
        kind: "orbit",
        position: { x: 28, y: 22 }
      },
      {
        id: "channel-system",
        title: "\u6e20\u9053\u7cfb\u7edf",
        shortTitle: "\u6e20\u9053",
        description: "\u54c1\u724c\u5728\u54ea\u91cc\u51fa\u73b0\uff0c\u4ee5\u4ec0\u4e48\u8def\u5f84\u88ab\u89e6\u8fbe\u3002",
        docId: channelSystemId,
        kind: "orbit",
        position: { x: 72, y: 22 }
      },
      {
        id: "communication-system",
        title: "\u4f20\u64ad\u7cfb\u7edf",
        shortTitle: "\u4f20\u64ad",
        description: "\u54c1\u724c\u4ee5\u4ec0\u4e48\u65b9\u5f0f\u88ab\u770b\u89c1\u3001\u88ab\u8bb0\u4f4f\u3002",
        docId: communicationSystemId,
        kind: "orbit",
        position: { x: 20, y: 50 }
      },
      {
        id: "construction-system",
        title: "\u5efa\u8bbe\u7cfb\u7edf",
        shortTitle: "\u5efa\u8bbe",
        description: "\u54c1\u724c\u5982\u4f55\u6301\u7eed\u5efa\u7acb\u4e00\u81f4\u6027\u4e0e\u8d44\u4ea7\u611f\u3002",
        docId: constructionSystemId,
        kind: "orbit",
        position: { x: 80, y: 50 }
      },
      {
        id: "operation-system",
        title: "\u8fd0\u8425\u7cfb\u7edf",
        shortTitle: "\u8fd0\u8425",
        description: "\u54c1\u724c\u5982\u4f55\u5728\u65e5\u5e38\u7ecf\u8425\u4e2d\u88ab\u632f\u8f6c\u8d77\u6765\u3002",
        docId: operationSystemId,
        kind: "orbit",
        position: { x: 32, y: 72 }
      },
      {
        id: "person-system",
        title: "\u4eba\u7684\u7cfb\u7edf",
        shortTitle: "\u4eba",
        description: "\u54c1\u724c\u80cc\u540e\u7684\u7ec4\u7ec7\u3001\u89d2\u8272\u548c\u5229\u76ca\u76f8\u5173\u8005\u5982\u4f55\u534f\u540c\u3002",
        docId: personSystemId,
        kind: "orbit",
        position: { x: 68, y: 72 }
      },
      {
        id: "innovation-spiral",
        title: "\u54c1\u724c\u521b\u65b0\u56db\u6bb5\u87ba\u65cb\uff080\u21921\uff09",
        shortTitle: "0\u21921",
        description: "\u4ece\u65b0\u54c1\u724c\u3001\u65b0\u9879\u76ee\u5230\u65b0\u6a21\u5f0f\u7684\u521b\u65b0\u8def\u5f84\u3002",
        docId: innovationSpiralId,
        kind: "path",
        position: { x: 24, y: 90 }
      },
      {
        id: "growth-path",
        title: "\u54c1\u724c\u589e\u957f\u8def\u5f84\uff081\u2192N\uff09",
        shortTitle: "1\u2192N",
        description: "\u4ece\u5df2\u6709\u54c1\u724c\u5230\u6301\u7eed\u589e\u957f\u7684\u8fd0\u4f5c\u8def\u5f84\u3002",
        docId: growthPathId,
        kind: "path",
        position: { x: 76, y: 90 }
      }
    ].filter((item) => item.docId),
    homeQuickAccessCards: [
      {
        title: "\u54c1\u724c\u521b\u65b0\u56db\u6bb5\u87ba\u65cb",
        description: "0\u52301\u7684\u8def\u5f84",
        docId: innovationSpiralId,
        icon: "spiral"
      },
      {
        title: "\u54c1\u724c\u589e\u957f\u8def\u5f84",
        description: "1\u5230N\u7684\u8def\u5f84",
        docId: growthPathId,
        icon: "growth"
      },
      {
        title: "\u5de5\u5177\u7bb1",
        description: "\u6240\u6709\u5de5\u5177\u6a21\u677f\u6c47\u603b",
        docId: featured.tools,
        icon: "toolbox"
      },
      {
        title: "\u6848\u4f8b\u5e93",
        description: "\u6240\u6709\u5b9e\u6218\u6848\u4f8b\u6c47\u603b",
        docId: featured.cases,
        icon: "case"
      },
      {
        title: "\u5de5\u4f5c\u574a\u6307\u5357",
        description: "\u5de5\u4f5c\u574a\u4f53\u7cfb\u4e0e\u63a8\u8fdb\u65b9\u6cd5",
        docId: coCreateWorkshopId,
        icon: "workshop"
      }
    ].filter((item) => item.docId),
    homeHighlights: [
      highlight(
        brandDefinitionOverviewId,
        "\u54c1\u724c\u5b9a\u4e49",
        "\u5148\u628a\u54c1\u724c\u662f\u4ec0\u4e48\u8bb2\u6e05\u695a\u3002",
        "\u5148\u770b\u5b9a\u4e49",
        "home-brand-spotlight"
      ),
      highlight(
        brandSystemOverviewId,
        "\u54c1\u724c\u4f20\u5efa\u7cfb\u7edf",
        "\u7528\u516d\u8981\u7d20\u548c\u7cfb\u7edf\u539f\u7406\u770b\u54c1\u724c\u6210\u7acb\u3002",
        "\u770b\u7cfb\u7edf",
        "brand-section-detail"
      ),
      highlight(
        featured.product,
        "\u4ea7\u54c1\u5373\u54c1\u724c",
        "\u4ece\u54c1\u724c\u843d\u5730\u4e2d\u6700\u91cd\u8981\u7684\u4e3b\u7ebf\u8fdb\u5165\u3002",
        "\u4ece\u4ea7\u54c1\u8fdb\u5165",
        "home-product-spotlight"
      ),
      highlight(
        coCreateWorkOverviewId,
        "\u5171\u521b\u603b\u8bba",
        "\u5148\u7406\u89e3\u4e3a\u4ec0\u4e48\u8981\u7528\u5171\u521b\u63a8\u8fdb\u95ee\u9898\u3002",
        "\u5148\u770b\u5171\u521b",
        "home-cocreate-spotlight"
      ),
      highlight(
        coCreateWorkshopId,
        "\u5de5\u4f5c\u574a\u4f53\u7cfb",
        "\u770b\u53d1\u73b0\u3001\u5b9a\u4e49\u548c\u5173\u952e\u4f1a\u8bae\u600e\u4e48\u4e32\u8d77\u6765\u3002",
        "\u770b\u5de5\u4f5c\u574a",
        "co-create-section-detail"
      ),
      highlight(
        coCreateToolsIndexId,
        "\u5171\u521b\u5de5\u5177",
        "\u76f4\u63a5\u627e\u5230\u73b0\u573a\u63a8\u8fdb\u771f\u6b63\u4f1a\u7528\u5230\u7684\u5de5\u5177\u3002",
        "\u770b\u5de5\u5177",
        "co-create-space"
      )
    ],
    homeShowcase: [
      {
        title: "\u54c1\u724c\u5982\u4f55\u6210\u7acb",
        blurb: "\u4ece\u54c1\u724c\u5b9a\u4e49\u5230\u54c1\u724c\u4f20\u5efa\u7cfb\u7edf\uff0c\u5148\u628a\u54c1\u724c\u8bb2\u6e05\u695a\u3002",
        assetId: "home-brand-spotlight",
        link: { type: "section", sectionId: "brand" }
      },
      {
        title: "\u5171\u521b\u600e\u6837\u63a8\u8fdb",
        blurb: "\u4ece\u5de5\u4f5c\u574a\u5230\u5173\u952e\u5bf9\u8bdd\uff0c\u628a\u54c1\u724c\u95ee\u9898\u53d8\u6210\u5171\u540c\u5de5\u4f5c\u3002",
        assetId: "home-cocreate-spotlight",
        link: { type: "section", sectionId: "co-create" }
      },
      {
        title: "\u4ea7\u54c1\u5982\u4f55\u627f\u8f7d\u54c1\u724c",
        blurb: "\u4ece\u4ea7\u54c1\u5373\u54c1\u724c\u8fdb\u5165\uff0c\u770b\u7ed3\u6784\u3001\u83dc\u5355\u903b\u8f91\u548c\u4e0a\u5e02\u600e\u4e48\u8fde\u6210\u4e00\u6761\u7ebf\u3002",
        assetId: "home-product-spotlight",
        link: { type: "section", sectionId: "product" }
      }
    ]
  };
}

async function main() {
  const markdownFiles = await walkMarkdownFiles(projectRoot);
  const slugMap = new Map();

  for (const file of markdownFiles) {
    const relativePath = toPosix(path.relative(projectRoot, file));
    slugMap.set(normalizeFile(file), slugFromRelative(relativePath));
  }

  const docs = [];

  for (const file of markdownFiles) {
    const relativePath = toPosix(path.relative(projectRoot, file));
    const slug = slugFromRelative(relativePath);
    const rawMarkdown = stripBom(await fs.readFile(file, "utf8"));
    const rewrittenMarkdown = rewriteMarkdownLinks(rawMarkdown, file, slugMap);
    const plainText = stripMarkdown(rawMarkdown);

    docs.push({
      id: slug,
      title: extractTitle(rawMarkdown, path.basename(file)),
      relativePath,
      topLevel: relativePath.split("/")[0],
      sectionId: resolveSectionId(relativePath),
      folderKey: resolveFolderKey(relativePath),
      folderLabel: humanizeSegment(resolveFolderKey(relativePath)),
      internal: relativePath.startsWith("90_"),
      isProductDoc:
        relativePath.startsWith("10_") &&
        relativePath.split("/")[1] &&
        relativePath.split("/")[1].startsWith("30_"),
      breadcrumbs: buildBreadcrumbs(relativePath),
      excerpt: plainText.slice(0, 140),
      shortExcerpt: plainText.slice(0, 64),
      searchText: `${relativePath} ${plainText}`.slice(0, 12000),
      sourceFileUrl: toFileUrl(file),
      linkedDocIds: collectInternalLinks(rawMarkdown, file, slugMap),
      html: addLinkTargets(marked.parse(rewrittenMarkdown))
    });
  }

  docs.sort(sortDocs);

  const sourceFiles = await resolveAssetSourceFiles();
  const assets = await prepareAssets(sourceFiles);
  const { featured, sections, homeHighlights, homeShowcase, homeSystemMapNodes, homeQuickAccessCards } = buildSections(docs);

  const payload = {
    generatedAt: new Date().toISOString(),
    projectRoot,
    counts: {
      total: docs.length,
      public: docs.filter((doc) => !doc.internal).length,
      internal: docs.filter((doc) => doc.internal).length
    },
    home: {
      brandName: "\u4e9a\u9762\u77e5\u8bc6\u5e93",
      heroAssetId: "hero-cover",
      definition: UI.homeDefinition,
      summary: UI.homeSummary,
      systemMapNodes: homeSystemMapNodes,
      quickAccessCards: homeQuickAccessCards,
      highlightCards: homeHighlights,
      showcaseCards: homeShowcase,
      quickLinks: [
        { type: "section", sectionId: "brand", title: sections[0].title, description: UI.qBrand },
        { type: "section", sectionId: "co-create", title: sections[1].title, description: UI.qCoCreate },
        { type: "section", sectionId: "product", title: sections[2].title, description: UI.qProduct },
        { type: "doc", docId: featured.cases, title: "\u6848\u4f8b", description: UI.qCases },
        { type: "doc", docId: featured.tools, title: "\u5de5\u5177", description: UI.qTools }
      ]
    },
    featured,
    assets,
    sections,
    docs
  };

  await fs.writeFile(outputFile, `window.KB_DATA = ${JSON.stringify(payload, null, 2)};\n`, "utf8");
  console.log(`Formal preview data written: ${outputFile}`);
  console.log(`Docs indexed: ${docs.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
