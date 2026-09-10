import {
  queryQuestions,
  type CompanyRepository,
  type ForumRepository,
  type QuestionQuery,
  type QuestionRepository,
} from "@interviewforge/core";
import { companies, forumPosts, questions } from "./demo-data";

class DemoQuestionRepository implements QuestionRepository {
  async list(query: QuestionQuery = {}) { return queryQuestions(questions, query); }
  async findBySlug(slug: string) { return questions.find((question) => question.slug === slug) ?? null; }
}

class DemoCompanyRepository implements CompanyRepository {
  async list() { return companies; }
  async findBySlug(slug: string) { return companies.find((company) => company.slug === slug) ?? null; }
  async questionsForCompany(slug: string, query: QuestionQuery = {}) {
    const company = await this.findBySlug(slug);
    if (!company) return { data: [], total: 0, offset: 0, limit: query.limit ?? 25, nextOffset: null };
    return queryQuestions(questions, { ...query, company: company.name });
  }
}

class DemoForumRepository implements ForumRepository {
  async list() { return forumPosts; }
  async findById(id: string) { return forumPosts.find((post) => post.id === id) ?? null; }
}

const demoQuestionRepository = new DemoQuestionRepository();
const demoCompanyRepository = new DemoCompanyRepository();
const demoForumRepository = new DemoForumRepository();

export function getRepositories() {
  const backend = process.env.DATA_BACKEND ?? "demo";
  if (backend !== "demo") {
    throw new Error(`DATA_BACKEND '${backend}' is not configured. Use 'demo' until the PostgreSQL repository adapter is enabled.`);
  }
  return {
    questions: demoQuestionRepository as QuestionRepository,
    companies: demoCompanyRepository as CompanyRepository,
    forum: demoForumRepository as ForumRepository,
  };
}
