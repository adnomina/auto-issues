---
name: issue-tracker
description: Use when the user asks to create, list, plan, or manage issues/features.
---

# Issue Tracker

## Overview
Use this skill to interact with the local issue tracker API for creating and querying issues. Use HTTP requests against `http://127.0.0.1:3000` and follow the API reference in `references/api.md`.

## Quick start
- List issues: `GET /issues`
- Get one issue by ID: `GET /issues/:id`
- Create issue: `POST /issues` with JSON body `{"name":"...","description":"...","status":"..."}`

## Workflow
- If the user asks to plan or create a feature, create an issue with a clear name, description, and status.
- If the user asks for open issues, list issues in `in_progress`.
- If the user references a specific issue, fetch it by ID.
- For everything else, consult the API reference.

## API reference
Read `references/api.md` for exact endpoints and request/response shapes.
