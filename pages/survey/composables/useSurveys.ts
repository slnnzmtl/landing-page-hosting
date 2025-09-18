interface QuestionBase {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}
interface TextQ extends QuestionBase {
  type: 'text' | 'email';
}
interface TextareaQ extends QuestionBase {
  type: 'textarea';
}
interface RadioQ extends QuestionBase {
  type: 'radio';
  options: { label: string; value: string }[];
}
interface SectionQ {
  type: 'section';
  title: string;
  description?: string;
  id?: string; // Added to support key prop
}
export interface SurveyDef {
  slug: string;
  title: string;
  description: string;
  questions: (TextQ | TextareaQ | RadioQ | SectionQ)[];
  googleForm: {
    action: string;
    entryMap: Record<string, string>;
    formId: string;
  };
}
export const useSurveys = () => {
  // Eagerly import all JSON survey definition files in data directory
  const modules = import.meta.glob('~/pages/survey/data/*.json', {
    eager: true,
  });
  // Extract default export (parsed JSON) from each module and cast
  const surveys = Object.values(modules).map(
    (m: any) => m.default || m
  ) as SurveyDef[];
  // (Optional) sort by title for consistent ordering
  surveys.sort((a, b) => a.title.localeCompare(b.title));

  const findSurvey = (slug: string) => {
    return surveys.find(s => s.slug === slug);
  };

  return {
    surveys,
    findSurvey,
  };
};
