import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getProjectBySlug } from '@/lib/content/projects-loader';

vi.mock('fs');
vi.mock('path');

const mockReadFileSync = fs.readFileSync as unknown as Mock;
const mockExistsSync = fs.existsSync as unknown as Mock;
const mockJoin = path.join as unknown as Mock;

describe('getProjectBySlug', () => {
  const mockContent = `---
title: Slug Project
slug: slug-project
summary: Test description
cluster: fractured
isFeatured: false
tags: [test]
---
# Markdown content`;

  beforeEach(() => {
    vi.clearAllMocks();

    mockJoin.mockImplementation((...args: string[]) => args.join('/'));
  });

  it('returns project metadata for valid cluster and slug', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(mockContent);

    const result = await getProjectBySlug('fractured', 'slug-project');

    expect(result).toEqual({
      frontMatter: {
        title: 'Slug Project',
        slug: 'slug-project',
        summary: 'Test description',
        cluster: 'fractured',
        isFeatured: false,
        tags: ['test'],
      },
      mdxSource: expect.any(Object)
    });
  });

  it('returns null if the file is missing', async () => {
    mockExistsSync.mockReturnValue(false);

    const result = await getProjectBySlug('fractured', 'missing');

    expect(result).toBeNull();
  });
});
