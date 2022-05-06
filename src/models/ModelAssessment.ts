import { AssessmentTypeValues } from "@components/AssessmentType";
import { Dimension } from "@pages/DetailAssessment/MultiSelect";
import {
  V2AssessmentContentReply
} from "../api/api.auto";
import { } from "../api/type";
import {
  MaterialViewItemResultProps,
  OutcomeStatus,
  OverAllOutcomesItem,
  StudentParticipate,
  StudentViewItemsProps,
  SubDimensionOptions
} from "../pages/DetailAssessment/type";
import {
  DetailAssessmentResult,
  DetailAssessmentResultContent,
  DetailAssessmentResultOutcome,
  DetailAssessmentResultStudent
} from "../pages/ListAssessment/types";
// interface ObjContainId {
//   id?: string;
// }
// function toHash<T extends ObjContainId>(arr: T[]): Record<string, T> {
//   return arr.reduce<Record<string, T>>((result, item) => {
//     if (!item.id) return result;
//     result[item.id] = item;
//     return result;
//   }, {});
// }

export const ModelAssessment = {
  setInitFormValue(contents: DetailAssessmentResult["contents"], students: DetailAssessmentResult["students"]) {
    const _contents = contents
      ?.filter((item) => item.content_type === "LessonMaterial" && !item.parent_id)
      .map((item) => {
        const { content_id, parent_id, reviewer_comment, status } = item;
        return {
          content_id,
          parent_id,
          reviewer_comment,
          status,
        };
      });
    return { contents: _contents };
  },
  getStudentViewItems(
    students: DetailAssessmentResult["students"],
    contents: DetailAssessmentResult["contents"],
    outcomes: DetailAssessmentResult["outcomes"],
    assessment_type: AssessmentTypeValues
  ): StudentViewItemsProps[] | undefined {
    // const participateStudent = students?.filter((item) => item.status === StudentParticipate.Participate);
    const isHomefun = assessment_type === AssessmentTypeValues.homeFun;
    const contentObj: Record<string, DetailAssessmentResultContent> = {};
    const outcomeObj: Record<string, DetailAssessmentResultOutcome> = {};
    contents
      // ?.filter((item) => item.status === "Covered")
      ?.forEach((item) => {
        if (!contentObj[item.content_id!]) {
          contentObj[item.content_id!] = { ...item };
        }
      });
    outcomes?.forEach((item) => {
      if (!outcomeObj[item.outcome_id!]) {
        outcomeObj[item.outcome_id!] = { ...item };
      }
    });
    const studentViewItems: StudentViewItemsProps[] | undefined = students?.map((item) => {
      const { student_id, student_name, reviewer_comment, status, results } = item;
      return {
        student_id,
        student_name,
        reviewer_comment,
        status,
        attempted: isHomefun ? true : !results?.every((r) => r.attempted === false),
        results: isHomefun
          ? results?.map((result) => {
              const { outcomes } = result;
              return {
                ...result,
                outcomes: outcomes?.map((oItem) => {
                  if (outcomeObj[oItem.outcome_id!]) {
                    const { assumed, outcome_name } = outcomeObj[oItem.outcome_id!];
                    return {
                      ...oItem,
                      assumed,
                      outcome_name,
                    };
                  } else {
                    return { ...oItem };
                  }
                }),
              };
            })
          : results
              ?.filter((r) => !!contentObj[r.content_id!])
              .map((result) => {
                const { answer, attempted, content_id, score, outcomes } = result;
                const { content_name, content_type, content_subtype, file_type, max_score, number, parent_id, h5p_id, h5p_sub_id, status } =
                  contentObj[content_id!];
                return {
                  answer,
                  attempted,
                  content_id,
                  score,
                  content_name,
                  content_type,
                  content_subtype,
                  file_type,
                  max_score,
                  number,
                  parent_id,
                  h5p_id,
                  h5p_sub_id,
                  status,
                  outcomes: outcomes?.map((item) => {
                    if (outcomeObj[item.outcome_id!]) {
                      const { assumed, outcome_name, assigned_to } = outcomeObj[item.outcome_id!];
                      return {
                        ...item,
                        assumed,
                        outcome_name,
                        assigned_to,
                      };
                    } else {
                      return {
                        ...item,
                      };
                    }
                  }),
                };
              }),
      };
    });
    return studentViewItems;
  },
  getStudentViewItemsByContent(
    students: StudentViewItemsProps[] | undefined,
    contents: DetailAssessmentResult["contents"]
  ): StudentViewItemsProps[] | undefined {
    const contentObj: Record<string, DetailAssessmentResultContent> = {};
    contents
      // ?.filter((item) => item.status === "Covered")
      ?.forEach((item) => {
        if (!contentObj[item.content_id!]) {
          contentObj[item.content_id!] = { ...item };
        }
      });
    const studentViewItems: StudentViewItemsProps[] | undefined = students?.map((item) => {
      return {
        ...item,
        results: item.results?.map((ritem) => {
          return {
            ...ritem,
            status: contentObj[ritem.content_id!].status,
          };
        }),
      };
    });
    return studentViewItems;
  },
  getStudentViewItemByStudent(
    students: DetailAssessmentResult["students"],
    studentViewItems: StudentViewItemsProps[] | undefined
  ): StudentViewItemsProps[] | undefined {
    const studentObj: Record<string, DetailAssessmentResultStudent> = {};
    students?.forEach((item) => {
      if (!studentObj[item.student_id!]) {
        studentObj[item.student_id!] = { ...item };
      }
    });
    const new_studentViewItems: StudentViewItemsProps[] | undefined = studentViewItems?.map((item) => {
      const { status } = studentObj[item.student_id!];
      return {
        ...item,
        status,
      };
    });
    return new_studentViewItems;
  },
  getReviewStudentsItems(students: DetailAssessmentResult["diff_content_students"]): StudentViewItemsProps[] | undefined {
    const reviewStudentsItems: StudentViewItemsProps[] | undefined = students?.map((item) => {
      const { status, student_id, student_name, reviewer_comment, results } = item;
      return {
        status,
        student_id,
        student_name,
        reviewer_comment,
        attempted: !results?.every((r) => r.attempted === false),
        results: results?.map((rItem) => {
          const { answer, attempted, score, content } = rItem;
          return {
            answer,
            attempted,
            score,
            ...content,
          };
        }),
      };
    });
    return reviewStudentsItems;
  },
  getOverallOutcomes(studentViewItems: StudentViewItemsProps[] | undefined): OverAllOutcomesItem[] {
    let outcomeView: Record<string, OverAllOutcomesItem> = {};
    let overAllOutcomes: OverAllOutcomesItem[] = [];
    studentViewItems
      ?.filter((item) => item.status === StudentParticipate.Participate)
      ?.forEach((sItem) => {
        const { student_id } = sItem;
        sItem.results?.forEach((rItem) => {
          if (rItem.content_type === "LessonMaterial") {
            rItem.outcomes?.forEach((oItem) => {
              const { outcome_id, status, outcome_name, assumed, assigned_to } = oItem;
              if (!outcomeView[outcome_id!]) {
                outcomeView[outcome_id!] = {
                  outcome_id,
                  outcome_name,
                  assumed,
                  assigned_to,
                  attendance_ids: status === OutcomeStatus.Achieved ? [student_id!] : [],
                  not_attendance_ids: status !== OutcomeStatus.Achieved ? [student_id!] : [],
                  partial_attendance_ids: [],
                  none_achieved: status === OutcomeStatus.NotAchieved,
                  skip: status === OutcomeStatus.NotCovered,
                };
              } else {
                const { none_achieved, skip, attendance_ids, not_attendance_ids } = outcomeView[outcome_id!];
                outcomeView[outcome_id!].none_achieved = status === "NotAchieved" && none_achieved;
                outcomeView[outcome_id!].skip = status === "NotCovered" && skip;
                const a_index = attendance_ids?.indexOf(student_id!) ?? -1;
                const n_index = not_attendance_ids?.indexOf(student_id!) ?? -1;
                if (status === "Achieved") {
                  if (a_index < 0 && n_index < 0) {
                    outcomeView[outcome_id!].attendance_ids?.push(student_id!);
                  }
                  if (n_index >= 0) {
                    outcomeView[outcome_id!].partial_attendance_ids?.push(student_id!);
                    if (a_index >= 0) {
                      outcomeView[outcome_id!].attendance_ids?.splice(a_index, 1);
                    }
                  }
                } else {
                  if (a_index >= 0) {
                    outcomeView[outcome_id!].partial_attendance_ids?.push(student_id!);
                    outcomeView[outcome_id!].attendance_ids?.splice(a_index, 1);
                  }
                  if (n_index < 0) {
                    outcomeView[outcome_id!].not_attendance_ids?.push(student_id!);
                  }
                }
              }
            });
          } else {
            rItem.outcomes?.forEach((oItem) => {
              const { outcome_id, status, outcome_name, assumed, assigned_to } = oItem;
              if (oItem.assigned_to?.length === 1) {
                if (!outcomeView[outcome_id!]) {
                  outcomeView[outcome_id!] = {
                    outcome_id,
                    outcome_name,
                    assumed,
                    assigned_to,
                    attendance_ids: status === OutcomeStatus.Achieved ? [student_id!] : [],
                    not_attendance_ids: [],
                    partial_attendance_ids: [],
                    none_achieved: status === OutcomeStatus.NotAchieved,
                    skip: status === OutcomeStatus.NotCovered,
                  };
                } else {
                  const { none_achieved, skip, attendance_ids = [] } = outcomeView[outcome_id!];
                  outcomeView[outcome_id!].none_achieved = status === OutcomeStatus.NotAchieved && none_achieved;
                  outcomeView[outcome_id!].skip = status === OutcomeStatus.NotCovered && skip;
                  const a_index = attendance_ids?.indexOf(student_id!) ?? -1;
                  if (status === OutcomeStatus.Achieved) {
                    if (a_index < 0) {
                      outcomeView[outcome_id!].attendance_ids?.push(student_id!);
                    }
                  } else {
                    if (a_index >= 0) {
                      outcomeView[outcome_id!].attendance_ids?.splice(a_index, 1);
                    }
                  }
                }
              }
            });
          }
        });
      });
    overAllOutcomes = Object.values(outcomeView);
    return overAllOutcomes;
  },
  getMaterialViewItems(
    // contents: DetailAssessmentResult["contents"],
    // students: DetailAssessmentResult["students"],
    studentViewItems?: StudentViewItemsProps[]
  ): MaterialViewItemResultProps[] {
    const materialViewObj: Record<string, MaterialViewItemResultProps> = {};
    let materialViewItems: MaterialViewItemResultProps[] = [];
    studentViewItems?.forEach((sItem) => {
      const { student_id, student_name } = sItem;
      sItem.results
        // ?.filter((r) => r.content_type === "LessonMaterial" || r.content_type === "Unknown")
        ?.forEach((rItem) => {
          const {
            content_id,
            content_name,
            number,
            content_subtype,
            answer,
            score,
            max_score,
            file_type,
            parent_id,
            outcomes,
            status,
            attempted,
            h5p_id,
            h5p_sub_id,
          } = rItem;
          if (!materialViewObj[content_id!]) {
            materialViewObj[content_id!] = {
              content_id,
              content_name,
              content_subtype,
              number,
              max_score,
              file_type,
              parent_id,
              status,
              attempted,
              h5p_id,
              h5p_sub_id,
              students: [
                {
                  student_id,
                  student_name,
                  answer,
                  score,
                  attempted,
                  status: sItem.status,
                },
              ],
              outcomes: outcomes?.map((oItem) => {
                const { outcome_id, outcome_name, assumed, status } = oItem;
                return {
                  outcome_id,
                  outcome_name,
                  assumed,
                  status,
                  attendance_ids: status === OutcomeStatus.Achieved ? [student_id!] : [],
                };
              }),
            };
          } else {
            materialViewObj[content_id!].students?.push({ student_id, student_name, answer, score, attempted, status: sItem.status });
            materialViewObj[content_id!].outcomes = materialViewObj[content_id!].outcomes?.map((oItem) => {
              const currOutcome = outcomes?.find((item) => item.outcome_id === oItem.outcome_id);
              const _attendance_ids = oItem.attendance_ids ?? [];
              let n_attendance_ids: string[] = [];
              if (currOutcome?.status === OutcomeStatus.Achieved) {
                n_attendance_ids = [..._attendance_ids, student_id!];
              }
              return {
                ...oItem,
                attendance_ids: currOutcome?.status === OutcomeStatus.Achieved ? n_attendance_ids : _attendance_ids,
              };
            });
          }
        });
    });
    materialViewItems = Object.values(materialViewObj);
    return materialViewItems;
  },
  getInitSubDimension(dimension: Dimension, studentViewItems: any[] | undefined): SubDimensionOptions[] | undefined {
    if (dimension !== Dimension.material) {
      const participateStudent = studentViewItems?.filter((student) => student.status === StudentParticipate.Participate);
      if (dimension === Dimension.student || dimension === Dimension.all) {
        return participateStudent?.map((item) => {
          return { id: item.student_id!, name: item.student_name! };
        });
      }
      if (dimension === Dimension.submitted) {
        return participateStudent
          ?.filter((student) => student.results.length && !!student.results[0].student_feed_backs)
          .map((item) => {
            return { id: item.student_id!, name: item.student_name! };
          });
      }
      if (dimension === Dimension.notSubmitted) {
        return participateStudent
          ?.filter((student) => !student.results.length || (student.results.length && !student.results[0].student_feed_backs))
          .map((item) => {
            return { id: item.student_id!, name: item.student_name! };
          });
      }
    } else {
      if (studentViewItems && studentViewItems[0] && studentViewItems[0].results) {
        return studentViewItems[0].results
          .filter(
            (item: { content_type: string; status: string; parent_id: string }) =>
              item.content_type === "LessonMaterial" && item.status === "Covered" && item.parent_id === ""
          )
          .map((item: { content_id: any; content_name: any }) => {
            return { id: item.content_id!, name: item.content_name! };
          });
      } else {
        return [];
      }
    }
  },
  getUpdateAssessmentData(
    assessment_type: AssessmentTypeValues,
    contents?: V2AssessmentContentReply[],
    students?: StudentViewItemsProps[]
  ) {
    const isReivew = assessment_type === AssessmentTypeValues.review;
    const isHomefun = assessment_type === AssessmentTypeValues.homeFun;
    const _contents =
      contents?.map((item) => {
        const { content_id, content_subtype, content_type, parent_id, status, reviewer_comment } = item;
        return {
          content_id,
          content_subtype,
          content_type,
          parent_id,
          status,
          reviewer_comment,
        };
      }) ?? [];
    const _students =
      students?.map((item) => {
        const { student_id, status, reviewer_comment, results } = item;
        return {
          student_id,
          reviewer_comment,
          status,
          results: isHomefun
            ? results?.map((rItem) => {
                const { assess_score, outcomes, student_feed_backs } = rItem;
                return {
                  assess_score,
                  assess_feedback_id: student_feed_backs ? student_feed_backs[0].id : "",
                  assignments: student_feed_backs
                    ? student_feed_backs[0].assignments?.map((aItem) => {
                        return {
                          id: aItem.id,
                          review_attachment_id: aItem.review_attachment_id,
                        };
                      })
                    : [],
                  outcomes: outcomes?.map((oItem) => {
                    const { outcome_id, status } = oItem;
                    return {
                      outcome_id,
                      status,
                    };
                  }),
                };
              })
            : results?.map((rItem) => {
                const { content_id, parent_id, score, outcomes } = rItem;
                return {
                  content_id,
                  parent_id,
                  score: Number(score),
                  outcomes: isReivew
                    ? undefined
                    : outcomes?.map((oItem) => {
                        const { outcome_id, status } = oItem;
                        return {
                          outcome_id,
                          status,
                        };
                      }),
                };
              }),
        };
      }) ?? [];
    return { _contents, _students };
  },
  getCompleteStatus(studentViewItems?: StudentViewItemsProps[]) {
    let hasNotAttemptArr: boolean[] = [];
    if (studentViewItems && studentViewItems[0]) {
      hasNotAttemptArr = studentViewItems.map((item) => {
        let all: number = 0;
        let attempt: number = 0;
        if (item.results && item.results[0]) {
          item.results.forEach((v) => {
            if (v.content_type === "LessonMaterial") {
              if (v.h5p_id) {
                all += 1;
                if (v.attempted) {
                  attempt += 1;
                }
              }
            }
          });
        }
        const hasNotAttempt = all && attempt && all > attempt ? true : false;
        return hasNotAttempt;
      });
    }
    return !!hasNotAttemptArr.find((item) => item);
  },
  getCompleteRateV2(studentViewItems?: StudentViewItemsProps[]) {
    let all: number = 0;
    let attempt: number = 0;
    if (studentViewItems && studentViewItems[0]) {
      studentViewItems.forEach((item) => {
        if (item.results && item.results[0]) {
          item.results.forEach((v) => {
            if (v.h5p_id) {
              all += 1;
              if (v.attempted) {
                attempt += 1;
              }
            }
          });
        }
      });
    }
    return { all, attempt };
  },
};
