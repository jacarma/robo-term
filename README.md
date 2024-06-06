# RoboTerm

A Node.js shell session manager that allows you to run shell commands and keep track of the current directory and environment variables between commands.

## Installation

To install `RoboTerm`, use npm:

```sh
npm install robo-term
```

## Usage

### Basic Usage

First, import the `RoboTerm` class and create a new instance. You can then use the `runCommand` method to run shell commands.

```typescript
import roboTerm from "robo-term";

const session = roboTerm();

const runCommands = async () => {
  try {
    let output = await session.runCommand("mkdir hello && cd hello");
    console.log("Created directory and changed to it:", output);

    output = await session.runCommand("pwd");
    console.log("Current directory:", output);

    output = await session.runCommand("echo $PATH");
    console.log("Environment PATH:", output);
  } catch (error) {
    console.error("Error:", error);
  }
};

runCommands();
```

### Configuration

The `roboTerm` factory accepts an options object to configure the shell session. Here are the available options:

- `shellCwd` (string): The initial working directory. Defaults to the current working directory.
- `shellEnv` (object): The environment variables to use for the shell session. Defaults to the current environment variables.
- `timeout` (number): The timeout for each command in milliseconds. Defaults to 60000 (60 seconds).
- `maxOutputSize` (number): The maximum output size in bytes. Defaults to 1024 \* 100 (100 KB).

### Methods

#### `runCommand(command: string): Promise<string>`

Runs the specified shell command and returns a promise that resolves with the command output. If the command changes the current directory or environment variables, the changes will be tracked and used for subsequent commands.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Author

Javi Carrasco

## Repository

[GitHub Repository](https://github.com/jacarma/robo-term)
