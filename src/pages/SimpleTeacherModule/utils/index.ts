export const px2vw = (px: number) => `${(px / 2560) * 100}vw`;

export const noRepeat = (arr: LessonItem[]) => {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      if (arr[i].id === arr[j].id && i !== j) {
        arr.splice(j, 1);
      }
    }
  }
  return arr;
};
