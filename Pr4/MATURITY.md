# Richardson Maturity Model Evaluation
## Student Details
- Name: Bhumi Shah
- Roll No: 24IT089
---
# API Endpoints
| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /tasks | Get all tasks |
| POST | /tasks | Create a new task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |
---
# Richardson Maturity Model Evaluation
| Level | Criterion | Satisfied? | Evidence |
|------|------------|------------|----------|
| Level 0 | Single endpoint | Yes | API provides endpoints for task management |
| Level 1 | Resource-based URLs | Yes | `/tasks` and `/tasks/:id` |
| Level 2 | Correct HTTP methods and status codes | Yes | GET, POST, PUT, DELETE with 200, 201, 404, 500 |
| Level 3 | HATEOAS | No | Hypermedia links are not implemented |
---
# HATEOAS Example
If Level 3 were implemented, a response could look like this:
```json
{
    "id": 1,
    "title": "Learn Express",
    "_links": {
        "self": "/tasks/1",
        "delete": "/tasks/1",
        "update": "/tasks/1"
    }
}
```
---
# Why does this API satisfy Level 2?
- Uses resource-based URLs.
- Uses correct HTTP methods.
- Returns proper HTTP status codes.
- Supports CRUD operations.
Therefore, the API satisfies **Richardson Maturity Model Level 2**.
---
# Why do most production APIs stop at Level 2?
Most REST APIs stop at Level 2 because:
- It is simple to implement.
- It follows REST principles.
- Clients already know which endpoints to call.
- Implementing HATEOAS increases complexity with little practical benefit for many applications.
