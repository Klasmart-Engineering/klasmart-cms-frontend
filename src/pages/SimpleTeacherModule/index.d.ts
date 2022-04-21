interface IContextState {
  curriculum?: "esl" | "steam";
  classLevel?: 1 | 2 | 3 | 4 | 5;
}

interface ILessonData {
  img: string;
  level: string;
  age: string;
  color: string;
}

interface INavIcon {
  src: string;
}

interface IListItem {
  active?: boolean;
}
