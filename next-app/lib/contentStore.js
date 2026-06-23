import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

function readJson() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeJson(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getAllContent() {
  return readJson();
}

export function getContentById(id) {
  const items = readJson();
  return items.find(item => item.id === id);
}

export function addContent(content) {
  const items = readJson();
  const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { id: nextId, ...content };
  items.push(newItem);
  writeJson(items);
  return newItem;
}

export function deleteContentById(id) {
  const items = readJson();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  writeJson(filtered);
  return true;
}
