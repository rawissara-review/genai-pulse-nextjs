export interface FormData {
  email: string;
  role: string;
  isChampion: boolean | null;
  tools: string[];
  frequency: string;
  promptCount: string;
  ratings: { confidence: number; efficiency: number; prompt: number; teamSupport: number };
  timeSaved: string;
  barriers: string[];
  freeText: string;
  followUp: boolean;
}

export type StoredResponse = FormData & { id: string; submittedAt: string };

export const INITIAL_FORM: FormData = {
  email: '',
  role: '',
  isChampion: null,
  tools: [],
  frequency: '',
  promptCount: '',
  ratings: { confidence: 0, efficiency: 0, prompt: 0, teamSupport: 0 },
  timeSaved: '',
  barriers: [],
  freeText: '',
  followUp: false,
};
