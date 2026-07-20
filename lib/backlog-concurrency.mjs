/**
 * Repository-owned backlog concurrency policy.
 *
 * This module deliberately validates one exact, versioned profile without a
 * JSON Schema runtime dependency. The shipped schema is the human/tool-facing
 * contract; these checks are its fail-closed installer equivalent.
 */

import fs from 'node:fs';
import path from 'node:path';

export const BACKLOG_CONCURRENCY_PROFILE_PATH = path.join(
  'openspec',
  'backlog',
  'concurrency.json'
);

export const OWNER_SCOPED_PROFILE = Object.freeze({
  $schema: './templates/concurrency-profile.schema.json',
  schemaVersion: 1,
  profile: 'owner-scoped-v1',
  implementationWipLimit: 2,
});

const PROFILE_KEYS = Object.freeze(Object.keys(OWNER_SCOPED_PROFILE).sort());

/**
 * Returns a structured policy result. Only `status: "enabled"` grants the
 * caller permission to evaluate owner-scoped parallel admission; every other
 * status is serial.
 */
export function inspectBacklogConcurrencyProfile(targetDir) {
  const filePath = path.join(targetDir, BACKLOG_CONCURRENCY_PROFILE_PATH);
  if (!fs.existsSync(filePath)) {
    return {
      status: 'absent',
      mode: 'serial',
      filePath,
      diagnostics: ['profile is absent'],
    };
  }

  let value;
  try {
    value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return {
      status: 'invalid',
      mode: 'serial',
      filePath,
      diagnostics: [`profile is unreadable or malformed JSON: ${error.message}`],
    };
  }

  const diagnostics = [];
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    diagnostics.push('profile must be a JSON object');
  } else {
    const actualKeys = Object.keys(value).sort();
    const missing = PROFILE_KEYS.filter((key) => !actualKeys.includes(key));
    const unknown = actualKeys.filter((key) => !PROFILE_KEYS.includes(key));
    if (missing.length > 0) diagnostics.push(`missing required keys: ${missing.join(', ')}`);
    if (unknown.length > 0) diagnostics.push(`unknown keys: ${unknown.join(', ')}`);

    for (const [key, expected] of Object.entries(OWNER_SCOPED_PROFILE)) {
      if (!(key in value) || value[key] === expected) continue;
      diagnostics.push(
        `${key} must equal ${JSON.stringify(expected)}; received ${JSON.stringify(value[key])}`
      );
    }
  }

  if (diagnostics.length > 0) {
    return {
      status: 'unsupported',
      mode: 'serial',
      filePath,
      diagnostics,
    };
  }

  return {
    status: 'enabled',
    mode: 'owner-scoped-v1',
    implementationWipLimit: 2,
    filePath,
    diagnostics: [],
  };
}
