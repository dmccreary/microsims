# Adding MicroSim Rules to Cursor IDE

Cursor uses a rules file called a "Markdown Completion" or "Markdown Contextual" file
that has the file extension `.mdc`

MDC files are a specialized format that Cursor uses for its AI-assisted coding features.
This extension indicates that the file contains rules, patterns, or guidance written in Markdown format that Cursor's AI capabilities can reference when providing completions and suggestions. The .mdc format allows Cursor to:

- Parse structured Markdown content
- Extract code examples and patterns
- Understand contextual rules for specific development scenarios
- Provide more tailored code completions based on the rules

When you create rules in an .mdc file, you're essentially giving Cursor IDE context-specific knowledge about how you want your code structured. This helps the AI understand your coding conventions, project-specific patterns, and development guidelines.
By using Markdown as the base format (indicated by the "md" part of the extension), Cursor makes it easy to include:

- Explanatory text
- Code examples
- Formatting rules
- Style guidelines

The "c" likely indicates the "completion" or "contextual" aspect that differentiates it from standard Markdown (.md) files.

Here's how to add the MicroSim development rules to your Cursor IDE:

## Steps to Save the Rules File

1. **Create the directory structure** (if it doesn't already exist):

```sh
mkdir -p .cursor/rules
```

2. **Save the rules file** as `.cursor/rules/microsim-rules.mdc`:

```sh
touch .cursor/rules/microsim-rules.mdc
```

3. **Copy and paste the contents** from our created rules into the file:

Open the newly created file in your text editor or IDE:

```sh
cursor .cursor/rules/microsim-rules.mdc
```
Paste the entire contents of the MicroSim Development Rules we created

4. **Verify the file location and contents**:
   ```bash
   cat .cursor/rules/microsim-rules.mdc
   ```

## Using the Rules in Cursor IDE

Once you've saved the rules file, you can reference it in Cursor IDE:

1. **Command Palette Method**:
   - Open Cursor IDE
   - Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) to open the command palette
   - Type "Rules: Load File" and select it
   - Enter the path: `.cursor/rules/microsim-rules.mdc`

2. **Direct Reference Method**:
   When working on a MicroSim project, you can tell Cursor to use these rules by adding a comment at the top of your file:
   ```javascript
   // @cursor-rule: .cursor/rules/microsim-rules.mdc
   
   // Your MicroSim code starts here
   ```

3. **Project Settings Method**:
   - Add a `.cursor-project` file to your project root
   - Include the following configuration:
     ```json
     {
       "rules": [".cursor/rules/microsim-rules.mdc"]
     }
     ```

## Verifying Rule Integration

To verify that Cursor is using your rules:

1. Create a new MicroSim JavaScript file
2. Reference the rules using one of the methods above
3. Start typing a common MicroSim structure (like `setup()`)
4. Cursor should offer completions and suggestions based on your rule patterns

## Troubleshooting

If the rules aren't being applied:

- Ensure the file path is correct (`.cursor/rules/microsim-rules.mdc`)
- Check that the file has the correct permissions
- Restart Cursor IDE to refresh rule cache
- Verify the MDC syntax is correctly formatted

This setup will allow Cursor to provide intelligent code completion and suggestions based on your MicroSim development standards across all your projects.