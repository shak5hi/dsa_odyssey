export interface Question {
  id: string;
  name: string;
  diff: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  url: string;
}

export interface Quest extends Question {}
