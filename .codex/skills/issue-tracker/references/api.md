# Issue Tracker API

## Base URL
- `http://127.0.0.1:3000`
- No auth or special headers required.
- Send JSON bodies with `Content-Type: application/json`.

## Data model
Issue fields:
- `id` (number)
- `name` (string)
- `description` (string)
- `status` (string; one of `backlog`, `in_progress`, `done`)

## Endpoints

### List all issues
`GET /issues`

Response:
- JSON array of issue objects.

Example:
```
curl "http://127.0.0.1:3000/issues"
```

### Get issue by id
`GET /issues/:id`

Response:
- JSON issue object.

Example:
```
curl "http://127.0.0.1:3000/issues/1"
```

### Create issue
`POST /issues`

Body:
```
{"name":"Title","description":"Details","status":"Status"}
```

Response:
- JSON object: `{ "changes": number, "lastInsertRowid": number }`

Example:
```
curl -X POST "http://127.0.0.1:3000/issues" \
  -H "Content-Type: application/json" \
  -d '{"name":"New issue","description":"Add auth","status":"backlog"}'
```

### Update issue status
`PATCH /issues/:id`

Query string: `?status=NewStatus`

Response:
- JSON object: `{ "changes": number, "lastInsertRowid": number }`

Example:
`curl -X PATCH "http://127.0.0.1:3000/issues/2?status=done"`

### Delete issue
`DELETE /issues/:id`

Response:
- JSON object: `{ "changes": number, "lastInsertRowid": number }`

Example:
`curl -X DELETE "http://127.0.0.1:3000/issues/2`
