# JWT Authentication and Input Validation Analysis

This document addresses the key questions for the JWT Authentication task.

### Why must passwords be hashed before storage instead of saved as plain text, even in a lab/demo project?
Passwords must be hashed (using tools like bcrypt) to protect user credentials if the database is compromised. If passwords are saved in plain text, any attacker or unauthorized person with database access can instantly read everyone's password. Hashing converts the password into an irreversible string, meaning even if the database is leaked, the actual passwords remain secure. Practicing this even in lab/demo projects builds essential security habits.

### What does the authentication middleware actually verify, and what happens if the token is missing or expired?
The authentication middleware verifies:
1. **Presence**: Whether the `Authorization` header is present and formatted correctly (e.g., `Bearer <token>`).
2. **Validity**: Whether the token is authentic (was signed by your server using your `JWT_SECRET`) and hasn't been tampered with.
3. **Expiration**: Whether the token's expiration time (defined during creation, e.g., 1 hour) has passed.

If the token is missing, tampered with, or expired, the middleware stops the request pipeline and returns an HTTP `401 Unauthorized` status to the client, preventing access to the protected route (e.g., stopping someone from viewing or creating tasks).

### Why should input validation happen on the server even if the frontend already validates the same fields?
Frontend validation provides immediate feedback to the user and improves the user experience, but it **is not secure**. A malicious user can bypass frontend validation easily using tools like Postman, curl, or by disabling JavaScript in the browser. Server-side validation acts as the ultimate gatekeeper, ensuring that malformed or malicious data NEVER enters your database or causes your server to crash.
