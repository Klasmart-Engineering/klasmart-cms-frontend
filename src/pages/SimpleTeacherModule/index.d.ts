interface IContextState {
  curriculum?: "esl" | "steam";
  classLevel?: 1 | 2 | 3 | 4 | 5;
  unitId?: string;
  planId?: string;
}

interface ILessonData {
  img: string;
  level: string;
  age: string;
  color: string;
}

interface INavIcon {
  src: string;
  onClick: () => void;
}

interface IListItemProps {
  active?: boolean;
  thumbnail: string;
  onClick: () => void;
  itemRef: (button: HTMLButtonElement) => void;
}

interface IListItem {
  content_id: string;
  data: string;
  description: string;
  id: string;
  name: string;
  no: number;
  thumbnail: string;
}
interface IPresentListProps {
  activeIndex: number;
  list: Array<IListItem>;
  onClick: (index: number) => void;
}

interface IPresentActivityState {
  activeIndex: number;
  lessonMaterials: IListItem[];
}

interface IPlayerProps {
  data: {
    source: string;
    file_type: number;
    input_source: number;
  };
  lessonNo: number;
  name: string;
  progress: string;
}

interface IUnitState {
  id: string;
  name: string;
  no: number;
}
interface ITeachingList {
  unitId: string;
  id: string;
  name: string;
  no: number;
  thumbnail: string;
  description: string;
  content_id: string;
}

interface IMediaControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}
interface IVideoPlayerProps {
  source: string;
}
