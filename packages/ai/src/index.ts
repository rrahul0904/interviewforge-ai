import type { InterviewQuestion } from "@interviewforge/core";
export interface CoachRequest { question: InterviewQuestion; code: string; message: string; }
export interface CoachResponse { answer: string; provider: string; nextHintLevel: number; }
export interface AiCoach { coach(request: CoachRequest): Promise<CoachResponse>; }
class MockCoach implements AiCoach {
  async coach({ question, message }: CoachRequest): Promise<CoachResponse> {
    return { provider: "mock", nextHintLevel: 1, answer: `For “${question.title}”, start by stating the invariant you need to preserve. Then test it against: ${question.constraints[0]}. Your question was: ${message}` };
  }
}
export function createAiCoach(provider: string): AiCoach {
  if (provider === "mock") return new MockCoach();
  throw new Error(`AI provider '${provider}' is not configured. Add a provider adapter instead of calling SDKs from product code.`);
}
