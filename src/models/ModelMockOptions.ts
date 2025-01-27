import { LinkedMockOptions, LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import { EntityContentInfoWithDetails, EntityContentPermission, EntityTeacherManualFile } from "../api/api.auto";
import { ContentFileType, ContentInputSourceType } from "../api/type";
import { Regulation } from "../pages/ContentEdit/type";

export interface FlattenedMockOptionsOnlyOption extends Omit<LinkedMockOptions, "program_id" | "developmental_id"> {}

export type GetOnlyOneOptionValueResult = {
  [Key in keyof FlattenedMockOptionsOnlyOption]?: string[];
};

interface CreateDefaultValueProps {
  regulation: Regulation;
  contentDetail: EntityContentInfoWithDetails;
  linkedMockOptions: LinkedMockOptions;
}

type PartialDefaultValueAndKeyResult = {
  [key in keyof EntityContentInfoWithDetails]: {
    key: string;
    value: EntityContentInfoWithDetails[key];
  };
};

export interface CreateAllDefaultValueAndKeyResult extends PartialDefaultValueAndKeyResult {
  "data.input_source"?: {
    key: string;
    value: ContentInputSourceType;
  };
  "data.source"?: {
    key: string;
    value: string;
  };
  "data.file_type"?: {
    key: string;
    value: ContentFileType;
  };
  "data.content"?: {
    key: string;
    value: string;
  };
}

export class ModelMockOptions {
  // static updateValuesWhenProgramChange(
  //   setValue: UseFormMethods["setValue"],
  //   mockOptions: LinkedMockOptions,
  //   programId: MockOptionsItem["id"]
  // ): boolean {
  //   const { developmental_id: defaultDevelopmentalId, program, subject, developmental, skills, grade, age } = mockOptions;
  //   if (!defaultDevelopmentalId || !programId) return false;
  //   setValue("developmental", [defaultDevelopmentalId]);
  //   ["subject", "skills", "age", "grade"].forEach((name) => setValue(name, []));
  //   const onlyOneOptionValue = ModelMockOptions.getOnlyOneOptionValue({ program, subject, developmental, skills, grade, age });
  //   Object.keys(onlyOneOptionValue).forEach((item) => {
  //     const value = onlyOneOptionValue[item as keyof FlattenedMockOptionsOnlyOption];
  //     if (value) setValue(item, value);
  //   });
  //   return true;
  // }

  static getOnlyOneOptionValue(MockOptionsOnly: FlattenedMockOptionsOnlyOption): GetOnlyOneOptionValueResult {
    return Object.keys(MockOptionsOnly).reduce((result, key) => {
      const name = key as keyof GetOnlyOneOptionValueResult;
      if (MockOptionsOnly[name]?.length !== 1) return result;
      result[name] = MockOptionsOnly[name]?.map((item) => item.id as string);
      return result;
    }, {} as GetOnlyOneOptionValueResult);
  }

  static createMandatoryDefaultValue(props: CreateDefaultValueProps, name: "program" | "developmental"): string {
    const { regulation, contentDetail } = props;
    if (regulation === Regulation.ByContentDetail)
      return Array.isArray(contentDetail[name]) ? (contentDetail[name] || [])[0] : (contentDetail[name] as string);
    return "";
  }

  static createDefaultValue(
    props: CreateDefaultValueProps,
    name: Exclude<keyof LinkedMockOptions & keyof EntityContentInfoWithDetails, "program">
  ): string[] {
    const { regulation, contentDetail } = props;
    if (regulation === Regulation.ByContentDetail) return contentDetail[name] || [];
    // const options = linkedMockOptions[name] || [];
    // if (name === "subject" && options.length > 0) return [options[0].id as string];
    // if (options.length === 1) return [options[0].id as string];
    return [];
  }

  static createSelectKey(
    options: LinkedMockOptionsItem[] | undefined = [],
    ...args: (string[] | string | number | boolean | undefined | EntityTeacherManualFile[] | EntityContentPermission)[]
  ): string {
    return args
      .map((x) => (Array.isArray(x) ? x.join(",") : x))
      .concat(options.map((x) => x.id) as string[])
      .filter((x) => x)
      .join(",");
  }

  static createAllDefaultValueAndKey(
    props: CreateDefaultValueProps,
    { program, developmental, subject }: EntityContentInfoWithDetails
  ): CreateAllDefaultValueAndKeyResult {
    const { contentDetail, linkedMockOptions } = props;
    const result: CreateAllDefaultValueAndKeyResult = {};
    Object.keys(contentDetail).forEach((x) => {
      const name = x as keyof EntityContentInfoWithDetails;
      switch (name) {
        case "program":
          result[name] = {
            key: ModelMockOptions.createSelectKey(linkedMockOptions.program, contentDetail[name], name),
            value: ModelMockOptions.createMandatoryDefaultValue(props, name),
          };
          break;
        case "developmental":
          result[name] = {
            key: ModelMockOptions.createSelectKey(linkedMockOptions.developmental, program, subject, contentDetail[name], name),
            value: [ModelMockOptions.createMandatoryDefaultValue(props, name) || ""],
          };
          break;
        case "skills":
          result[name] = {
            key: ModelMockOptions.createSelectKey(linkedMockOptions[name], program, developmental, contentDetail[name], name),
            value: ModelMockOptions.createDefaultValue(props, name),
          };
          break;
        case "subject":
        case "grade":
        case "age":
          result[name] = {
            key: ModelMockOptions.createSelectKey(linkedMockOptions[name], program, contentDetail[name], name),
            value: ModelMockOptions.createDefaultValue(props, name),
          };
          break;
        case "teacher_manual_batch":
          result[name] = {
            key: ModelMockOptions.createSelectKey([], JSON.stringify(contentDetail.teacher_manual_batch), name),
            value: contentDetail[name] as any,
          };
          break;
        case "permission":
          result[name] = {
            key: ModelMockOptions.createSelectKey([], JSON.stringify(contentDetail.permission), name),
            value: contentDetail[name] as any,
          };
          break;

        case "outcome_entities":
          break;
        default:
          result[name] = {
            key: ModelMockOptions.createSelectKey([], contentDetail[name], name),
            value: contentDetail[name] as any,
          };
      }
    });
    const { input_source, file_type } = JSON.parse(contentDetail.data || "{}");
    const source = JSON.parse(contentDetail.data || "{}").source ?? "";
    const content = JSON.parse(contentDetail.data || "{}").content ?? "";
    result["data.input_source"] = {
      key: ModelMockOptions.createSelectKey([], input_source, "data.input_source"),
      value: input_source ?? ContentInputSourceType.h5p,
    };
    result["data.source"] = {
      key: ModelMockOptions.createSelectKey([], contentDetail.data, "data.source"),
      value: source,
    };
    result["data.file_type"] = {
      key: ModelMockOptions.createSelectKey([], contentDetail.data, "data.file_type"),
      value: file_type ?? "",
    };
    result["data.content"] = {
      key: ModelMockOptions.createSelectKey([], contentDetail.data, "data.content"),
      value: content,
    };
    return result;
  }
}
