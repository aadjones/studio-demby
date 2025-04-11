// scripts/checkBrokenImagePaths.js
const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content/projects");
const photosDir = path.join(__dirname, "../public/photos");

const mdxFiles = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".mdx"));

const brokenRefs = [];

for (const file of mdxFiles) {
  const slug = file.replace(/\.mdx$/, "");
  const filePath = path.join(contentDir, file);
  const content = fs.readFileSync(filePath, "utf8");

  const imagePaths = [...content.matchAll(/\/photos\/([a-zA-Z0-9/_\-\.]+\.(png|jpe?g|gif))/g)];

  for (const match of imagePaths) {
    const relativePath = match[1]; // e.g., shatter/shatter1.png
    const fullPath = path.join(photosDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      brokenRefs.push({
        slug,
        file: file,
        missing: `/photos/${relativePath}`,
      });
    }
  }
}

if (brokenRefs.length === 0) {
  console.log("✅ No broken image paths found.");
} else {
  console.log("❌ Broken image references:");
  brokenRefs.forEach((ref) => {
    console.log(`- [${ref.slug}] ${ref.missing}`);
  });
}
