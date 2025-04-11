const fs = require("fs");
const path = require("path");

const photosDir = path.join(__dirname, "../public/photos");
const contentDir = path.join(__dirname, "../content/projects");

const projectToImages = {
  "above": ["above.png"],
  "degradation": ["degradation.gif", "piano-melt.gif"],
  "encased-melting": [
    "encased-melting-preview.png", "texture0.png", "texture1.png",
    "texture2.png", "texture3.png", "texture4.png",
    "texture5.png", "texture6.png", "texture7.png", "texture8.png"
  ],
  "escape": [
    "reaching.jpg", "denmark.jpg", "endure.jpg",
    "frustration.jpg", "space.jpg", "escape.jpg", "calm.jpg"
  ],
  "feathers": ["feather1.png", "feather2.png", "feather3.png", "feather4.png"],
  "fire": ["fire1.png", "fire2.png", "fire3.png", "fire4.png"],
  "flow": ["flow.jpg"],
  "fluid-subspaces": ["fluid-subspaces.png"],
  "gallery-of-lies": ["lies.png"],
  "improvisation-simple-melody": ["improvisation.jpg"],
  "rain": ["rain.png", "cantor.png"],
  "shatter": [
    "shatter.png", "shatter1.png", "shatter2.png", "shatter3.png",
    "shatter4.png", "shatter5.png", "shatter6.png", "metaplane.png"
  ],
  "shrimp-jesus": ["shrimp-jesus.png"],
  "spatial-synthesizer": ["spatial-synthesizer.png"],
  "stray-signals": ["stray-signals.png"]
};

for (const [project, images] of Object.entries(projectToImages)) {
  const projectDir = path.join(photosDir, project);
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
    console.log(`📁 Created: photos/${project}`);
  }

  for (const image of images) {
    const src = path.join(photosDir, image);
    const dest = path.join(projectDir, image);
    if (fs.existsSync(src)) {
      fs.renameSync(src, dest);
      console.log(`✅ Moved: ${image} → ${project}/`);
    } else {
      console.warn(`⚠️  Missing: ${image}`);
    }
  }

  const mdxPath = path.join(contentDir, `${project}.mdx`);
  if (fs.existsSync(mdxPath)) {
    let contents = fs.readFileSync(mdxPath, "utf8");
    for (const image of images) {
      const oldPath = `/photos/${image}`;
      const newPath = `/photos/${project}/${image}`;
      contents = contents.split(oldPath).join(newPath);
    }
    fs.writeFileSync(mdxPath, contents, "utf8");
    console.log(`✍️  Rewrote paths in: ${project}.mdx`);
  }
}
