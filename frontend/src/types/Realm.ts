import { Question } from './Quest';

export interface Realm {
  id: string;
  name: string;
  icon: string;
  pattern: string;
  color: string;
  group: string;
  month: number;
  artifact: { icon: string; name: string; desc: string };
  lore: string;
  questions: Question[];
}
