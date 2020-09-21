/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type AssetCreateRequest = {
  content_type?: 10 | 11 | 12 | 13;
  name?: string;
  program?: string[];
  subject?: string[];
  developmental?: string[];
  skills?: string[];
  age?: string[];
  grade?: string[];
  keywords?: string[];
  description?: string;
  thumbnail?: string;
  data?: string;
  extra?: string;
};

export type CreateContentRequest = {
  content_type?: 1 | 2 | 3 | 10 | 11 | 12 | 13;
  name?: string;
  program?: string[];
  subject?: string[];
  outcomes?: string[];
  developmental?: string[];
  skills?: string[];
  age?: string[];
  grade?: string[];
  suggest_time?: number;
  keywords?: string[];
  description?: string;
  thumbnail?: string;
  data?: string;
  extra?: string;
  publish_scope?: string;
};

export type PublishContentRequest = { scope?: string };

export type ContentIDListRequest = { id?: string[] };

export type RejectReasonRequest = { reject_reason?: string };

export type RejectCMSReasonRequest = { reject_reason?: string[] };

export type LockContentResponse = { id?: string };

export type ContentCondition = {
  content_type?: string;
  scope?: string;
  publish_status?: "draft" | "pending" | "published" | "rejected" | "archive";
  author?: string;
  org?: string;
  bookmark?: string;
};

export type Content = {
  id?: string;
  content_type?: 1 | 2 | 3 | 10 | 11 | 12 | 13;
  name?: string;
  program?: string[];
  outcomes?: string[];
  subject?: string[];
  suggest_time?: number;
  reject_reason?: string[];
  developmental?: string[];
  skills?: string[];
  age?: string[];
  grade?: string[];
  keywords?: string[];
  description?: string;
  thumbnail?: string;
  version?: number;
  source_id?: string;
  locked_by?: string;
  data?: string;
  extra?: string;
  author?: string;
  author_name?: string;
  org?: string;
  publish_scope?: string;
  publish_status?: "draft" | "pending" | "published" | "rejected" | "archive";
  content_type_name?: string;
  program_name?: string[];
  grade_name?: string[];
  subject_name?: string[];
  developmental_name?: string[];
  skills_name?: string[];
  age_name?: string[];
  org_name?: string;
  outcome_entities?: {
    outcome_id?: string;
    outcome_name?: string;
    shortcode?: string;
    assumed?: boolean;
    author_id?: string;
    author_name?: string;
    ancestor_id?: string;
  }[];
  created_at?: number;
};

export type Asset = {
  id?: string;
  content_type?: 10 | 11 | 12 | 13;
  name?: string;
  program?: string[];
  outcomes?: string[];
  subject?: string[];
  reject_reason?: string;
  developmental?: string[];
  skills?: string[];
  age?: string[];
  grade?: string[];
  keywords?: string[];
  description?: string;
  thumbnail?: string;
  data?: string;
  extra?: string;
  author?: string;
  author_name?: string;
  org?: string;
  publish_scope?: string;
  publish_status?: "draft" | "pending" | "published" | "rejected" | "archive";
  content_type_name?: string;
  program_name?: string[];
  grade_name?: string[];
  subject_name?: string[];
  developmental_name?: string[];
  skills_name?: string[];
  age_name?: string[];
  org_name?: string;
  created_at?: number;
};

/**
 * Asset
 */
export interface CategoryCreateRequest {
  /** category name */
  name?: string;

  /** parent category id */
  parent_id?: string;
}

/**
 * Category
 */
export interface Category {
  /** CategoryID */
  id?: string;

  /** asset name */
  name?: string;

  /** ParentCategoryID */
  parent_id?: string;
}

/**
 * schedule short info
 */
export interface Schedule {
  /** schedule id */
  id?: string;

  /** schedule title */
  title?: string;

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;
  lesson_plan?: CommonShort;
  program?: CommonShort;
  subject?: CommonShort;
  class?: CommonShort;
  teachers?: CommonShort[];
}

/**
 * schedule home short info
 */
export interface ScheduleTimeView {
  /** schedule id */
  id?: string;

  /** schedule title */
  title?: string;

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;

  /** If true, schedule is repeat */
  is_repeat?: boolean;

  /** schedule lesson_plan_id */
  lesson_plan_id?: string;
}

/**
 * schedule create info
 */
export interface ScheduleCreate {
  /** schedule title */
  title?: string;

  /** schedule class id */
  class_id?: string;

  /** schedule lesson_plan_id */
  lesson_plan_id?: string;

  /** schedule teacher_ids */
  teacher_ids?: string[];

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;

