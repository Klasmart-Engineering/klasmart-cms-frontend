### 下列 api 接口被引用，需要替换

api.contents.getLiveToken = getContentLiveToken
api.contentsResources.getContentResourceUploadPath = api.contentsResources.getContentResourceUploadPath
api.learningOutcomes.searchLearningOutcomes = api.learningOutcomes.searchLearningOutcomes
api.schedules.createSchedule = api.schedules.addSchedule
api.schedules.getLiveToken = api.schedules.getScheduleLiveToken
api.schedules.getSchedulesById = api.schedules.getScheduleById
api.schedules.querySchedules = api.schedules.querySchedule
api.schedulesTimeView.schedulesTimeView = api.schedulesTimeView.getScheduleTimeView

### 类型替换

CommonShort = EntityAssessmentAttendanceView | EntityAssessmentProgram | EntityAssessmentSubject | EntityAssessmentTeacher | EntityScheduleShortInfo
Content = EntityContentInfoWithDetails
ContentIDListRequest = ApiContentBulkOperateRequest
CreateContentRequest = EntityCreateContentRequest
CreateLearningOutComesRequest = ApiOutcomeCreateView
CreateLearningOutcomesResponse = ApiOutcomeCreateResponse
LearningOutcomes = ApiOutcomeView
OutcomesIDListRequest = ApiOutcomeIDList
Schedule = EntityScheduleSearchView
ScheduleCreate = EntityScheduleAddView
ScheduleDetailed = EntityScheduleDetailsView
ScheduleTimeView = EntityScheduleListView

### 函数接口冲突

| 函数名                  | 地址                                          | 原参数           | 现参数     | 说明 ｜  |
| ----------------------- | --------------------------------------------- | ---------------- | ---------- | -------- |
| publishContent          | PUT:/contents/{content_id}/publish            | content_id, data | content_id | 漏了参数 |
| rejectLearningOutcomes  | PUT:/learning_outcomes/\${outcome_id}/reject  | outcome_id, data | outcome_id |
| publishLearningOutcomes | PUT:/learning_outcomes/\${outcome_id}/publish | outcome_id, data | outcome_id |

| 函数名              | 地址                                     | 原参数           | 现参数     | 说明 | 原返回值    | 先返回值 |
| ------------------- | ---------------------------------------- | ---------------- | ---------- | ---- | ----------- | -------- |
| searchContents      | GET:/contents                            |                  |            |      | rotal, list | list     |
| rejectContentReview | PUT:/contents/{content_id}/review/reject | content_id, data | content_id |
| getAssessment       | GET:/assessments/{id}                    | id: string       | id: number |
| updateAssessment    | PUT:/assessments/{id}                    | id: string       | id: number |
