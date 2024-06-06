import roboTerm, { RoboTerm } from "../src/index";

describe("RoboTerm", () => {
  let session: RoboTerm;

  beforeAll(() => {
    session = roboTerm();
  });

  test("should cd a directory and keep on it", async () => {
    const output = await session.runCommand("cd src && pwd");
    expect(output).toMatch(/src$/);

    const pwdOutput = await session.runCommand("pwd");
    expect(pwdOutput).toMatch(/src$/);
  });

  test("should print environment PATH", async () => {
    const output = await session.runCommand("echo $PATH");
    expect(output).toBeDefined();
  });

  test("should set an environment variable and retrieve it", async () => {
    await session.runCommand("export TEST_VAR=hello");
    const output = await session.runCommand("echo $TEST_VAR");
    expect(output).toBe("hello");
  });

  test("should handle large output", async () => {
    const largeCommand = "for i in {1..10000}; do echo $i; done";
    const output = await session.runCommand(largeCommand);
    expect(output.startsWith("1")).toBe(true);
    expect(output.endsWith("10000")).toBe(true);
  });

  test("should handle command timeouts", async () => {
    session = roboTerm({ timeout: 1000 }); // 1 second timeout
    await expect(session.runCommand("sleep 2")).rejects.toMatch(
      /ERROR: Command was killed after timeout./
    );
  });

  test("should handle maxOutputSize exceeded", async () => {
    session = roboTerm({ maxOutputSize: 1024 }); // 1 KB max output size
    await expect(
      session.runCommand("for i in {1..10000}; do echo $i; done")
    ).resolves.toBe("SUCCESS, but output was too big");
  });
});
