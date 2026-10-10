import { MockInterviewStudio } from "@/components/mock-interview-studio";
import { getRepositories } from "@/lib/repositories";

export default async function MockInterviewPage() {
  const repositories = getRepositories();
  const questions = await repositories.questions.list({ sort: "CONFIDENCE", limit: 40 });
  return <MockInterviewStudio inventory={questions.data} />;
}
