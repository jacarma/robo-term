import { exec, ExecException } from "child_process";

interface RoboTermOptions {
  shellCwd?: string;
  shellEnv?: NodeJS.ProcessEnv;
  timeout?: number;
  maxOutputSize?: number;
}

export type RoboTerm = ReturnType<typeof roboTerm>;

const roboTerm = ({
  shellCwd = process.cwd(),
  shellEnv = process.env,
  timeout = 60000, // 60 seconds
  maxOutputSize = 1024 * 100, // 100 KB
}: RoboTermOptions = {}) => {
  let commandInProgress = false;
  let cwd = shellCwd; // Track current working directory
  let env = { ...shellEnv }; // Track environment variables

  const runCommand = (command: string): Promise<string> => {
    if (commandInProgress) {
      return Promise.reject(new Error("A command is already in progress."));
    }

    commandInProgress = true;

    const fullCommand = `${command} && echo COMMAND_SUCCESSFUL && pwd && env`;

    return new Promise((resolve, reject) => {
      const options = { cwd, env, timeout };

      exec(fullCommand, options, (error, stdout, stderr) => {
        commandInProgress = false;
        if (error) {
          if (error.signal === "SIGTERM") {
            reject("ERROR: Command was killed after timeout.");
          } else {
            reject(`ERROR: ${error.message}\n${stderr}`);
          }
        } else {
          const [output, state] = stdout.split("COMMAND_SUCCESSFUL");
          if (state) updateState(state.trim());
          const out = output.trim();
          resolve(
            out.length > maxOutputSize ? "SUCCESS, but output was too big" : out
          );
        }
      });
    });
  };

  const updateState = (state: string): void => {
    // Update current working directory and environment variables
    const lines = state.split("\n");
    cwd = lines[0].trim();

    // Update environment variables
    env = lines.slice(1).reduce((env, line) => {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").trim();
      if (key && value) {
        env[key.trim()] = value;
      }
      return env;
    }, {} as NodeJS.ProcessEnv);
  };

  return { runCommand };
};

export default roboTerm;
