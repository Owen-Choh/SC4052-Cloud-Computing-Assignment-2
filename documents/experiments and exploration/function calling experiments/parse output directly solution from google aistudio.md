# FROM ME
there is no function call returned by the api, the output is below in text parts

```
print(default_api.submit_pull_request(branchName='suggested-readme', commitMessage='Add suggested README.md', fileContent='# SC4052-Cloud-Computing-Assignment-2\n\nThis repository contains a React application built with TypeScript and Vite. It provides a simple interface for searching code on GitHub and generating documentation using the Gemini API.\n\n## Overview\n\nThe application is structured into three main tabs:\n\n-   **General Info:** Allows you to set your GitHub token, username, and repository.\n-   **CodeSearch:** Enables you to search for code snippets within a specified repository or across all of GitHub.\n-   **CodeEdit:** Provides functionality to generate documentation and README files for your projects using the Gemini API.\n\n## Architecture\n\nThe application follows a component-based architecture, with the main components located in the `src/components` directory:\n\n-   `App.tsx`: The main application component that manages the tab structure and provides the overall layout.\n-   `GeneralInfo.tsx`: Component for setting GitHub credentials and repository information.\n-   `CodeSearch.tsx`: Component for searching code on GitHub.\n-   `CodeEdit.tsx`: Component for generating documentation and README files.\n\nThe application uses the following libraries:\n\n-   React: A JavaScript library for building user interfaces.\n-   TypeScript: A superset of JavaScript that adds static typing.\n-   Vite: A build tool that provides fast development and optimized builds.\n-   Tailwind CSS: A utility-first CSS framework.\n-   Axios: A promise-based HTTP client for making API requests.\n-   Octokit: A TypeScript library for accessing the GitHub API.\n-   @google/generative-ai: A library for accessing the Gemini API.\n-   react-markdown: A library for rendering Markdown.\n\n## Setup\n\n1.  Clone the repository:\n\n    ```bash\n    git clone <repository-url>\n    cd SC4052-Cloud-Computing-Assignment-2/github-search-saas\n    ```\n\n2.  Install the dependencies:\n\n    ```bash\n    npm install\n    ```\n\n3.  Create a `.env` file in the root directory and add your GitHub token and Gemini API key:\n\n    ```\n    VITE_GITHUB_TOKEN=<your_github_token>\nVITE_GEMINI_API_KEY=<your_gemini_api_key>\n    ```\n\n4.  Start the development server:\n\n    ```bash\n    npm run dev\n    ```\n\n## Usage\n\n1.  Navigate to the **General Info** tab and enter your GitHub token and username. Select the repository you want to work with.\n2.  Go to the **CodeSearch** tab and enter your search query. You can also filter by file types.\n3.  In the **CodeEdit** tab, you can generate documentation or a README file based on the code you searched for. You can also adjust the model temperature to control the variation in the output.\n4.  Click the **Generate Documentation** or **Generate README** button to generate the content. The generated content will appear in the output textarea.\n5.  You can download the generated content as a Markdown file or submit a pull request to your repository.\n\n## Notes\n\n-   **Do not commit your `.env` file** to the repository, as it contains sensitive information.\n-   The Gemini API has usage limits. Be mindful of your usage to avoid exceeding the limits.\n-   The quality of the generated documentation depends on the quality of the code and the clarity of the search query.\n', pullRequestTitle='Suggested README file', pullRequestBody='This pull request adds a suggested README file for the repository.', filePath='README.md'))
```

# FROM GEMINI FLASH

Okay, I see the problem. The model *is* providing the arguments it wants to use for the function call, but it's doing so in the `text` part of the response, not in a structured `functionCall` object. This means that the model is simply *generating text* that looks like a function call, but it's not actually using the function calling feature of the API.

**The Challenge:**

You need to adapt your code to handle this unstructured output. This means you'll have to use string parsing techniques to extract the arguments from the text.

**Updated `generateREADME` Function:**

