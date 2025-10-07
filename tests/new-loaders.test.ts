import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import * as path from 'path';
import { getProjectsByCategory, getRecentProjects, getProjectBySlugOnly } from '@/lib/content/projects-loader';
import type { MDXProject } from '@/types/mdx';

vi.mock('fs', async () => {
  return {
    default: {
      readdirSync: vi.fn(),
      readFileSync: vi.fn(),
      existsSync: vi.fn(),
    },
  };
});

vi.mock('path', async () => {
  const actual = await vi.importActual<typeof path>('path');
  return {
    default: {
      ...actual,
      join: (...args: string[]) => actual.join(...args),
    },
  };
});

describe('getProjectsByCategory', () => {
  const soundVisionProject = `---
title: Sound Project
slug: sound-project
summary: A sound project
type: audio
categories: ['sound-vision']
isFeatured: false
tags: ['music']
---
# Content`;

  const systemsToolsProject = `---
title: App Project
slug: app-project
summary: An app project
type: app
categories: ['systems-tools']
isFeatured: false
tags: ['app']
---
# Content`;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/root');

    const mockedFs = fs as unknown as {
      readdirSync: ReturnType<typeof vi.fn>;
      readFileSync: ReturnType<typeof vi.fn>;
    };

    mockedFs.readdirSync = vi.fn().mockReturnValue(['sound-project.mdx', 'app-project.mdx']);
    mockedFs.readFileSync = vi.fn()
      .mockReturnValueOnce(soundVisionProject)
      .mockReturnValueOnce(systemsToolsProject);
  });

  it('returns only projects in the specified category', async () => {
    const projects = await getProjectsByCategory('sound-vision');
    expect(projects).toHaveLength(1);
    expect(projects[0].slug).toBe('sound-project');
  });

  it('returns empty array for category with no projects', async () => {
    const projects = await getProjectsByCategory('provocations');
    expect(projects).toHaveLength(0);
  });
});

describe('getRecentProjects', () => {
  const oldProject = `---
title: Old Project
slug: old-project
summary: An old project
type: audio
categories: ['sound-vision']
date: '2020-01-01'
isFeatured: false
tags: ['old']
---
# Content`;

  const newProject = `---
title: New Project
slug: new-project
summary: A new project
type: audio
categories: ['sound-vision']
date: '2024-01-01'
isFeatured: false
tags: ['new']
---
# Content`;

  const noDateProject = `---
title: No Date Project
slug: no-date
summary: No date
type: audio
categories: ['sound-vision']
isFeatured: false
tags: ['none']
---
# Content`;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/root');

    const mockedFs = fs as unknown as {
      readdirSync: ReturnType<typeof vi.fn>;
      readFileSync: ReturnType<typeof vi.fn>;
    };

    mockedFs.readdirSync = vi.fn().mockReturnValue(['old-project.mdx', 'new-project.mdx', 'no-date.mdx']);
    mockedFs.readFileSync = vi.fn()
      .mockReturnValueOnce(oldProject)
      .mockReturnValueOnce(newProject)
      .mockReturnValueOnce(noDateProject);
  });

  it('returns projects sorted by date, newest first', async () => {
    const projects = await getRecentProjects(10);
    expect(projects).toHaveLength(2); // Only projects with dates
    expect(projects[0].slug).toBe('new-project');
    expect(projects[1].slug).toBe('old-project');
  });

  it('respects the limit parameter', async () => {
    const projects = await getRecentProjects(1);
    expect(projects).toHaveLength(1);
    expect(projects[0].slug).toBe('new-project');
  });

  it('filters out projects without dates', async () => {
    const projects = await getRecentProjects(10);
    const slugs = projects.map(p => p.slug);
    expect(slugs).not.toContain('no-date');
  });
});

describe('getProjectBySlugOnly', () => {
  const validProject = `---
title: Test Project
slug: test-project
summary: A test
type: audio
categories: ['sound-vision']
isFeatured: false
tags: ['test']
---
# Content`;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/root');
  });

  it('returns project without cluster validation', async () => {
    const mockedFs = fs as unknown as {
      existsSync: ReturnType<typeof vi.fn>;
      readFileSync: ReturnType<typeof vi.fn>;
    };

    mockedFs.existsSync = vi.fn().mockReturnValue(true);
    mockedFs.readFileSync = vi.fn().mockReturnValue(validProject);

    const result = await getProjectBySlugOnly('test-project');

    expect(result).toBeTruthy();
    expect(result?.frontMatter.slug).toBe('test-project');
    expect(result?.mdxSource).toBeDefined();
  });

  it('returns null for non-existent project', async () => {
    const mockedFs = fs as unknown as {
      existsSync: ReturnType<typeof vi.fn>;
    };

    mockedFs.existsSync = vi.fn().mockReturnValue(false);

    const result = await getProjectBySlugOnly('missing-project');
    expect(result).toBeNull();
  });
});
