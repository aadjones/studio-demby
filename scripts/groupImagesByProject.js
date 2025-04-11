// scripts/groupImagesByProject.js
const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content/projects");
const photoDir = path.join(__dirname, "../public/photos");

const projectToImages = {};

const mdxFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

for (const file of mdxFiles) {
  const slug = file.replace(/\.mdx$/, "");
  const content = fs.readFileSync(path.join(contentDir, file), "utf8");
  const matches = content.match(/\/photos\/([a-zA-Z0-9-_.]+\.(png|jpe?g|gif))/g);

  if (matches) {
    projectToImages[slug] = matches.map((match) =>
      match.split("/photos/")[1]
    );
  }
}

console.log("🗂 Image usage by project:");
console.log(JSON.stringify(projectToImages, null, 2));