  /** repeat options, only work when mode_type equal Repeat, */
  repeat?: {
    type?: "daily" | "weekly" | "monthly" | "yearly";
    daily?: { interval?: number; end?: RepeatEnd };
    weekly?: {
      interval?: number;
      on?: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[];
      end?: RepeatEnd;
    };
    monthly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_day?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
      end?: RepeatEnd;
    };
    yearly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_month?: number;
      on_date_day?: number;
      on_week_month?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
      end?: RepeatEnd;
    };
  };

  /** schedule SubjectID */
  subject_id?: string;

  /** schedule ProgramID */
  program_id?: string;

  /** schedule class_type */
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";

  /** If I schedule the time as homework or task, then I should be able to set a due date. This is optional for me. The due date cannot be earlier than class end time. */
  due_at?: number;

  /** schedule description */
  description?: string;
  attachment?: CommonShort;

  /** If true, skip the conflict detection */
  is_force?: boolean;

  /** If true, schedule will repeat */
  is_repeat?: boolean;

  /** all_day flag */
  is_all_day?: boolean;

  /** time zone offset(second) */
  time_zone_offset?: number;
}

/**
 * schedule create info
 */
export interface ScheduleUpdate {
  /** schedule title */
  title?: string;

  /** schedule lessonPlan name */
  class_id?: string;

  /** schedule title */
  lesson_plan_id?: string;

  /** schedule lessonPlan name */
  teacher_ids?: string[];

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;

  /** repeat edit option */
  repeat_edit_options?: "only_current" | "with_following";

  /** repeat options, only work when mode_type equal Repeat, */
  repeat?: {
    type?: "daily" | "weekly" | "monthly" | "yearly";
    daily?: { interval?: number; end?: RepeatEnd };
    weekly?: {
      interval?: number;
      on?: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[];
      end?: RepeatEnd;
    };
    monthly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_day?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
      end?: RepeatEnd;
    };
    yearly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_month?: number;
      on_date_day?: number;
      on_week_month?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
      end?: RepeatEnd;
    };
  };

  /** schedule SubjectID */
  subject_id?: string;

  /** schedule ProgramID */
  program_id?: string;

  /** schedule class_type */
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";

  /** If I schedule the time as homework or task, then I should be able to set a due date. This is optional for me. The due date cannot be earlier than class end time. */
  due_at?: number;

  /** schedule description */
  description?: string;
  attachment?: CommonShort;

  /** If true, skip the conflict detection */
  is_force?: boolean;

  /** If true, schedule will repeat */
  is_repeat?: boolean;

  /** all_day flag */
  is_all_day?: boolean;

  /** time zone offset(second) */
  time_zone_offset?: number;
}

/**
 * schedule create info
 */
export interface ScheduleDetailed {
  /** schedule id */
  id?: string;

  /** schedule title */
  title?: string;
  class?: CommonShort;
  lesson_plan?: CommonShort;
  teachers?: CommonShort[];

  /** schedule start time, timestamp */
  start_at?: number;

  /** schedule end time, timestamp */
  end_at?: number;

  /** repeat options, only work when mode_type equal Repeat, */
  repeat?: {
    type?: "daily" | "weekly" | "monthly" | "yearly";
    daily?: { interval?: number; end?: RepeatEnd };
    weekly?: {
      interval?: number;
      on?: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[];
      end?: RepeatEnd;
    };
    monthly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_day?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
      end?: RepeatEnd;
    };
    yearly?: {
      interval?: number;
      on_type?: "date" | "week";
      on_date_month?: number;
      on_date_day?: number;
      on_week_month?: number;
      on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
      on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
      end?: RepeatEnd;
    };
  };
  subject?: CommonShort;
  program?: CommonShort;

  /** schedule class_type */
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";

  /** If I schedule the time as homework or task, then I should be able to set a due date. This is optional for me. The due date cannot be earlier than class end time. */
  due_at?: number;

  /** schedule description */
  description?: string;
  attachment?: CommonShort;

  /** all_day flag */
  is_all_day?: boolean;

  /** If true, schedule is repeat */
  is_repeat?: boolean;
}

/**
 * short info
 */
export interface CommonShort {
  /** id */
  id?: string;

  /** name */
  name?: string;
}

/**
 * repeat end options
 */
export interface RepeatEnd {
  type?: "never" | "after_count" | "after_time";

  /** end after N count */
  after_count?: number;

  /** end after the time(unix timestamp) */
  after_time?: number;
}