```typescript
  const generateREADME = async () => {
    setLoading(true);
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      return;
    }
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    let promptArray: string[] = [];
    if (repoFileContents == "") {
      let { fileContents, fileContentArray, errmsg } =
        await fetchFileContents(results);
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
      }
      promptArray = fileContentArray;
      repoFileContents = fileContents;
      setRepoFileContentArray(fileContentArray);
      cache.set("repoFileContents", repoFileContents);
    }

    if (finalPrompt == "") {
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    console.log(finalPrompt);
    if (!finalPrompt) {
      setError("No content to generate README for.");
      setLoading(false);
      return;
    }

    if (generatedContent == "") {
      if (autoPullRequest) {
        console.log("Auto pull request enabled.");
        const systemInstruction = `Submit a pull request for a suggested README file for this code repository ${repository}.\nYou do not need to include the code directly in the README, you may chose to include the file path if required.\nWrite the README in a way that is easy to understand for a beginner.\nInclude a short description of what the repository contains, an overview of the code, architecture (if applicable) and how to set up and use it.\nAlso include brief notes that the reader should look out for when using the repository such as not commiting their env file.`;
        // const systemInstruction = "help me submit a pull request containing the contents of a README file for this code repository for testing";
        // let finalPrompt = "You can include anything in the file contents";

        console.log("promptArray: ", promptArray);
        const temp = promptArray.slice(0, 3);
        const genWithToolsResponse = await generateWithTools(
          systemInstruction,
          temp,
          "hello",
          {
            temperature: modelTemperature,
          }
        );
        console.log("genWithToolsResponse: ", genWithToolsResponse);

        let pullRequestResult = "Error submitting pull request";

        //Attempt text based parsing
        if (genWithToolsResponse && genWithToolsResponse.text) {
          try {
            const functionCallString = genWithToolsResponse.text;

            // Regex to extract function name and arguments
            const functionCallRegex =
              /submit_pull_request\(([^)]+)\)/;
            const match = functionCallString.match(functionCallRegex);

            if (match && match[1]) {
              const argsString = match[1];

              // Regex to extract key-value pairs
              const keyValueRegex =
                /(\w+)=('([^']+)'|"([^"]+)")/g;
              let keyValueMatch;
              const extractedArgs: { [key: string]: string } =
                {};

              while ((keyValueMatch = keyValueRegex.exec(argsString)) !== null) {
                const key = keyValueMatch[1];
                const value = keyValueMatch[3] || keyValueMatch[4]; // handles both single and double quotes
                extractedArgs[key] = value;
              }

              console.log("Extracted args", extractedArgs);
              const {
                filePath,
                commitMessage,
                branchName,
                pullRequestTitle,
                pullRequestBody,
                fileContent,
              } = extractedArgs;

              if (
                filePath &&
                commitMessage &&
                branchName &&
                pullRequestTitle &&
                pullRequestBody &&
                fileContent
              ) {
                pullRequestResult = await submitPullRequest(
                  filePath,
                  commitMessage,
                  branchName,
                  pullRequestTitle,
                  pullRequestBody,
                  fileContent
                );
              } else {
                pullRequestResult =
                  "Incomplete arguments extracted from the text response.";
              }
            } else {
              pullRequestResult =
                "Could not parse the function call from the text response.";
            }
          } catch (error) {
            console.error(
              "Error parsing function call from text:",
              error
            );
            pullRequestResult =
              "Error parsing function call from the text response.";
          }
        } else {
          pullRequestResult = "No function call proposed by the model.";
        }
        generatedContent = pullRequestResult;
      } else {
        const systemInstruction = `Generate a README for the code repository ${repository}, only return the contents of the README.\nFormat the README using standard Markdown syntax for text styling. Avoid using code blocks unless displaying code.\nYou do not need to include the code directly in the README, you may chose to include the file path if required.\nWrite the README in a way that is easy to understand for a beginner.\nInclude a short description of what the repository contains, an overview of the code, architecture (if applicable) and how to set up and use it.\nAlso include brief notes that the reader should look out for when using the repository such as not commiting their env file.`;

        generatedContent =
          (await generateWithSystemInstructionAndConfig(
            systemInstruction,
            finalPrompt,
            {
              temperature: modelTemperature,
            }
          )) || "";
      }

      cache.set("generatedContent", generatedContent);
    }

    setOutput(generatedContent);
    setLoading(false);
  };

```

**Explanation of Changes:**

1.  **String Parsing:** The code now attempts to parse the function call from the `genWithToolsResponse.text` property.  It uses regular expressions to:
    *   Extract the function name and arguments.
    *   Extract the key-value pairs for each argument.

2.  **Regular Expressions:**
    *   `functionCallRegex`:  This regex looks for the `submit_pull_request()` call with arguments inside the parentheses.
    *   `keyValueRegex`: This regex extracts the key-value pairs (e.g., `filePath='README.md'`) from the arguments string.  It handles both single and double quotes around the values.

3.  **Argument Extraction:** The extracted key-value pairs are stored in the `extractedArgs` object.
4.  **`submitPullRequest` Call:**  If all required arguments are successfully extracted, the `submitPullRequest` function is called with the extracted arguments.
5.  **Error Handling:**  The code includes error handling to catch any exceptions that might occur during the parsing process and provides informative error messages.
6.   **If Statement:** Make sure the code runs and gets the response text before the parsing by checking `if (genWithToolsResponse && genWithToolsResponse.text)`

**Important Considerations:**

*   **Prompt Engineering:**  Since you're now relying on string parsing, it's *crucial* to carefully design your prompts to ensure that the model consistently generates the function call in the expected format.  Be very specific about how the arguments should be formatted. For example, instruct the model to always use single quotes around string values and to include all required arguments.
*   **Robustness:** This approach is less robust than using the structured function calling feature. The string parsing might break if the model generates the output in a slightly different format.
*   **Prompt:** It is likely the prompt is not forcing function calls. Ensure to configure the prompt to use tool calls and set the function calling config to ANY or REQUIRED.
*   **Alternative Approaches:** If possible, try to debug why the model isn't returning the function call in the structured `functionCall` object.  Check the API documentation, experiment with different models, and review your function declaration.

**Debugging Steps:**

1.  **Console Logging:** Use `console.log` to print the values of `genWithToolsResponse.text`, `match`, `argsString`, `extractedArgs`, and other relevant variables to see exactly what the code is parsing and extracting.

2.  **Regular Expression Testing:** Use a regular expression testing tool (like regex101.com) to test your regular expressions and ensure they are correctly matching the expected output.

3.  **Prompt Experimentation:** Try different prompts to see if you can influence the model to return the function call in a more structured format.

**Next Steps:**

1.  Implement the updated `generateREADME` function in your `CodeEdit.tsx` file.
2.  Test the function and carefully inspect the console output to see if the code is parsing the function call correctly.
3.  Adjust the regular expressions and parsing logic as needed to handle any variations in the model's output.
4.  Experiment with different prompts to improve the consistency and accuracy of the model's function call generation.

This approach will allow you to extract and use the arguments proposed by the model even when it's not using the structured function calling feature.  However, remember that this is a workaround, and it's best to try to get the structured function calling working if possible.

Make sure the Gemini API models in your area actually support Tool calls - it may be a local limitation that's forcing it to default back to text.
