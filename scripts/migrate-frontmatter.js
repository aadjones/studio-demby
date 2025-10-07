const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectsDir = path.join(__dirname, '../content/projects');

// Mapping old clusters to new categories
const clusterToCategoryMap = {
  resonant: ['sound-vision'],
  errant: ['provocations'],
  fractured: ['sound-vision'], // Fractured seems to be mostly audio/visual
  enclosed: ['sound-vision'],
};

// Infer type from tags and cluster
function inferType(cluster, tags, title) {
  const tagsLower = tags.map(t => t.toLowerCase());

  // Check for specific indicators
  if (tagsLower.includes('app') || tagsLower.includes('tool')) return 'app';
  if (tagsLower.includes('teaching') || tagsLower.includes('pedagogy')) return 'teaching';
  if (tagsLower.includes('essay') || tagsLower.includes('writing')) return 'essay';
  if (tagsLower.includes('interactive')) return 'interactive';

  // Check title for emojis/indicators
  if (title.includes('🎵') && title.includes('🎬')) return 'audiovisual';
  if (title.includes('🎵')) return 'audio';
  if (title.includes('🎬')) return 'video';

  // Fallback based on cluster
  if (cluster === 'errant') return 'essay';
  if (cluster === 'resonant') return 'audio';

  return 'interactive'; // Default
}

// Process all MDX files
const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.mdx'));

files.forEach(filename => {
  const filePath = path.join(projectsDir, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Skip if already migrated
  if (data.categories) {
    console.log(`⏭️  Skipping ${filename} (already has categories)`);
    return;
  }

  // Add new fields
  const categories = clusterToCategoryMap[data.cluster] || ['sound-vision'];
  const type = inferType(data.cluster, data.tags || [], data.title || '');

  const updatedData = {
    ...data,
    type,
    categories,
    // Keep cluster for now during migration
  };

  // Write back
  const updatedContent = matter.stringify(content, updatedData);
  fs.writeFileSync(filePath, updatedContent);

  console.log(`✅ Migrated ${filename}: type=${type}, categories=${categories.join(',')}`);
});

console.log(`\n🎉 Migration complete! Processed ${files.length} files.`);