export type CreateLearningOutComesRequest = {
  outcome_name?: string;
  author_id?: string;
  author_name?: string;
  assumed?: boolean;
  shortcode?: string;
  organization_id?: string;
  program?: string[];
  subject?: string[];
  reject_reason?: string;
  developmental?: string[];
  skills?: string[];
  age?: string[];
  grade?: string[];
  estimated_time?: number;
  keywords?: string[];
  description?: string;
};

export type CreateLearningOutcomesResponse = {
  outcome_id?: string;
  ancestor_id?: string;
  shortcode?: string;
  assumed?: boolean;
  outcome_name?: string;
  program?: string[];
  subject?: string[];
  reject_reason?: string;
  developmental?: string[];
  skills?: string[];
  age?: string[];
  grade?: string[];
  estimated_time?: number;
  keywords?: string[];
  source_id?: string;
  locked_by?: string;
  author_id?: string;
  author_name?: string;
  organization_id?: string;
  organization_name?: string;
  publish_scope?: string;
  publish_status?: "draft" | "pending" | "published" | "rejected";
  description?: string;
  created_at?: number;
};

export type PublishLearningOutcomesRequest = { scope?: string };

export type OutcomesIDListRequest = { outcome_ids?: string[] };

export type LockLearningOutcomesResponse = { outcome_id?: string };

export type LearningOutcomes = {
  outcome_id?: string;
  ancestor_id?: string;
  shortcode?: string;
  assumed?: boolean;
  outcome_name?: string;
  program?: { program_id?: string; program_name?: string }[];
  subject?: { subject_id?: string; subject_name?: string }[];
  developmental?: { developmental_id?: string; developmental_name?: string }[];
  skills?: { skill_id?: string; skill_name?: string }[];
  age?: { age_id?: string; age_name?: string }[];
  grade?: { grade_id?: string; grade_name?: string }[];
  estimated_time?: number;
  reject_reason?: string;
  keywords?: string[];
  source_id?: string;
  locked_by?: string;
  author_id?: string;
  author_name?: string;
  organization_id?: string;
  organization_name?: string;
  publish_scope?: string;
  publish_status?: "draft" | "pending" | "published" | "rejected";
  description?: string;
  created_at?: number;
};

/**
 * live token
 */
export interface LiveToken {
  /** live token */
  token?: string;
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

type ApiConfig<SecurityDataType> = {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
};

enum BodyType {
  Json,
}

class HttpClient<SecurityDataType> {
  public baseUrl: string = "http://127.0.0.1:12345/v1";
  private securityData: SecurityDataType = null as any;
  private securityWorker: ApiConfig<SecurityDataType>["securityWorker"] = (() => {}) as any;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor({ baseUrl, baseApiParams, securityWorker }: ApiConfig<SecurityDataType> = {}) {
    this.baseUrl = baseUrl || this.baseUrl;
    this.baseApiParams = baseApiParams || this.baseApiParams;
    this.securityWorker = securityWorker || this.securityWorker;
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: RequestQueryParamsType, key: string) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(query[key]) ? query[key].join(",") : query[key]);
  }

  protected addQueryParams(rawQuery?: RequestQueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys.length
      ? `?${keys
          .map((key) =>
            typeof query[key] === "object" && !Array.isArray(query[key])
              ? this.addQueryParams(query[key] as object).substring(1)
              : this.addQueryParam(query, key)
          )
          .join("&")}`
      : "";
  }

  private bodyFormatters: Record<BodyType, (input: any) => any> = {
    [BodyType.Json]: JSON.stringify,
  };

  private mergeRequestOptions(params: RequestParams, securityParams?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {}),
      },
    };
  }

  private safeParseResponse = <T = any, E = any>(response: Response): Promise<T> =>
    response
      .json()
      .then((data) => data)
      .catch((e) => response.text);

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean
  ): Promise<T> =>
    fetch(`${this.baseUrl}${path}`, {
      // @ts-ignore
      ...this.mergeRequestOptions(params, (secureByDefault || secure) && this.securityWorker(this.securityData)),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    }).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
}

