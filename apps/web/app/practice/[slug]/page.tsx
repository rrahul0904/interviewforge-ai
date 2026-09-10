import { notFound } from "next/navigation";
import { PracticeWorkspace } from "@/components/practice-workspace";
import { getQuestion } from "@/lib/demo-data";

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = getQuestion(slug);
  if (!question) notFound();
  return <main><PracticeWorkspace question={question} /></main>;
}
