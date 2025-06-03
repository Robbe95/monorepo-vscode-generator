// src/shims/node-globals.ts

// This file defines __filename and __dirname using ES Module-compatible methods.
// esbuild will inject these exports into modules that reference __filename or __dirname.

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// These exports will be injected as top-level variables into modules that use them.
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
