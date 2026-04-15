import fs from 'fs/promises';
import path from 'path';

const backendRoot = process.cwd();
const storageRoot = path.join(backendRoot, 'storage');
const resumesRoot = path.join(storageRoot, 'resumes');
const manifestRoot = path.join(storageRoot, 'manifests');
const resumeManifestPath = path.join(manifestRoot, 'resumes.json');

const allowedExtensions = new Set(['.pdf', '.docx', '.txt', '.md']);

const sanitizeSegment = (value) =>
  String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 80);

const ensureStorage = async () => {
  await fs.mkdir(resumesRoot, { recursive: true });
  await fs.mkdir(manifestRoot, { recursive: true });

  try {
    await fs.access(resumeManifestPath);
  } catch {
    await fs.writeFile(resumeManifestPath, JSON.stringify([], null, 2), 'utf-8');
  }
};

const readManifest = async () => {
  await ensureStorage();
  const content = await fs.readFile(resumeManifestPath, 'utf-8');
  return JSON.parse(content);
};

const writeManifest = async (records) => {
  await fs.writeFile(resumeManifestPath, JSON.stringify(records, null, 2), 'utf-8');
};

export const saveResumeFile = async ({ profileId, fileName, base64Content }) => {
  if (!fileName || !base64Content) {
    throw new Error('fileName and base64Content are required');
  }

  await ensureStorage();

  const extension = path.extname(fileName).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    throw new Error('Unsupported file format. Use PDF, DOCX, TXT, or MD');
  }

  const safeProfileId = sanitizeSegment(profileId);
  const originalBaseName = path.basename(fileName, extension);
  const safeBaseName = sanitizeSegment(originalBaseName) || 'resume';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  const userDir = path.join(resumesRoot, safeProfileId);
  await fs.mkdir(userDir, { recursive: true });

  const storedFileName = `${timestamp}_${safeBaseName}${extension}`;
  const absolutePath = path.join(userDir, storedFileName);
  const buffer = Buffer.from(base64Content, 'base64');

  await fs.writeFile(absolutePath, buffer);

  return {
    absolutePath,
    relativePath: path.relative(backendRoot, absolutePath).replace(/\\/g, '/'),
    storedFileName,
    sizeInBytes: buffer.length,
    uploadedAt: new Date().toISOString(),
  };
};

export const recordResumeManifest = async (entry) => {
  const manifest = await readManifest();
  manifest.push(entry);
  await writeManifest(manifest);
  return entry;
};

export const getLatestResumeManifestForProfile = async (profileId) => {
  const manifest = await readManifest();
  const matches = manifest
    .filter((item) => item.profile_id === profileId)
    .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

  return matches[0] || null;
};
