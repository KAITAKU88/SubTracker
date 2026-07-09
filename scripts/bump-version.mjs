#!/usr/bin/env node
/**
 * Tăng version tự động trước mỗi lần phát hành APK.
 * - expo.version: patch +1 (1.0.0 → 1.0.1)
 * - expo.android.versionCode: +1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const appJsonPath = path.join(root, 'app.json');
const buildGradlePath = path.join(root, 'android/app/build.gradle');

const app = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const parts = app.expo.version.split('.').map((n) => parseInt(n, 10));

if (parts.length !== 3 || parts.some(Number.isNaN)) {
  console.error(`Version không hợp lệ: ${app.expo.version}`);
  process.exit(1);
}

parts[2] += 1;
const newVersion = parts.join('.');
const newVersionCode = (app.expo.android.versionCode ?? 0) + 1;

app.expo.version = newVersion;
app.expo.android.versionCode = newVersionCode;

fs.writeFileSync(appJsonPath, `${JSON.stringify(app, null, 2)}\n`);

if (fs.existsSync(buildGradlePath)) {
  let gradle = fs.readFileSync(buildGradlePath, 'utf8');
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`);
  gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${newVersion}"`);
  fs.writeFileSync(buildGradlePath, gradle);
}

console.log(`✓ Version: ${newVersion} (versionCode ${newVersionCode})`);
