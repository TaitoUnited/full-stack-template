import { access, lstat, readFile, readdir, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guidanceRoots = ['AGENTS.md', '.agents/skills', 'docs'];
const operationGuidanceRoots = ['AGENTS.md', '.agents/skills'];
const taitoContainerTargets = new Set([
  'client',
  'database',
  'pgweb',
  'playwright',
  'redis',
  'server',
  'storage',
  'worker',
]);
const errors = [];
const markdownAnchorCache = new Map();

await validateSkills();
await validateClaudeSkillLinks();
await validateGuidanceLinks();
await validateOperationCommands();

if (errors.length > 0) {
  console.error('Agent guidance validation failed:\n');

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log('Agent guidance validation passed.');
}

async function validateSkills() {
  const skillsDirectory = path.join(repositoryRoot, '.agents/skills');
  const entries = await readdir(skillsDirectory, { withFileTypes: true });
  const skillNames = new Set();

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = path.join(skillsDirectory, entry.name, 'SKILL.md');
    const skillContents = await readTextFile({ filePath: skillPath });

    if (skillContents === undefined) {
      errors.push(`${relativePath({ filePath: skillPath })} is missing.`);
      continue;
    }

    const frontmatter = skillContents.match(/^---\n([\s\S]*?)\n---/);
    const name = frontmatter?.[1].match(/^name:\s*(.+)$/m)?.[1].trim();
    const description = frontmatter?.[1]
      .match(/^description:\s*(.+)$/m)?.[1]
      .trim();

    if (name !== entry.name) {
      errors.push(
        `${relativePath({ filePath: skillPath })} must declare name: ${entry.name}.`
      );
    }

    if (!description) {
      errors.push(`${relativePath({ filePath: skillPath })} must declare a description.`);
    }

    if (name && skillNames.has(name)) {
      errors.push(`Duplicate skill name: ${name}.`);
    }

    if (name) skillNames.add(name);
  }
}

async function validateClaudeSkillLinks() {
  const agentSkillsDirectory = path.join(repositoryRoot, '.agents/skills');
  const claudeSkillsDirectory = path.join(repositoryRoot, '.claude/skills');
  const agentEntries = await readdir(agentSkillsDirectory, { withFileTypes: true });

  for (const entry of agentEntries) {
    if (!entry.isDirectory()) continue;

    const claudeSkillPath = path.join(claudeSkillsDirectory, entry.name);

    try {
      const linkStats = await lstat(claudeSkillPath);

      if (!linkStats.isSymbolicLink()) {
        errors.push(`${relativePath({ filePath: claudeSkillPath })} must be a symbolic link.`);
        continue;
      }

      const expectedPath = await realpath(path.join(agentSkillsDirectory, entry.name));
      const actualPath = await realpath(claudeSkillPath);

      if (actualPath !== expectedPath) {
        errors.push(`${relativePath({ filePath: claudeSkillPath })} must link to .agents/skills/${entry.name}.`);
      }
    } catch {
      errors.push(`${relativePath({ filePath: claudeSkillPath })} is missing.`);
    }
  }
}

async function validateGuidanceLinks() {
  const markdownFiles = await collectMarkdownFiles({ roots: guidanceRoots });

  for (const filePath of markdownFiles) {
    const contents = await readFile(filePath, 'utf8');
    const links = contents.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);

    for (const link of links) {
      const rawTarget = link[1].trim();

      if (rawTarget === 'XX' || /^(?:https?:\/\/|mailto:)/.test(rawTarget)) {
        continue;
      }

      const [targetWithoutAnchor, rawAnchor] = rawTarget.split('#', 2);
      const targetPath = targetWithoutAnchor.startsWith('/')
        ? path.join(repositoryRoot, targetWithoutAnchor.slice(1))
        : targetWithoutAnchor.length === 0
          ? filePath
          : path.resolve(path.dirname(filePath), targetWithoutAnchor);

      try {
        await access(targetPath);
      } catch {
        errors.push(`${relativePath({ filePath })} links to missing ${rawTarget}.`);
        continue;
      }

      if (rawAnchor && targetPath.endsWith('.md')) {
        const anchors = await getMarkdownAnchors({ filePath: targetPath });
        const anchor = decodeURIComponent(rawAnchor).toLowerCase();

        if (!anchors.has(anchor)) {
          errors.push(`${relativePath({ filePath })} links to missing anchor ${rawTarget}.`);
        }
      }
    }
  }
}

