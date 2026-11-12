#!/usr/bin/env node
'use strict';
// Preserve the established command while the lesson now uses Grok's five-frame sequence.
if (!process.env.L20206_SEQUENCE_BASE_URL && process.env.L20206_STORY_BASE_URL) {
    process.env.L20206_SEQUENCE_BASE_URL = process.env.L20206_STORY_BASE_URL;
}
require('./l202_06_sequence_browser_check.js');
