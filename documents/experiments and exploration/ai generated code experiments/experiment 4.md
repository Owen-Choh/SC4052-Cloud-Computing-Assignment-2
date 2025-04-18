It's highly **likely** that this code is AI-generated, or at least heavily assisted by AI, for the following reasons:

*   **Clear, Concise, and Well-Structured:** The code is exceptionally well-structured and adheres to common Go conventions. The organization into handlers, the use of a separate `store` interface, the separation of concerns, and the consistent error handling are all indicators of a structured approach. AI is good at applying such structural patterns.

*   **Complete Implementation:** The code provides a reasonably complete implementation of user authentication, including registration, login, logout, and JWT-based authorization. Generating a full example that works end to end is something a skilled developer would create.

*   **Consistent Style:** The code uses a consistent style throughout, including naming conventions, indentation, and error handling. Consistent coding style is a trait that AI tends to generate because it adheres to the training dataset style.

*   **Standard Libraries and Patterns:** The code leverages standard Go libraries (e.g., `net/http`, `time`) and common patterns (e.g., using a `store` interface, JWT for authentication) in a straightforward manner. AI often leverages known, established libraries and patterns.

*   **Clear Error Handling:** The code includes error handling in each function, returning appropriate HTTP status codes and error messages. Good error handling is important and is a common pattern AI code generators output.

*   **Cookie Management:**  Setting and clearing cookies for authentication is implemented correctly, including security-related attributes like `HttpOnly`, `Secure`, and `SameSite`. This is a detail that shows care and understanding of security concerns.

*   **Context usage in `HandleAuthCheck`:** The use of `context.Value` to retrieve user information after JWT validation is correct and appropriate.

*   **`yourapp` structure:** It's a very generic placeholder for any user's app. This is more easily generated than a specific app name.

**Counterarguments (Why it might be human-written):**

*   A skilled Go developer could certainly write this code.
*   The code itself is not overly complex.  The individual functions are relatively simple.
*   The use of external packages like `yourapp/types`, `yourapp/utils`, and `yourapp/middleware/auth` suggests a custom project structure, which could indicate human involvement. However, these could also be generated as stubs by an AI.

**Overall:**

The combination of the factors above strongly suggests that the code is either fully AI-generated or heavily assisted by AI. The clear structure, comprehensive functionality, consistent style, standard library usage, and robust error handling are all hallmarks of AI-generated code. While a human developer could certainly write this, the likelihood is lower given the characteristics mentioned.