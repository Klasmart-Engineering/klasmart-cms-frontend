import { ApiPullOutcomeSetResponse, ModelOutcomeDetailView } from "../api/api.auto";
import { GetOutcomeDetail, OutcomeSetResult } from "../api/type";

export const modelOutcomeDetail = (outcomeDetail: ModelOutcomeDetailView) => {
  const afterData = JSON.parse(JSON.stringify(outcomeDetail));
  const { program, subject, developmental, skills, age, grade } = outcomeDetail;
  if (program && program.length) {
    afterData.program = program.map((item: any) => item.program_id);
    afterData.program = afterData.program.filter((item: string) => item);
  }
  if (subject && subject.length) {
    afterData.subject = subject.map((item: any) => item.subject_id);
    afterData.subject = afterData.subject.filter((item: string) => item);
  }
  if (developmental && developmental.length) {
    afterData.developmental = developmental.map((item: any) => item.developmental_id);
    afterData.developmental = afterData.developmental.filter((item: string) => item);
  }
  if (skills && skills.length) {
    afterData.skills = skills.map((item: any) => item.skill_id);
    afterData.skills = afterData.skills.filter((item: string) => item);
  }
  if (age && age.length) {
    afterData.age = age.map((item: any) => item.age_id);
    afterData.age = afterData.age.filter((item: string) => item);
  }
  if (grade && grade.length) {
    afterData.grade = grade.map((item: any) => item.grade_id);
    afterData.grade = afterData.grade.filter((item: string) => item);
  }
  return afterData;
};

export const ids2OutcomeSet = (ids: string[], outComeSets: ApiPullOutcomeSetResponse["sets"]): OutcomeSetResult => {
  if (!ids || !ids.length || !outComeSets || !outComeSets.length) return [];
  return outComeSets.filter((item) => ids.indexOf(item.set_id as string) >= 0);
};

export const findSetIndex = (id: string, outComeSets: ApiPullOutcomeSetResponse["sets"]): number => {
  if (!id || !outComeSets || !outComeSets.length) return -1;
  return outComeSets.findIndex((item) => item.set_id === id);
};

export const excluedOutcomeSet = (ids: string[], outComeSets: ApiPullOutcomeSetResponse["sets"]) => {
  if (!ids || !ids.length || !outComeSets || !outComeSets.length) return ids;
  const selectedIds = outComeSets.map((item) => item.set_id);
  selectedIds.forEach((item) => {
    const index = ids.indexOf(item as string);
    if (index >= 0) {
      ids.splice(index, 1);
    }
  });
  return ids;
};

export const isAllMineOutcome = (ids: string[], outcomeList: GetOutcomeDetail[], user_id: string) => {
  const selectedOutcome = outcomeList.filter((item) => ids.indexOf(item.outcome_id as string) >= 0);
  const index = selectedOutcome.findIndex((item) => item.author_id !== user_id);
  return !(index >= 0);
};

export function formattedNowOrTime(value?: number): string {
  let date = value ? new Date(Number(value) * 1000) : new Date();
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  const MMs = MM < 10 ? `0${MM}` : MM;
  let d = date.getDate();
  const ds = d < 10 ? `0${d}` : d;
  let h = date.getHours();
  // const dayType = h > 12 ? "PM" : "AM";
  // h = h > 12 ? h - 12 : h;
  const hs = h < 10 ? `0${h}` : h;
  let m = date.getMinutes();
  const ms = m < 10 ? `0${m}` : m;
  return `${y}${MMs}${ds}${hs}${ms}`;
}