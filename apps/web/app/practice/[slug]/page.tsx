import { notFound } from "next/navigation";
import { PracticeWorkspace } from "@/components/practice-workspace";
import { getRepositories } from "@/lib/repositories";

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = await getRepositories().questions.findBySlug(slug);
  if (!question) notFound();
  return <main><PracticeWorkspace question={question} /></main>;
}
