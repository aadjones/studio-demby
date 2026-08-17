import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import * as path from 'path';
import {
  getAllProjects,
  getAllProjectEntries,
  getIndexableProjects,
} from '@/lib/content/projects-loader';

vi.mock('fs', async () => {
  return {
    default: {
      readdirSync: vi.fn(),
      readFileSync: vi.fn(),
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

describe('getAllProjects', () => {
  const validFrontmatter = `---
title: Test Project
slug: test-project
summary: A test project description
categories: ['visual-art']
tags: ['react', 'typescript']
---

# Test Project Content`;

  const invalidFrontmatter = `---
title: Incomplete Project
slug: incomplete
---`;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/root');

    const mockedFs = fs as unknown as {
      readdirSync: ReturnType<typeof vi.fn>;
      readFileSync: ReturnType<typeof vi.fn>;
    };

    mockedFs.readdirSync = vi.fn().mockReturnValue(['test-project.mdx']);
    mockedFs.readFileSync = vi.fn().mockReturnValue(validFrontmatter);
  });

  it('returns parsed project from valid frontmatter', async () => {
    const projects = await getAllProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      title: 'Test Project',
      slug: 'test-project',
      summary: 'A test project description',
      categories: ['visual-art'],
      tags: ['react', 'typescript'],
    });
  });

  it('filters out projects with invalid frontmatter', async () => {
    const mockedFs = fs as unknown as {
      readdirSync: ReturnType<typeof vi.fn>;
      readFileSync: ReturnType<typeof vi.fn>;
    };

    mockedFs.readdirSync = vi.fn().mockReturnValue(['invalid-project.mdx']);
    mockedFs.readFileSync = vi.fn().mockReturnValue(invalidFrontmatter);

    const projects = await getAllProjects();
    expect(projects).toHaveLength(0);
  });

  it('defaults to published when status is absent', async () => {
    const projects = await getAllProjects();
    expect(projects[0].status).toBe('published');
  });
});

describe('status filtering', () => {
  const withStatus = (slug: string, status: string) => `---
title: ${slug}
slug: ${slug}
summary: A test project description
categories: ['visual-art']
tags: ['test']
status: ${status}
---
`;

  const files = {
    'live.mdx': withStatus('live', 'published'),
    'wip.mdx': withStatus('wip', 'draft'),
    'old.mdx': withStatus('old', 'archived'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/root');

    const mockedFs = fs as unknown as {
      readdirSync: ReturnType<typeof vi.fn>;
      readFileSync: ReturnType<typeof vi.fn>;
    };

    mockedFs.readdirSync = vi.fn().mockReturnValue(Object.keys(files));
    mockedFs.readFileSync = vi
      .fn()
      .mockImplementation((p: string) => files[p.split('/').pop() as keyof typeof files]);
  });

  it('getAllProjectEntries returns every status', async () => {
    const slugs = (await getAllProjectEntries()).map((p) => p.slug).sort();
    expect(slugs).toEqual(['live', 'old', 'wip']);
  });

  it('getAllProjects returns published only', async () => {
    const slugs = (await getAllProjects()).map((p) => p.slug);
    expect(slugs).toEqual(['live']);
  });

  it('getIndexableProjects excludes drafts but keeps archived', async () => {
    const slugs = (await getIndexableProjects()).map((p) => p.slug).sort();
    expect(slugs).toEqual(['live', 'old']);
    expect(slugs).not.toContain('wip');
  });
});
