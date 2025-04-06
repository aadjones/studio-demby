import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Load cluster order from JSON
const clusterOrderPath = path.join(process.cwd(), "cluster_order.json");
const orderMap = JSON.parse(fs.readFileSync(clusterOrderPath, "utf-8"));

const contentDir = path.join(process.cwd(), "content/projects");

for (const [cluster, projects] of Object.entries(orderMap)) {
  for (const { slug, clusterOrder } of projects as any[]) {
    const filePath = path.join(contentDir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      console.warn(`❌ File not found: ${filePath}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(raw);

    // Only patch if necessary
    if (parsed.data.clusterOrder === clusterOrder) {
      console.log(`✔ Already correct: ${slug}`);
      continue;
    }

    parsed.data.clusterOrder = clusterOrder;
    const updated = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, updated, "utf-8");
    console.log(`✅ Updated ${cluster}/${slug}.mdx`);
  }
}