/**
 * @title KidsLoop 2.0 REST API
 * @version 1.0.0
 * @baseUrl http://127.0.0.1:12345/v1
 * KidsLoop 2.0 backend rest api
 */
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  contents = {
    /**
     * @tags content
     * @name searchContents
     * @request GET:/contents
     * @description Search content with condition
     */
    searchContents: (
      query?: {
        name?: string | null;
        content_type?: string | null;
        publish_status?: string | null;
        scope?: string | null;
        author?: string | null;
        org?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "id" | "-id" | "created_at" | "-created_at" | "updated_at" | "-updated_at" | "content_name" | "-content_name";
      },
      params?: RequestParams
    ) => this.request<{ total?: number; list?: Content[] }, any>(`/contents${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags content
     * @name createContent
     * @request POST:/contents
     * @description Create content
     */
    createContent: (data: CreateContentRequest, params?: RequestParams) =>
      this.request<LockContentResponse, any>(`/contents`, "POST", params, data),

    /**
     * @tags content
     * @name publishContent
     * @request PUT:/contents/{content_id}/publish
     * @description Publish content
     */
    publishContent: (content_id: string, data: PublishContentRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents/${content_id}/publish`, "PUT", params, data),

    /**
     * @tags content
     * @name lockContent
     * @request PUT:/contents/{content_id}/lock
     * @description Lock a content by content_id
     */
    lockContent: (content_id: string, params?: RequestParams) =>
      this.request<LockContentResponse, any>(`/contents/${content_id}/lock`, "PUT", params),

    /**
     * @tags content
     * @name getContentsStatistics
     * @request PUT:/contents/{content_id}/statistics
     * @description get content sub contents count and outcomes count by content_id
     */
    getContentsStatistics: (content_id: string, params?: RequestParams) =>
      this.request<any, any>(`/contents/${content_id}/statistics`, "PUT", params),

    /**
     * @tags content
     * @name approveContentReview
     * @request PUT:/contents/{content_id}/review/approve
     * @description Approve a content review by content_id
     */
    approveContentReview: (content_id: string, params?: RequestParams) =>
      this.request<any, any>(`/contents/${content_id}/review/approve`, "PUT", params),

    /**
     * @tags content
     * @name rejectContentReview
     * @request PUT:/contents/{content_id}/review/reject
     * @description Reject a content review by content_id
     */
    rejectContentReview: (content_id: string, data: RejectCMSReasonRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents/${content_id}/review/reject`, "PUT", params, data),

    /**
     * @tags content
     * @name getContentById
     * @request GET:/contents/{content_id}
     * @description Get content by content_id
     */
    getContentById: (content_id: string, params?: RequestParams) => this.request<Content, any>(`/contents/${content_id}`, "GET", params),

    /**
     * @tags content
     * @name updateContent
     * @request PUT:/contents/{content_id}
     * @description Update content by content_id
     */
    updateContent: (content_id: string, data: CreateContentRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents/${content_id}`, "PUT", params, data),

    /**
     * @tags content
     * @name deleteContent
     * @request DELETE:/contents/{content_id}
     * @description Delete content by content_id
     */
    deleteContent: (content_id: string, params?: RequestParams) => this.request<any, any>(`/contents/${content_id}`, "DELETE", params),

    /**
     * @tags content
     * @name getLiveToken
     * @summary get live token
     * @request GET:/contents/{content_id}/live/token
     * @secure
     * @description get live token
     */
    getLiveToken: (content_id: string, params?: RequestParams) =>
      this.request<LiveToken, any>(`/contents/${content_id}/live/token`, "GET", params, null, BodyType.Json, true),
  };
  contentsBulk = {
    /**
     * @tags content
     * @name publishContentBulk
     * @request PUT:/contents_bulk/publish
     * @description Publish content bulk
     */
    publishContentBulk: (data: ContentIDListRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents_bulk/publish`, "PUT", params, data),

    /**
     * @tags content
     * @name deleteContentBulk
     * @request DELETE:/contents_bulk
     * @description Delete content bulk
     */
    deleteContentBulk: (data: ContentIDListRequest, params?: RequestParams) =>
      this.request<any, any>(`/contents_bulk`, "DELETE", params, data),
  };
  contentsPrivate = {
    /**
     * @tags content
     * @name searchPrivateContents
     * @request GET:/contents_private
     * @description Search user's private content with condition
     */
    searchPrivateContents: (
      query?: {
        name?: string | null;
        content_type?: string | null;
        publish_status?: "draft" | "pending" | "published" | "rejected" | "archive";
        scope?: string | null;
        author?: string | null;
        org?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "id" | "-id" | "created_at" | "-created_at" | "updated_at" | "-updated_at" | "content_name" | "-content_name";
      },
      params?: RequestParams
    ) => this.request<{ total?: number; list?: Content[] }, any>(`/contents_private${this.addQueryParams(query)}`, "GET", params),
  };
  contentsPending = {
    /**
     * @tags content
     * @name searchPendingContents
     * @request GET:/contents_pending
     * @description Search pending content
     */
    searchPendingContents: (
      query?: {
        name?: string | null;
        content_type?: string | null;
        publish_status?: "draft" | "pending" | "published" | "rejected" | "archive";
        scope?: string | null;
        author?: string | null;
        org?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "id" | "-id" | "created_at" | "-created_at" | "updated_at" | "-updated_at" | "content_name" | "-content_name";
      },
      params?: RequestParams
    ) => this.request<{ total?: number; list?: Content[] }, any>(`/contents_pending${this.addQueryParams(query)}`, "GET", params),
  };
  contentsResources = {
    /**
     * @tags content
     * @name getContentResourcePath
     * @request GET:/contents_resources/{resource_id}
     * @description Get content resource path
     */
    getContentResourcePath: (resource_id: string, params?: RequestParams) =>
      this.request<any, any>(`/contents_resources/${resource_id}`, "GET", params),

    /**
     * @tags content
     * @name getContentResourceUploadPath
     * @request GET:/contents_resources
     * @description Get content resource upload path
     */
    getContentResourceUploadPath: (
      query?: { partition?: "assets" | "thumbnail" | "attachment" | "schedule_attachment"; extension?: string },
      params?: RequestParams
    ) => this.request<{ path?: string; resource_id?: string }, any>(`/contents_resources${this.addQueryParams(query)}`, "GET", params),
  };
  assets = {
    /**
     * @tags asset
     * @name queryAsset
     * @summary query asset
     * @request GET:/assets
     * @secure
     * @description query asset
     */
    queryAsset: (
      query?: {
        id?: string | null;
        name?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "id" | "-id" | "created_at" | "-created_at" | "updated_at" | "-updated_at" | "content_name" | "-content_name";
      },
      params?: RequestParams
    ) =>
      this.request<{ total?: number; list?: Asset[] }, any>(
        `/assets${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true
      ),

    /**
     * @tags asset
     * @name createAsset
     * @summary CreateAsset
     * @request POST:/assets
     * @secure
     * @description CreateAsset
     */
    createAsset: (data: AssetCreateRequest, params?: RequestParams) =>
      this.request<Asset, any>(`/assets`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags asset
     * @name getAsset
     * @summary GetAsset
     * @request GET:/assets/{asset_id}
     * @secure
     * @description GetAsset
     */
    getAsset: (asset_id: string, params?: RequestParams) =>
      this.request<Asset, any>(`/assets/${asset_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags asset
     * @name updateAsset
     * @summary update asset
     * @request PUT:/assets/{asset_id}
     * @secure
     * @description update asset
     */
    updateAsset: (asset_id: string, data: AssetCreateRequest, params?: RequestParams) =>
      this.request<Asset, any>(`/assets/${asset_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags asset
     * @name deleteAsset
     * @summary delete asset
     * @request DELETE:/assets/{asset_id}
     * @secure
     * @description delete asset
     */
    deleteAsset: (asset_id: string, params?: RequestParams) =>
      this.request<any, any>(`/assets/${asset_id}`, "DELETE", params, null, BodyType.Json, true),
  };
  crypto = {
    /**
     * @tags crypto
     * @name signH5pURL
     * @summary SignH5pURL
     * @request GET:/crypto/h5p/signature
     * @secure
     * @description Sign a h5p url
     */
    signH5PUrl: (query: { url: string }, params?: RequestParams) =>
      this.request<{ url?: string }, any>(`/crypto/h5p/signature${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),
  };
  categories = {
    /**
     * @tags category
     * @name queryCategory
     * @summary query category
     * @request GET:/categories
     * @secure
     * @description query category
     */
    queryCategory: (
      query?: {
        ids?: string | null;
        names?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "create_at" | "-create_at" | "last_update_at" | "last_update_at";
      },
      params?: RequestParams
    ) =>
      this.request<{ total?: number; list?: Category[] }, any>(
        `/categories${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true
      ),

    /**
     * @tags category
     * @name createCategory
     * @summary create category
     * @request POST:/categories
     * @secure
     * @description create category
     */
    createCategory: (data: CategoryCreateRequest, params?: RequestParams) =>
      this.request<Category, any>(`/categories`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags category
     * @name getCategory
     * @summary get category
     * @request GET:/categories/{category_id}
     * @secure
     * @description get category
     */
    getCategory: (category_id: string, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${category_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags category
     * @name updateCategory
     * @summary update category
     * @request PUT:/categories/{category_id}
     * @secure
     * @description update category
     */
    updateCategory: (category_id: string, data: CategoryCreateRequest, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${category_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags category
     * @name deleteCategory
     * @summary delete category
     * @request DELETE:/categories/{category_id}
     * @secure
     * @description delete category
     */
    deleteCategory: (category_id: string, params?: RequestParams) =>
      this.request<any, any>(`/categories/${category_id}`, "DELETE", params, null, BodyType.Json, true),
  };
  tag = {
    /**
     * @tags tag
     * @name queryTag
     * @summary query tag
     * @request GET:/tag
     * @secure
     * @description query tag
     */
    queryTag: (
      query?: {
        name?: string | null;
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "create_at" | "-create_at";
      },
      params?: RequestParams
    ) => this.request<{ total?: number; list?: any[] }, any>(`/tag${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags tag
     * @name createTag
     * @summary create tag
     * @request POST:/tag
     * @secure
     * @description Create Tag
     */
    createTag: (data: any, params?: RequestParams) => this.request<string, any>(`/tag`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags tag
     * @name GetTagByID
     * @summary get tag by id
     * @request GET:/tag/{tag_id}
     * @secure
     * @description get tag by id
     */
    getTagById: (tag_id: string, params?: RequestParams) =>
      this.request<any, any>(`/tag/${tag_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags tag
     * @name updateTag
     * @summary update tag
     * @request PUT:/tag/{tag_id}
     * @secure
     * @description update tag
     */
    updateTag: (tag_id: string, data: any, params?: RequestParams) =>
      this.request<any, any>(`/tag/${tag_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags tag
     * @name deleteTag
     * @summary delete tag
     * @request DELETE:/tag/{tag_id}
     * @secure
     * @description delete tag
     */
    deleteTag: (tag_id: string, params?: RequestParams) =>
      this.request<any, any>(`/tag/${tag_id}`, "DELETE", params, null, BodyType.Json, true),
  };
  schedules = {
    /**
     * @tags schedule
     * @name querySchedules
     * @summary query schedules
     * @request GET:/schedules
     * @secure
     * @description query schedules
     */
    querySchedules: (
      query: {
        teacher_name?: string | null;
        time_zone_offset: number | null;
        start_at?: number | null;
        order_by?: "create_at" | "-create_at" | "start_at" | "-start_at";
        page?: number | null;
        page_size?: number | null;
      },
      params?: RequestParams
    ) =>
      this.request<{ total?: number; data?: Schedule[] }, any>(
        `/schedules${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true
      ),

    /**
     * @tags schedule
     * @name createSchedule
     * @summary create schedule
     * @request POST:/schedules
     * @secure
     * @description Create schedule
     */
    createSchedule: (data: ScheduleCreate, params?: RequestParams) =>
      this.request<LockContentResponse, any>(`/schedules`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags schedule
     * @name GetSchedulesByID
     * @summary get schedules by id
     * @request GET:/schedules/{schedule_id}
     * @secure
     * @description get schedules by id
     */
    getSchedulesById: (schedule_id: string, params?: RequestParams) =>
      this.request<ScheduleDetailed, any>(`/schedules/${schedule_id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags schedule
     * @name updateSchedule
     * @summary update schedule
     * @request PUT:/schedules/{schedule_id}
     * @secure
     * @description update schedule
     */
    updateSchedule: (schedule_id: string, data: ScheduleUpdate, params?: RequestParams) =>
      this.request<LockContentResponse, any>(`/schedules/${schedule_id}`, "PUT", params, data, BodyType.Json, true),

    /**
     * @tags schedule
     * @name deleteSchedule
     * @summary delete schedule
     * @request DELETE:/schedules/{schedule_id}
     * @secure
     * @description delete schedule
     */
    deleteSchedule: (schedule_id: string, query?: { repeat_edit_options?: "only_current" | "with_following" }, params?: RequestParams) =>
      this.request<any, any>(`/schedules/${schedule_id}${this.addQueryParams(query)}`, "DELETE", params, null, BodyType.Json, true),

    /**
     * @tags schedule
     * @name getLiveToken
     * @summary get live token
     * @request GET:/schedules/{schedule_id}/live/token
     * @secure
     * @description get live token
     */
    getLiveToken: (schedule_id: string, params?: RequestParams) =>
      this.request<LiveToken, any>(`/schedules/${schedule_id}/live/token`, "GET", params, null, BodyType.Json, true),
  };
  schedulesTimeView = {
    /**
     * @tags schedule
     * @name schedules_time_view
     * @summary query schedules time view
     * @request GET:/schedules_time_view
     * @secure
     * @description query schedules
     */
    schedulesTimeView: (
      query: {
        view_type?: "day" | "workWeek" | "week" | "month";
        time_at: string | null;
        time_zone_offset: number | null;
      },
      params?: RequestParams
    ) =>
      this.request<{ list?: ScheduleTimeView[] }, any>(
        `/schedules_time_view${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true
      ),
  };
  learningOutcomes = {
    /**
     * @tags learning_outcomes
     * @name searchLearningOutcomes
     * @request GET:/learning_outcomes
     * @description Search learning outcomes with condition
     */
    searchLearningOutcomes: (
      query?: {
        outcome_name?: string | null;
        description?: string | null;
        keywords?: string | null;
        shortcode?: string | null;
        author_name?: string | null;
        search_key?: string | null;
        assumed?: number | null;
        publish_status?: "draft" | "pending" | "published" | "rejected";
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "created_at" | "-created_at";
      },
      params?: RequestParams
    ) => this.request<{ total?: number; list?: LearningOutcomes[] }, any>(`/learning_outcomes${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags learning_outcomes
     * @name createLearningOutcomes
     * @request POST:/learning_outcomes
     * @description Create learning outcomes
     */
    createLearningOutcomes: (data: CreateLearningOutComesRequest, params?: RequestParams) =>
      this.request<CreateLearningOutcomesResponse, any>(`/learning_outcomes`, "POST", params, data),

    /**
     * @tags learning_outcomes
     * @name getLearningOutcomesById
     * @request GET:/learning_outcomes/{outcome_id}
     * @description Get learning outcomes by id
     */
    getLearningOutcomesById: (outcome_id: string, params?: RequestParams) =>
      this.request<LearningOutcomes, any>(`/learning_outcomes/${outcome_id}`, "GET", params),

    /**
     * @tags learning_outcomes
     * @name updateLearningOutcomes
     * @request PUT:/learning_outcomes/{outcome_id}
     * @description Update learning outcomes by id
     */
    updateLearningOutcomes: (outcome_id: string, data: CreateLearningOutComesRequest, params?: RequestParams) =>
      this.request<any, any>(`/learning_outcomes/${outcome_id}`, "PUT", params, data),

    /**
     * @tags learning_outcomes
     * @name deleteLearningOutcome
     * @request DELETE:/learning_outcomes/{outcome_id}
     * @description Delete learning outcomes by id
     */
    deleteLearningOutcome: (outcome_id: string, params?: RequestParams) =>
      this.request<any, any>(`/learning_outcomes/${outcome_id}`, "DELETE", params),

    /**
     * @tags learning_outcomes
     * @name publishLearningOutcomes
     * @request PUT:/learning_outcomes/{outcome_id}/publish
     * @description Publish learning outcomes
     */
    publishLearningOutcomes: (outcome_id: string, data: PublishLearningOutcomesRequest, params?: RequestParams) =>
      this.request<any, any>(`/learning_outcomes/${outcome_id}/publish`, "PUT", params, data),

    /**
     * @tags learning_outcomes
     * @name lockLearningOutcomes
     * @request PUT:/learning_outcomes/{outcome_id}/lock
     * @description Lock a learning outcomes by content_id
     */
    lockLearningOutcomes: (outcome_id: string, params?: RequestParams) =>
      this.request<LockLearningOutcomesResponse, any>(`/learning_outcomes/${outcome_id}/lock`, "PUT", params),

    /**
     * @tags learning_outcomes
     * @name approveLearningOutcomes
     * @request PUT:/learning_outcomes/{outcome_id}/approve
     * @description Approve a learning outcomes by outcome_id
     */
    approveLearningOutcomes: (outcome_id: string, params?: RequestParams) =>
      this.request<any, any>(`/learning_outcomes/${outcome_id}/approve`, "PUT", params),

    /**
     * @tags learning_outcomes
     * @name rejectLearningOutcomes
     * @request PUT:/learning_outcomes/{outcome_id}/reject
     * @description Reject a learning outcomes by outcome_id
     */
    rejectLearningOutcomes: (outcome_id: string, data: RejectReasonRequest, params?: RequestParams) =>
      this.request<any, any>(`/learning_outcomes/${outcome_id}/reject`, "PUT", params, data),
  };
  bulkPublish = {
    /**
     * @tags learning_outcomes
     * @name publishLearningOutcomesBulk
     * @request PUT:/bulk_publish/learning_outcomes
     * @description Publish learning outcomes bulk
     */
    publishLearningOutcomesBulk: (data: OutcomesIDListRequest, params?: RequestParams) =>
      this.request<any, any>(`/bulk_publish/learning_outcomes`, "PUT", params, data),
  };
  bulk = {
    /**
     * @tags learning_outcomes
     * @name deleteOutcomeBulk
     * @request DELETE:/bulk/learning_outcomes
     * @description Delete learning outcome bulk
     */
    deleteOutcomeBulk: (data: OutcomesIDListRequest, params?: RequestParams) =>
      this.request<any, any>(`/bulk/learning_outcomes`, "DELETE", params, data),
  };
  privateLearningOutcomes = {
    /**
     * @tags learning_outcomes
     * @name searchPrivateLearningOutcomes
     * @request GET:/private_learning_outcomes
     * @description Search user's private learning outcomes with condition
     */
    searchPrivateLearningOutcomes: (
      query?: {
        outcome_name?: string | null;
        description?: string | null;
        keywords?: string | null;
        shortcode?: string | null;
        author_name?: string | null;
        search_key?: string | null;
        assumed?: number | null;
        publish_status?: "draft" | "pending" | "published" | "rejected";
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "created_at" | "-created_at";
      },
      params?: RequestParams
    ) =>
      this.request<{ total?: number; list?: LearningOutcomes[] }, any>(
        `/private_learning_outcomes${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  pendingLearningOutcomes = {
    /**
     * @tags learning_outcomes
     * @name searchPendingLearningOutcomes
     * @request GET:/pending_learning_outcomes
     * @description Search pending learning outcomes
     */
    searchPendingLearningOutcomes: (
      query?: {
        outcome_name?: string | null;
        description?: string | null;
        keywords?: string | null;
        shortcode?: string | null;
        author_name?: string | null;
        search_key?: string | null;
        assumed?: number | null;
        publish_status?: "draft" | "pending" | "published" | "rejected";
        page?: number | null;
        page_size?: number | null;
        order_by?: "name" | "-name" | "created_at" | "-created_at";
      },
      params?: RequestParams
    ) =>
      this.request<{ total?: number; list?: LearningOutcomes[] }, any>(
        `/pending_learning_outcomes${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  assessments = {
    /**
     * @tags assessments
     * @name listAssessment
     * @summary list assessment
     * @request GET:/assessments
     * @secure
     * @description list assessment
     */
    listAssessment: (
      query?: {
        status?: "all" | "in_progress" | "complete";
        teacher_name?: string;
        page?: number;
        page_size?: number;
        order_by?: "class_end_time" | "-class_end_time" | "complete_time" | "-complete_time";
      },
      params?: RequestParams
    ) =>
      this.request<
        {
          total?: number;
          items?: {
            id?: string;
            title?: string;
            subject?: { id?: string; name?: string };
            program?: { id?: string; name?: string };
            teachers?: { id?: string; name?: string }[];
            class_end_time?: number;
            complete_time?: number;
            status?: "in_progress" | "complete";
          }[];
        },
        any
      >(`/assessments${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags assessments
     * @name addAssessment
     * @summary assessment callback
     * @request POST:/assessments
     * @secure
     * @description assessment callback
     */
    addAssessment: (
      data: { schedule_id?: string; attendance_ids?: string[]; class_length?: number; class_end_time?: number },
      params?: RequestParams
    ) => this.request<LockContentResponse, any>(`/assessments`, "POST", params, data, BodyType.Json, true),

    /**
     * @tags assessments
     * @name getAssessment
     * @summary get assessment detail
     * @request GET:/assessments/{id}
     * @secure
     * @description get assessment detail
     */
    getAssessment: (id: string, params?: RequestParams) =>
      this.request<
        {
          id?: string;
          title?: string;
          class_id?: string;
          attendances?: { id?: string; name?: string }[];
          subject?: { id?: string; name?: string };
          teachers?: { id?: string; name?: string }[];
          class_end_time?: number;
          class_length?: number;
          number_of_activities?: number;
          number_of_outcomes?: number;
          complete_time?: number;
          status?: "in_progress" | "complete";
          outcome_attendance_maps?: {
            outcome_id?: string;
            outcome_name?: string;
            assumed?: boolean;
            skip?: boolean;
            attendance_ids?: string[];
          }[];
        },
        any
      >(`/assessments/${id}`, "GET", params, null, BodyType.Json, true),

    /**
     * @tags assessments
     * @name updateAssessment
     * @summary update assessment
     * @request PUT:/assessments/{id}
     * @secure
     * @description update assessment
     */
    updateAssessment: (
      id: string,
      data: {
        action?: "save" | "complete";
        attendance_ids?: string[];
        outcome_attendance_maps?: { outcome_id?: string; skip?: boolean; attendance_ids?: string[] }[];
      },
      params?: RequestParams
    ) => this.request<any, any>(`/assessments/${id}`, "PUT", params, data, BodyType.Json, true),
  };
}