async function validateOperationCommands() {
  const markdownFiles = await collectMarkdownFiles({ roots: operationGuidanceRoots });

  for (const filePath of markdownFiles) {
    const contents = await readFile(filePath, 'utf8');
    const commands = contents.matchAll(/taito [^`\n]+/g);

    for (const match of commands) {
      if (/\b(?:ambiguous|never)\b/i.test(match[0])) continue;

      const command = match[0].split(' #', 1)[0].trim();

      if (isMissingEnvironmentTarget({ command })) {
        errors.push(
          `${relativePath({ filePath })} contains a Taito command without an explicit environment: ${command}`
        );
      }
    }
  }
}

function isMissingEnvironmentTarget({ command }) {
  if (command.includes(' -h')) return false;

  const commandToken = command.split(/\s+/, 2)[1] ?? '';

  if (/^(?:start|stop|restart|status|info)(?::|$)/.test(commandToken)) {
    const commandParts = commandToken.split(':');

    if (commandParts.length === 1) return true;

    return commandParts.length === 2 && taitoContainerTargets.has(commandParts[1]);
  }

  if (/^(?:logs|shell|exec|curl):/.test(commandToken)) {
    return commandToken.split(':').length < 3;
  }

  if (commandToken === 'secret') {
    const secretOperation = command.split(/\s+/, 3)[2] ?? '';

    if (!/^(?:rotate|update)(?::|$)/.test(secretOperation)) return false;

    return secretOperation.split(':').length < 2;
  }

  if (commandToken !== 'db') return false;

  const databaseOperation = command.split(/\s+/, 3)[2] ?? '';

  if (!/^(?:connect|proxy|status|import|dump|recreate)(?::|$)/.test(databaseOperation)) {
    return false;
  }

  return databaseOperation.split(':').length < 2;
}

async function getMarkdownAnchors({ filePath }) {
  const cachedAnchors = markdownAnchorCache.get(filePath);

  if (cachedAnchors) return cachedAnchors;

  const contents = await readFile(filePath, 'utf8');
  const anchors = new Set();
  const slugCounts = new Map();

  for (const heading of contents.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const baseSlug = heading[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]+>|[`*_~]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-');
    const duplicateCount = slugCounts.get(baseSlug) ?? 0;
    const slug = duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount}`;

    slugCounts.set(baseSlug, duplicateCount + 1);
    anchors.add(slug);
  }

  markdownAnchorCache.set(filePath, anchors);
  return anchors;
}

async function collectMarkdownFiles({ roots }) {
  const files = [];

  for (const root of roots) {
    const rootPath = path.join(repositoryRoot, root);
    files.push(...(await collectTextFiles({ rootPath, extension: '.md' })));
  }

  return files;
}

async function collectTextFiles({ rootPath, extension }) {
  const rootStats = await stat(rootPath);

  if (rootStats.isFile()) {
    return rootPath.endsWith(extension) ? [rootPath] : [];
  }

  const files = [];
  const entries = await readdir(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(rootPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles({ rootPath: entryPath, extension })));
    } else if (entry.name.endsWith(extension)) {
      files.push(entryPath);
    }
  }

  return files;
}

async function readTextFile({ filePath }) {
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return undefined;
  }
}

function relativePath({ filePath }) {
  return path.relative(repositoryRoot, filePath);
}
