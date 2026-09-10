export interface ExecutionRequest { language: string; code: string; tests: Array<{ input: string; expected: string }>; }
export interface ExecutionResult { status: "MOCK"|"PASSED"|"FAILED"|"ERROR"; stdout: string; stderr: string; runtimeMs: number; provider: string; }
export interface ExecutionProvider { run(request: ExecutionRequest): Promise<ExecutionResult>; }
class MockExecutionProvider implements ExecutionProvider {
  async run(request: ExecutionRequest): Promise<ExecutionResult> {
    return { status: "MOCK", stdout: `Received ${request.code.length} bytes of ${request.language} source. No untrusted code was executed.`, stderr: "", runtimeMs: 0, provider: "mock" };
  }
}
export function createExecutionProvider(provider: string): ExecutionProvider {
  if (provider === "mock") return new MockExecutionProvider();
  throw new Error(`Execution provider '${provider}' is not configured. Production execution must use an isolated sandbox service.`);
}
