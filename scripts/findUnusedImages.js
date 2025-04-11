const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content/projects");
const photoDir = path.join(__dirname, "../public/photos");

const allMDX = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => fs.readFileSync(path.join(contentDir, f), "utf8"))
  .join("\n");

const usedImages = new Set();
const imageRegex = /\/photos\/([a-zA-Z0-9-_.]+\.(png|jpe?g|gif))/g;

let match;
while ((match = imageRegex.exec(allMDX)) !== null) {
  usedImages.add(match[1]);
}

const allImages = fs.readdirSync(photoDir);

const unused = allImages.filter((img) => !usedImages.has(img));

console.log("🧼 Unused images:", unused);
