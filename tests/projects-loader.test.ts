import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import * as path from 'path';
import { getAllProjects } from '@/lib/content/projects-loader';
import type { MDXProject } from '@/types/mdx';

// 🛠️ Manually stub functions we'll override
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
      join: (...args: string[]) => actual.join(...args), // fallback to real join behavior
    },
  };
});

const mockProjectsDirectory = 'content/projects';

describe('getAllProjects', () => {
  const validFrontmatter = `---
title: Test Project
slug: test-project
summary: A test project description
cluster: resonant
isFeatured: true
tags: ['react', 'typescript']
---

# Test Project Content`;

  const invalidFrontmatter = `---
title: Incomplete Project
slug: incomplete
---`;

  beforeEach(() => {
    vi.clearAllMocks();

    // Override cwd to return our test path
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
      cluster: 'resonant',
      isFeatured: true,
      tags: ['react', 'typescript'],
    } as MDXProject);
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
});
