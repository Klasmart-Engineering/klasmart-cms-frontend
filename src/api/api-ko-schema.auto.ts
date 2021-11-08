export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  HexColor: any;
  /** The number of results to return per page */
  PageSize: any;
  /** The `UUID` scalar type represents UUID values as specified by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
  Upload: any;
  Url: any;
};

export type AgeRange = {
  __typename?: "AgeRange";
  delete?: Maybe<Scalars["Boolean"]>;
  high_value: Scalars["Int"];
  high_value_unit: AgeRangeUnit;
  id: Scalars["ID"];
  low_value: Scalars["Int"];
  low_value_unit: AgeRangeUnit;
  name: Scalars["String"];
  status?: Maybe<Status>;
  system: Scalars["Boolean"];
};

export type AgeRangeDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type AgeRangeConnectionNode = {
  __typename?: "AgeRangeConnectionNode";
  highValue: Scalars["Int"];
  highValueUnit: AgeRangeUnit;
  id: Scalars["ID"];
  lowValue: Scalars["Int"];
  lowValueUnit: AgeRangeUnit;
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type AgeRangeDetail = {
  high_value?: Maybe<Scalars["Int"]>;
  high_value_unit?: Maybe<AgeRangeUnit>;
  id?: Maybe<Scalars["ID"]>;
  low_value?: Maybe<Scalars["Int"]>;
  low_value_unit?: Maybe<AgeRangeUnit>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type AgeRangeFilter = {
  AND?: Maybe<Array<AgeRangeFilter>>;
  OR?: Maybe<Array<AgeRangeFilter>>;
  ageRangeUnitFrom?: Maybe<AgeRangeUnitFilter>;
  ageRangeUnitTo?: Maybe<AgeRangeUnitFilter>;
  ageRangeValueFrom?: Maybe<AgeRangeValueFilter>;
  ageRangeValueTo?: Maybe<AgeRangeValueFilter>;
  organizationId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum AgeRangeSortBy {
  Id = "id",
  LowValue = "lowValue",
  LowValueUnit = "lowValueUnit",
}

export type AgeRangeSortInput = {
  field: Array<AgeRangeSortBy>;
  order: SortOrder;
};

export type AgeRangeTypeFilter = {
  operator: NumberOrDateOperator;
  value: AgeRangeValue;
};

export enum AgeRangeUnit {
  Month = "month",
  Year = "year",
}

export type AgeRangeUnitFilter = {
  operator: UuidOperator;
  value: AgeRangeUnit;
};

export type AgeRangeValue = {
  unit: AgeRangeUnit;
  value: Scalars["Int"];
};

export type AgeRangeValueFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["Int"];
};

export type AgeRangesConnectionEdge = IConnectionEdge & {
  __typename?: "AgeRangesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<AgeRangeConnectionNode>;
};

export type AgeRangesConnectionResponse = IConnectionResponse & {
  __typename?: "AgeRangesConnectionResponse";
  edges?: Maybe<Array<Maybe<AgeRangesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type BooleanFilter = {
  operator: BooleanOperator;
  value: Scalars["Boolean"];
};

export enum BooleanOperator {
  Eq = "eq",
}

export type Branding = {
  __typename?: "Branding";
  iconImageURL?: Maybe<Scalars["Url"]>;
  primaryColor?: Maybe<Scalars["HexColor"]>;
};

export enum BrandingImageTag {
  Icon = "ICON",
}

export type CategoriesConnectionEdge = IConnectionEdge & {
  __typename?: "CategoriesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<CategoryConnectionNode>;
};

export type CategoriesConnectionResponse = IConnectionResponse & {
  __typename?: "CategoriesConnectionResponse";
  edges?: Maybe<Array<Maybe<CategoriesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type Category = {
  __typename?: "Category";
  delete?: Maybe<Scalars["Boolean"]>;
  editSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  subcategories?: Maybe<Array<Subcategory>>;
  system: Scalars["Boolean"];
};

export type CategoryDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type CategoryEditSubcategoriesArgs = {
  subcategory_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type CategoryConnectionNode = {
  __typename?: "CategoryConnectionNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type CategoryDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  subcategories?: Maybe<Array<Scalars["ID"]>>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type CategoryFilter = {
  AND?: Maybe<Array<Maybe<CategoryFilter>>>;
  OR?: Maybe<Array<Maybe<CategoryFilter>>>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum CategorySortBy {
  Id = "id",
  Name = "name",
}

export type CategorySortInput = {
  field: CategorySortBy;
  order: SortOrder;
};

export type CategorySummaryNode = {
  __typename?: "CategorySummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type Class = {
  __typename?: "Class";
  addSchool?: Maybe<School>;
  addStudent?: Maybe<User>;
  addTeacher?: Maybe<User>;
  age_ranges?: Maybe<Array<AgeRange>>;
  class_id: Scalars["ID"];
  class_name?: Maybe<Scalars["String"]>;
  delete?: Maybe<Scalars["Boolean"]>;
  editAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  editGrades?: Maybe<Array<Maybe<Grade>>>;
  editPrograms?: Maybe<Array<Maybe<Program>>>;
  editSchools?: Maybe<Array<Maybe<School>>>;
  editStudents?: Maybe<Array<Maybe<User>>>;
  editSubjects?: Maybe<Array<Maybe<Subject>>>;
  editTeachers?: Maybe<Array<Maybe<User>>>;
  eligibleStudents?: Maybe<Array<Maybe<User>>>;
  eligibleTeachers?: Maybe<Array<Maybe<User>>>;
  grades?: Maybe<Array<Grade>>;
  organization?: Maybe<Organization>;
  programs?: Maybe<Array<Program>>;
  removeSchool?: Maybe<Scalars["Boolean"]>;
  removeStudent?: Maybe<Scalars["Boolean"]>;
  removeTeacher?: Maybe<Scalars["Boolean"]>;
  schools?: Maybe<Array<Maybe<School>>>;
  set?: Maybe<Class>;
  shortcode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  students?: Maybe<Array<Maybe<User>>>;
  subjects?: Maybe<Array<Subject>>;
  teachers?: Maybe<Array<Maybe<User>>>;
};

export type ClassAddSchoolArgs = {
  school_id: Scalars["ID"];
};

export type ClassAddStudentArgs = {
  user_id: Scalars["ID"];
};

export type ClassAddTeacherArgs = {
  user_id: Scalars["ID"];
};

export type ClassDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type ClassEditAgeRangesArgs = {
  age_range_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditGradesArgs = {
  grade_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditProgramsArgs = {
  program_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditSchoolsArgs = {
  school_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditStudentsArgs = {
  student_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditSubjectsArgs = {
  subject_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassEditTeachersArgs = {
  teacher_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ClassRemoveSchoolArgs = {
  school_id: Scalars["ID"];
};

export type ClassRemoveStudentArgs = {
  user_id: Scalars["ID"];
};

export type ClassRemoveTeacherArgs = {
  user_id: Scalars["ID"];
};

export type ClassSetArgs = {
  class_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type ClassConnectionNode = {
  __typename?: "ClassConnectionNode";
  ageRanges?: Maybe<Array<AgeRangeConnectionNode>>;
  grades?: Maybe<Array<GradeSummaryNode>>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  programs?: Maybe<Array<ProgramSummaryNode>>;
  schools?: Maybe<Array<SchoolSummaryNode>>;
  shortCode?: Maybe<Scalars["String"]>;
  status: Status;
  subjects?: Maybe<Array<SubjectSummaryNode>>;
};

export type ClassFilter = {
  AND?: Maybe<Array<ClassFilter>>;
  OR?: Maybe<Array<ClassFilter>>;
  ageRangeUnitFrom?: Maybe<AgeRangeUnitFilter>;
  ageRangeUnitTo?: Maybe<AgeRangeUnitFilter>;
  ageRangeValueFrom?: Maybe<AgeRangeValueFilter>;
  ageRangeValueTo?: Maybe<AgeRangeValueFilter>;
  gradeId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  programId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidExclusiveFilter>;
  status?: Maybe<StringFilter>;
  subjectId?: Maybe<UuidFilter>;
};

export enum ClassSortBy {
  Id = "id",
  Name = "name",
}

export type ClassSortInput = {
  field: ClassSortBy;
  order: SortOrder;
};

export type ClassesConnectionEdge = IConnectionEdge & {
  __typename?: "ClassesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<ClassConnectionNode>;
};

export type ClassesConnectionResponse = IConnectionResponse & {
  __typename?: "ClassesConnectionResponse";
  edges?: Maybe<Array<Maybe<ClassesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export enum ConnectionDirection {
  Backward = "BACKWARD",
  Forward = "FORWARD",
}

export type ConnectionPageInfo = {
  __typename?: "ConnectionPageInfo";
  endCursor?: Maybe<Scalars["String"]>;
  hasNextPage?: Maybe<Scalars["Boolean"]>;
  hasPreviousPage?: Maybe<Scalars["Boolean"]>;
  startCursor?: Maybe<Scalars["String"]>;
};

export type ConnectionsDirectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
};

export type ContactInfo = {
  __typename?: "ContactInfo";
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
};

export type DateFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["String"];
};

export type File = {
  __typename?: "File";
  encoding: Scalars["String"];
  filename: Scalars["String"];
  mimetype: Scalars["String"];
};

export type Grade = {
  __typename?: "Grade";
  delete?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  progress_from_grade?: Maybe<Grade>;
  progress_to_grade?: Maybe<Grade>;
  status?: Maybe<Status>;
  system: Scalars["Boolean"];
};

export type GradeDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type GradeConnectionNode = {
  __typename?: "GradeConnectionNode";
  fromGrade: GradeSummaryNode;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
  toGrade: GradeSummaryNode;
};

export type GradeDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  progress_from_grade_id?: Maybe<Scalars["ID"]>;
  progress_to_grade_id?: Maybe<Scalars["ID"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type GradeFilter = {
  AND?: Maybe<Array<GradeFilter>>;
  OR?: Maybe<Array<GradeFilter>>;
  fromGradeId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
  toGradeId?: Maybe<UuidFilter>;
};

export enum GradeSortBy {
  Id = "id",
  Name = "name",
}

export type GradeSortInput = {
  field: Array<GradeSortBy>;
  order: SortOrder;
};

export type GradeSummaryNode = {
  __typename?: "GradeSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type GradesConnectionEdge = IConnectionEdge & {
  __typename?: "GradesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<GradeConnectionNode>;
};

export type GradesConnectionResponse = IConnectionResponse & {
  __typename?: "GradesConnectionResponse";
  edges?: Maybe<Array<Maybe<GradesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type MembershipUpdate = {
  __typename?: "MembershipUpdate";
  membership?: Maybe<OrganizationMembership>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  age_range?: Maybe<AgeRange>;
  category?: Maybe<Category>;
  class?: Maybe<Class>;
  classes?: Maybe<Array<Maybe<Class>>>;
  deleteBrandingColor?: Maybe<Scalars["Boolean"]>;
  deleteBrandingImage?: Maybe<Scalars["Boolean"]>;
  grade?: Maybe<Grade>;
  me?: Maybe<User>;
  /** @deprecated Use the inviteUser() method */
  newUser?: Maybe<User>;
  organization?: Maybe<Organization>;
  program?: Maybe<Program>;
  renameDuplicateGrades?: Maybe<Scalars["Boolean"]>;
  renameDuplicateOrganizations?: Maybe<Scalars["Boolean"]>;
  renameDuplicateSubjects?: Maybe<Scalars["Boolean"]>;
  replaceRole?: Maybe<Role>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  school?: Maybe<School>;
  setBranding?: Maybe<Branding>;
  subcategory?: Maybe<Subcategory>;
  subject?: Maybe<Subject>;
  /** @deprecated Moved to auth service */
  switch_user?: Maybe<User>;
  uploadAgeRangesFromCSV?: Maybe<File>;
  uploadCategoriesFromCSV?: Maybe<File>;
  uploadClassesFromCSV?: Maybe<File>;
  uploadGradesFromCSV?: Maybe<File>;
  uploadOrganizationsFromCSV?: Maybe<File>;
  uploadProgramsFromCSV?: Maybe<File>;
  uploadRolesFromCSV?: Maybe<File>;
  uploadSchoolsFromCSV?: Maybe<File>;
  uploadSubCategoriesFromCSV?: Maybe<File>;
  uploadSubjectsFromCSV?: Maybe<File>;
  uploadUsersFromCSV?: Maybe<File>;
  user?: Maybe<User>;
};

export type MutationAge_RangeArgs = {
  id: Scalars["ID"];
};

export type MutationCategoryArgs = {
  id: Scalars["ID"];
};

export type MutationClassArgs = {
  class_id: Scalars["ID"];
};

export type MutationDeleteBrandingColorArgs = {
  organizationId: Scalars["ID"];
};

export type MutationDeleteBrandingImageArgs = {
  organizationId: Scalars["ID"];
  type: BrandingImageTag;
};

export type MutationGradeArgs = {
  id: Scalars["ID"];
};

export type MutationNewUserArgs = {
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type MutationOrganizationArgs = {
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type MutationProgramArgs = {
  id: Scalars["ID"];
};

export type MutationReplaceRoleArgs = {
  new_role_id: Scalars["ID"];
  old_role_id: Scalars["ID"];
  organization_id: Scalars["ID"];
};

export type MutationRoleArgs = {
  role_id: Scalars["ID"];
};

export type MutationSchoolArgs = {
  school_id: Scalars["ID"];
};

export type MutationSetBrandingArgs = {
  iconImage?: Maybe<Scalars["Upload"]>;
  organizationId: Scalars["ID"];
  primaryColor?: Maybe<Scalars["HexColor"]>;
};

export type MutationSubcategoryArgs = {
  id: Scalars["ID"];
};

export type MutationSubjectArgs = {
  id: Scalars["ID"];
};

export type MutationSwitch_UserArgs = {
  user_id: Scalars["ID"];
};

export type MutationUploadAgeRangesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadCategoriesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadClassesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadGradesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadOrganizationsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadProgramsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadRolesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadSchoolsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadSubCategoriesFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadSubjectsFromCsvArgs = {
  file: Scalars["Upload"];
};

export type MutationUploadUsersFromCsvArgs = {
  file: Scalars["Upload"];
  isDryRun?: Maybe<Scalars["Boolean"]>;
};

export type MutationUserArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  user_id: Scalars["ID"];
  username?: Maybe<Scalars["String"]>;
};

export type MyType = {
  __typename?: "MyType";
  myField?: Maybe<Scalars["UUID"]>;
};

export type NumberFilter = {
  operator: NumberOrDateOperator;
  value: Scalars["Float"];
};

export enum NumberOrDateOperator {
  Eq = "eq",
  Gt = "gt",
  Gte = "gte",
  Lt = "lt",
  Lte = "lte",
  Neq = "neq",
}

export type Organization = {
  __typename?: "Organization";
  addUser?: Maybe<OrganizationMembership>;
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  ageRanges?: Maybe<Array<AgeRange>>;
  branding?: Maybe<Branding>;
  categories?: Maybe<Array<Category>>;
  /** @deprecated Use 'getClasses'. */
  classes?: Maybe<Array<Maybe<Class>>>;
  createClass?: Maybe<Class>;
  createOrUpdateAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  createOrUpdateCategories?: Maybe<Array<Maybe<Category>>>;
  createOrUpdateGrades?: Maybe<Array<Maybe<Grade>>>;
  createOrUpdatePrograms?: Maybe<Array<Maybe<Program>>>;
  createOrUpdateSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  createOrUpdateSubjects?: Maybe<Array<Maybe<Subject>>>;
  createRole?: Maybe<Role>;
  createSchool?: Maybe<School>;
  delete?: Maybe<Scalars["Boolean"]>;
  editMembership?: Maybe<MembershipUpdate>;
  findMembers?: Maybe<Array<Maybe<OrganizationMembership>>>;
  getClasses?: Maybe<Array<Maybe<Class>>>;
  grades?: Maybe<Array<Grade>>;
  inviteUser?: Maybe<MembershipUpdate>;
  membersWithPermission?: Maybe<Array<Maybe<OrganizationMembership>>>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  organization_id: Scalars["ID"];
  organization_name?: Maybe<Scalars["String"]>;
  /**
   * 'owner' is the User that created this Organization
   * @deprecated Use 'organization_ownerships'.
   */
  owner?: Maybe<User>;
  phone?: Maybe<Scalars["String"]>;
  primary_contact?: Maybe<User>;
  programs?: Maybe<Array<Program>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  schools?: Maybe<Array<Maybe<School>>>;
  set?: Maybe<Organization>;
  setPrimaryContact?: Maybe<User>;
  shortCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  students?: Maybe<Array<Maybe<OrganizationMembership>>>;
  subcategories?: Maybe<Array<Subcategory>>;
  subjects?: Maybe<Array<Subject>>;
  teachers?: Maybe<Array<Maybe<OrganizationMembership>>>;
};

export type OrganizationAddUserArgs = {
  shortcode?: Maybe<Scalars["String"]>;
  user_id: Scalars["ID"];
};

export type OrganizationCreateClassArgs = {
  class_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type OrganizationCreateOrUpdateAgeRangesArgs = {
  age_ranges: Array<Maybe<AgeRangeDetail>>;
};

export type OrganizationCreateOrUpdateCategoriesArgs = {
  categories: Array<Maybe<CategoryDetail>>;
};

export type OrganizationCreateOrUpdateGradesArgs = {
  grades: Array<Maybe<GradeDetail>>;
};

export type OrganizationCreateOrUpdateProgramsArgs = {
  programs: Array<Maybe<ProgramDetail>>;
};

export type OrganizationCreateOrUpdateSubcategoriesArgs = {
  subcategories: Array<Maybe<SubcategoryDetail>>;
};

export type OrganizationCreateOrUpdateSubjectsArgs = {
  subjects: Array<Maybe<SubjectDetail>>;
};

export type OrganizationCreateRoleArgs = {
  role_description: Scalars["String"];
  role_name: Scalars["String"];
};

export type OrganizationCreateSchoolArgs = {
  school_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type OrganizationDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationEditMembershipArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name: Scalars["String"];
  gender: Scalars["String"];
  given_name: Scalars["String"];
  organization_role_ids: Array<Scalars["ID"]>;
  phone?: Maybe<Scalars["String"]>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
  shortcode: Scalars["String"];
  user_id: Scalars["ID"];
  username?: Maybe<Scalars["String"]>;
};

export type OrganizationFindMembersArgs = {
  search_query: Scalars["String"];
};

export type OrganizationInviteUserArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name: Scalars["String"];
  gender: Scalars["String"];
  given_name: Scalars["String"];
  organization_role_ids: Array<Scalars["ID"]>;
  phone?: Maybe<Scalars["String"]>;
  school_ids?: Maybe<Array<Scalars["ID"]>>;
  school_role_ids?: Maybe<Array<Scalars["ID"]>>;
  shortcode?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type OrganizationMembersWithPermissionArgs = {
  permission_name: Scalars["String"];
  search_query?: Maybe<Scalars["String"]>;
};

export type OrganizationSetArgs = {
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  organization_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type OrganizationSetPrimaryContactArgs = {
  user_id: Scalars["ID"];
};

export type OrganizationConnectionNode = {
  __typename?: "OrganizationConnectionNode";
  branding?: Maybe<Branding>;
  contactInfo?: Maybe<OrganizationContactInfo>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  owners?: Maybe<Array<Maybe<UserSummaryNode>>>;
  schoolsConnection?: Maybe<SchoolsConnectionResponse>;
  shortCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  usersConnection?: Maybe<UsersConnectionResponse>;
};

export type OrganizationConnectionNodeSchoolsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<SchoolFilter>;
  sort?: Maybe<SchoolSortInput>;
};

export type OrganizationConnectionNodeUsersConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<UserFilter>;
  sort?: Maybe<UserSortInput>;
};

export type OrganizationContactInfo = {
  __typename?: "OrganizationContactInfo";
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
};

export type OrganizationFilter = {
  AND?: Maybe<Array<OrganizationFilter>>;
  OR?: Maybe<Array<OrganizationFilter>>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  ownerUserId?: Maybe<UuidFilter>;
  phone?: Maybe<StringFilter>;
  shortCode?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
  userId?: Maybe<UuidFilter>;
};

export type OrganizationMembership = {
  __typename?: "OrganizationMembership";
  addRole?: Maybe<Role>;
  addRoles?: Maybe<Array<Maybe<Role>>>;
  checkAllowed?: Maybe<Scalars["Boolean"]>;
  /** @deprecated Use User.classesStudying and User.classesTeaching */
  classes?: Maybe<Array<Maybe<Class>>>;
  classesTeaching?: Maybe<Array<Maybe<Class>>>;
  join_timestamp?: Maybe<Scalars["Date"]>;
  leave?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<Organization>;
  organization_id: Scalars["ID"];
  removeRole?: Maybe<OrganizationMembership>;
  roles?: Maybe<Array<Maybe<Role>>>;
  schoolMemberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  shortcode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  user?: Maybe<User>;
  user_id: Scalars["ID"];
};

export type OrganizationMembershipAddRoleArgs = {
  role_id: Scalars["ID"];
};

export type OrganizationMembershipAddRolesArgs = {
  role_ids: Array<Scalars["ID"]>;
};

export type OrganizationMembershipCheckAllowedArgs = {
  permission_name: Scalars["ID"];
};

export type OrganizationMembershipLeaveArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type OrganizationMembershipRemoveRoleArgs = {
  role_id: Scalars["ID"];
};

export type OrganizationMembershipSchoolMembershipsArgs = {
  permission_name?: Maybe<Scalars["String"]>;
};

export type OrganizationOwnership = {
  __typename?: "OrganizationOwnership";
  organization?: Maybe<Organization>;
  organization_id: Scalars["ID"];
  status?: Maybe<Status>;
  user?: Maybe<User>;
  user_id: Scalars["ID"];
};

export enum OrganizationSortBy {
  Name = "name",
}

export type OrganizationSortInput = {
  field: Array<OrganizationSortBy>;
  order: SortOrder;
};

export type OrganizationSummaryNode = {
  __typename?: "OrganizationSummaryNode";
  id: Scalars["ID"];
  joinDate?: Maybe<Scalars["Date"]>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  userShortCode?: Maybe<Scalars["String"]>;
  userStatus?: Maybe<Status>;
};

export type OrganizationsConnectionEdge = IConnectionEdge & {
  __typename?: "OrganizationsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<OrganizationConnectionNode>;
};

export type OrganizationsConnectionResponse = IConnectionResponse & {
  __typename?: "OrganizationsConnectionResponse";
  edges?: Maybe<Array<Maybe<OrganizationsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor: Scalars["String"];
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor: Scalars["String"];
};

export type Permission = {
  __typename?: "Permission";
  allow?: Maybe<Scalars["Boolean"]>;
  permission_category?: Maybe<Scalars["String"]>;
  permission_description?: Maybe<Scalars["String"]>;
  permission_group?: Maybe<Scalars["String"]>;
  permission_id?: Maybe<Scalars["ID"]>;
  permission_level?: Maybe<Scalars["String"]>;
  permission_name: Scalars["ID"];
};

export type PermissionFilter = {
  AND?: Maybe<Array<PermissionFilter>>;
  OR?: Maybe<Array<PermissionFilter>>;
  allow?: Maybe<BooleanFilter>;
  name?: Maybe<StringFilter>;
  roleId?: Maybe<UuidFilter>;
};

export enum PermissionSortBy {
  Category = "category",
  Group = "group",
  Id = "id",
  Level = "level",
  Name = "name",
}

export type PermissionSortInput = {
  field: PermissionSortBy;
  order: SortOrder;
};

export type PermissionsConnectionEdge = IConnectionEdge & {
  __typename?: "PermissionsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<PermissionsConnectionNode>;
};

export type PermissionsConnectionNode = {
  __typename?: "PermissionsConnectionNode";
  allow: Scalars["Boolean"];
  category?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  group?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  level?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
};

export type PermissionsConnectionResponse = IConnectionResponse & {
  __typename?: "PermissionsConnectionResponse";
  edges?: Maybe<Array<Maybe<PermissionsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type Program = {
  __typename?: "Program";
  age_ranges?: Maybe<Array<AgeRange>>;
  delete?: Maybe<Scalars["Boolean"]>;
  editAgeRanges?: Maybe<Array<Maybe<AgeRange>>>;
  editGrades?: Maybe<Array<Maybe<Grade>>>;
  editSubjects?: Maybe<Array<Maybe<Subject>>>;
  grades?: Maybe<Array<Grade>>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  subjects?: Maybe<Array<Subject>>;
  system: Scalars["Boolean"];
};

export type ProgramDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type ProgramEditAgeRangesArgs = {
  age_range_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ProgramEditGradesArgs = {
  grade_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ProgramEditSubjectsArgs = {
  subject_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type ProgramConnectionNode = {
  __typename?: "ProgramConnectionNode";
  ageRanges?: Maybe<Array<AgeRangeConnectionNode>>;
  grades?: Maybe<Array<GradeSummaryNode>>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  subjects?: Maybe<Array<SubjectSummaryNode>>;
  system: Scalars["Boolean"];
};

export type ProgramDetail = {
  age_ranges?: Maybe<Array<Scalars["ID"]>>;
  grades?: Maybe<Array<Scalars["ID"]>>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  subjects?: Maybe<Array<Scalars["ID"]>>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type ProgramFilter = {
  AND?: Maybe<Array<ProgramFilter>>;
  OR?: Maybe<Array<ProgramFilter>>;
  ageRangeFrom?: Maybe<AgeRangeTypeFilter>;
  ageRangeTo?: Maybe<AgeRangeTypeFilter>;
  classId?: Maybe<UuidFilter>;
  gradeId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  subjectId?: Maybe<UuidFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum ProgramSortBy {
  Id = "id",
  Name = "name",
}

export type ProgramSortInput = {
  field: Array<ProgramSortBy>;
  order: SortOrder;
};

export type ProgramSummaryNode = {
  __typename?: "ProgramSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type ProgramsConnectionEdge = IConnectionEdge & {
  __typename?: "ProgramsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<ProgramConnectionNode>;
};

export type ProgramsConnectionResponse = IConnectionResponse & {
  __typename?: "ProgramsConnectionResponse";
  edges?: Maybe<Array<Maybe<ProgramsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type Query = {
  __typename?: "Query";
  _empty?: Maybe<Scalars["String"]>;
  ageRangeNode?: Maybe<AgeRangeConnectionNode>;
  ageRangesConnection?: Maybe<AgeRangesConnectionResponse>;
  /** @deprecated Use 'ageRangeNode' */
  age_range?: Maybe<AgeRange>;
  categoriesConnection?: Maybe<CategoriesConnectionResponse>;
  category?: Maybe<Category>;
  /** @deprecated Use 'classNode'. */
  class?: Maybe<Class>;
  classNode?: Maybe<ClassConnectionNode>;
  /** @deprecated Use 'classesConnection'. */
  classes?: Maybe<Array<Maybe<Class>>>;
  classesConnection?: Maybe<ClassesConnectionResponse>;
  /** @deprecated Use 'gradeNode'. */
  grade?: Maybe<Grade>;
  gradeNode?: Maybe<GradeConnectionNode>;
  gradesConnection?: Maybe<GradesConnectionResponse>;
  me?: Maybe<User>;
  /** @deprecated Use 'usersConnection with a filter for matching 'email' or 'phone' */
  my_users?: Maybe<Array<User>>;
  /** @deprecated Use 'organizationNode'. */
  organization?: Maybe<Organization>;
  organizationNode?: Maybe<OrganizationConnectionNode>;
  /** @deprecated Use 'organizationsConnection'. */
  organizations?: Maybe<Array<Maybe<Organization>>>;
  organizationsConnection?: Maybe<OrganizationsConnectionResponse>;
  permissionsConnection?: Maybe<PermissionsConnectionResponse>;
  /** @deprecated Use 'programNode' */
  program?: Maybe<Program>;
  programNode?: Maybe<ProgramConnectionNode>;
  programsConnection?: Maybe<ProgramsConnectionResponse>;
  role?: Maybe<Role>;
  roles?: Maybe<Array<Maybe<Role>>>;
  rolesConnection?: Maybe<RolesConnectionResponse>;
  /** @deprecated Use 'schoolsConnection' with 'schoolId' filter. */
  school?: Maybe<School>;
  schoolsConnection?: Maybe<SchoolsConnectionResponse>;
  subcategoriesConnection?: Maybe<SubcategoriesConnectionResponse>;
  subcategory?: Maybe<Subcategory>;
  subject?: Maybe<Subject>;
  subjectsConnection?: Maybe<SubjectsConnectionResponse>;
  /** @deprecated Use 'userNode' */
  user?: Maybe<User>;
  userNode?: Maybe<UserConnectionNode>;
  /** @deprecated Unused */
  users?: Maybe<Array<Maybe<User>>>;
  usersConnection?: Maybe<UsersConnectionResponse>;
};

export type QueryAgeRangeNodeArgs = {
  id: Scalars["ID"];
};

export type QueryAgeRangesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<AgeRangeFilter>;
  sort?: Maybe<AgeRangeSortInput>;
};

export type QueryAge_RangeArgs = {
  id: Scalars["ID"];
};

export type QueryCategoriesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<CategoryFilter>;
  sort?: Maybe<CategorySortInput>;
};

export type QueryCategoryArgs = {
  id: Scalars["ID"];
};

export type QueryClassArgs = {
  class_id: Scalars["ID"];
};

export type QueryClassNodeArgs = {
  id: Scalars["ID"];
};

export type QueryClassesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<ClassFilter>;
  sort?: Maybe<ClassSortInput>;
};

export type QueryGradeArgs = {
  id: Scalars["ID"];
};

export type QueryGradeNodeArgs = {
  id: Scalars["ID"];
};

export type QueryGradesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<GradeFilter>;
  sort?: Maybe<GradeSortInput>;
};

export type QueryOrganizationArgs = {
  organization_id: Scalars["ID"];
};

export type QueryOrganizationNodeArgs = {
  id: Scalars["ID"];
};

export type QueryOrganizationsArgs = {
  organization_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type QueryOrganizationsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<OrganizationFilter>;
  sort?: Maybe<OrganizationSortInput>;
};

export type QueryPermissionsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<PermissionFilter>;
  sort?: Maybe<PermissionSortInput>;
};

export type QueryProgramArgs = {
  id: Scalars["ID"];
};

export type QueryProgramNodeArgs = {
  id: Scalars["ID"];
};

export type QueryProgramsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<ProgramFilter>;
  sort?: Maybe<ProgramSortInput>;
};

export type QueryRoleArgs = {
  role_id: Scalars["ID"];
};

export type QueryRolesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<RoleFilter>;
  sort?: Maybe<RoleSortInput>;
};

export type QuerySchoolArgs = {
  school_id: Scalars["ID"];
};

export type QuerySchoolsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<SchoolFilter>;
  sort?: Maybe<SchoolSortInput>;
};

export type QuerySubcategoriesConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<SubcategoryFilter>;
  sort?: Maybe<SubcategorySortInput>;
};

export type QuerySubcategoryArgs = {
  id: Scalars["ID"];
};

export type QuerySubjectArgs = {
  id: Scalars["ID"];
};

export type QuerySubjectsConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<SubjectFilter>;
  sort?: Maybe<SubjectSortInput>;
};

export type QueryUserArgs = {
  user_id: Scalars["ID"];
};

export type QueryUserNodeArgs = {
  id: Scalars["ID"];
};

export type QueryUsersConnectionArgs = {
  direction: ConnectionDirection;
  directionArgs?: Maybe<ConnectionsDirectionArgs>;
  filter?: Maybe<UserFilter>;
  sort?: Maybe<UserSortInput>;
};

export type Role = {
  __typename?: "Role";
  delete_role?: Maybe<Scalars["Boolean"]>;
  deny?: Maybe<Permission>;
  edit_permissions?: Maybe<Array<Maybe<Permission>>>;
  grant?: Maybe<Permission>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  organization?: Maybe<Organization>;
  permission?: Maybe<Permission>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  revoke?: Maybe<Scalars["Boolean"]>;
  role_description: Scalars["String"];
  role_id: Scalars["ID"];
  role_name?: Maybe<Scalars["String"]>;
  set?: Maybe<Role>;
  status: Status;
  system_role: Scalars["Boolean"];
};

export type RoleDelete_RoleArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type RoleDenyArgs = {
  permission_name: Scalars["String"];
};

export type RoleEdit_PermissionsArgs = {
  permission_names?: Maybe<Array<Scalars["String"]>>;
};

export type RoleGrantArgs = {
  permission_name: Scalars["String"];
};

export type RolePermissionArgs = {
  permission_name: Scalars["String"];
};

export type RoleRevokeArgs = {
  permission_name: Scalars["String"];
};

export type RoleSetArgs = {
  role_description?: Maybe<Scalars["String"]>;
  role_name?: Maybe<Scalars["String"]>;
  system_role?: Maybe<Scalars["Boolean"]>;
};

export type RoleConnectionNode = {
  __typename?: "RoleConnectionNode";
  description: Scalars["String"];
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type RoleFilter = {
  AND?: Maybe<Array<Maybe<RoleFilter>>>;
  OR?: Maybe<Array<Maybe<RoleFilter>>>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum RoleSortBy {
  Id = "id",
  Name = "name",
}

export type RoleSortInput = {
  field: RoleSortBy;
  order: SortOrder;
};

export type RoleSummaryNode = {
  __typename?: "RoleSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
  schoolId?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type RolesConnectionEdge = IConnectionEdge & {
  __typename?: "RolesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<RoleConnectionNode>;
};

export type RolesConnectionResponse = IConnectionResponse & {
  __typename?: "RolesConnectionResponse";
  edges?: Maybe<Array<Maybe<RolesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type ScheduleEntry = {
  __typename?: "ScheduleEntry";
  id: Scalars["ID"];
  timestamp?: Maybe<Scalars["Date"]>;
};

export type School = {
  __typename?: "School";
  addUser?: Maybe<SchoolMembership>;
  classes?: Maybe<Array<Maybe<Class>>>;
  delete?: Maybe<Scalars["Boolean"]>;
  editPrograms?: Maybe<Array<Maybe<Program>>>;
  membership?: Maybe<SchoolMembership>;
  memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  organization?: Maybe<Organization>;
  programs?: Maybe<Array<Program>>;
  school_id: Scalars["ID"];
  school_name?: Maybe<Scalars["String"]>;
  set?: Maybe<School>;
  shortcode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type SchoolAddUserArgs = {
  user_id: Scalars["ID"];
};

export type SchoolDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SchoolEditProgramsArgs = {
  program_ids?: Maybe<Array<Scalars["ID"]>>;
};

export type SchoolMembershipArgs = {
  user_id: Scalars["ID"];
};

export type SchoolSetArgs = {
  school_name?: Maybe<Scalars["String"]>;
  shortcode?: Maybe<Scalars["String"]>;
};

export type SchoolConnectionNode = {
  __typename?: "SchoolConnectionNode";
  id: Scalars["ID"];
  name: Scalars["String"];
  organizationId: Scalars["ID"];
  shortCode?: Maybe<Scalars["String"]>;
  status: Status;
};

export type SchoolFilter = {
  AND?: Maybe<Array<SchoolFilter>>;
  OR?: Maybe<Array<SchoolFilter>>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidFilter>;
  shortCode?: Maybe<StringFilter>;
  status?: Maybe<StringFilter>;
};

export type SchoolMembership = {
  __typename?: "SchoolMembership";
  addRole?: Maybe<Role>;
  addRoles?: Maybe<Array<Maybe<Role>>>;
  checkAllowed?: Maybe<Scalars["Boolean"]>;
  join_timestamp?: Maybe<Scalars["Date"]>;
  leave?: Maybe<Scalars["Boolean"]>;
  removeRole?: Maybe<SchoolMembership>;
  roles?: Maybe<Array<Maybe<Role>>>;
  school?: Maybe<School>;
  school_id: Scalars["ID"];
  status?: Maybe<Status>;
  user?: Maybe<User>;
  user_id: Scalars["ID"];
};

export type SchoolMembershipAddRoleArgs = {
  role_id: Scalars["ID"];
};

export type SchoolMembershipAddRolesArgs = {
  role_ids: Array<Scalars["ID"]>;
};

export type SchoolMembershipCheckAllowedArgs = {
  permission_name: Scalars["ID"];
};

export type SchoolMembershipLeaveArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SchoolMembershipRemoveRoleArgs = {
  role_id: Scalars["ID"];
};

export enum SchoolSortBy {
  Id = "id",
  Name = "name",
  ShortCode = "shortCode",
}

export type SchoolSortInput = {
  field: Array<SchoolSortBy>;
  order: SortOrder;
};

export type SchoolSummaryNode = {
  __typename?: "SchoolSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
  status: Status;
  userStatus?: Maybe<Status>;
};

export type SchoolsConnectionEdge = IConnectionEdge & {
  __typename?: "SchoolsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SchoolConnectionNode>;
};

export type SchoolsConnectionResponse = IConnectionResponse & {
  __typename?: "SchoolsConnectionResponse";
  edges?: Maybe<Array<Maybe<SchoolsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export enum Status {
  Active = "active",
  Inactive = "inactive",
}

export type StringFilter = {
  caseInsensitive?: Maybe<Scalars["Boolean"]>;
  operator: StringOperator;
  value: Scalars["String"];
};

export enum StringOperator {
  Contains = "contains",
  Eq = "eq",
  Neq = "neq",
}

export type SubcategoriesConnectionEdge = IConnectionEdge & {
  __typename?: "SubcategoriesConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SubcategoriesConnectionNode>;
};

export type SubcategoriesConnectionNode = {
  __typename?: "SubcategoriesConnectionNode";
  id: Scalars["ID"];
  name: Scalars["String"];
  status: Status;
  system: Scalars["Boolean"];
};

export type SubcategoriesConnectionResponse = IConnectionResponse & {
  __typename?: "SubcategoriesConnectionResponse";
  edges?: Maybe<Array<Maybe<SubcategoriesConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type Subcategory = {
  __typename?: "Subcategory";
  delete?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  system: Scalars["Boolean"];
};

export type SubcategoryDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SubcategoryDetail = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type SubcategoryFilter = {
  AND?: Maybe<Array<Maybe<SubcategoryFilter>>>;
  OR?: Maybe<Array<Maybe<SubcategoryFilter>>>;
  categoryId?: Maybe<UuidFilter>;
  organizationId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum SubcategorySortBy {
  Id = "id",
  Name = "name",
}

export type SubcategorySortInput = {
  field: SubcategorySortBy;
  order: SortOrder;
};

export type Subject = {
  __typename?: "Subject";
  categories?: Maybe<Array<Category>>;
  delete?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  status?: Maybe<Status>;
  subcategories?: Maybe<Array<Subcategory>>;
  system: Scalars["Boolean"];
};

export type SubjectDeleteArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type SubjectConnectionNode = {
  __typename?: "SubjectConnectionNode";
  categories?: Maybe<Array<CategorySummaryNode>>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  programs?: Maybe<Array<ProgramSummaryNode>>;
  status: Status;
  system: Scalars["Boolean"];
};

export type SubjectDetail = {
  categories?: Maybe<Array<Scalars["ID"]>>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  system?: Maybe<Scalars["Boolean"]>;
};

export type SubjectFilter = {
  AND?: Maybe<Array<Maybe<SubjectFilter>>>;
  OR?: Maybe<Array<Maybe<SubjectFilter>>>;
  categoryId?: Maybe<UuidFilter>;
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  status?: Maybe<StringFilter>;
  system?: Maybe<BooleanFilter>;
};

export enum SubjectSortBy {
  Id = "id",
  Name = "name",
  System = "system",
}

export type SubjectSortInput = {
  field: SubjectSortBy;
  order: SortOrder;
};

export type SubjectSummaryNode = {
  __typename?: "SubjectSummaryNode";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  status: Status;
  system: Scalars["Boolean"];
};

export type SubjectsConnectionEdge = IConnectionEdge & {
  __typename?: "SubjectsConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<SubjectConnectionNode>;
};

export type SubjectsConnectionResponse = IConnectionResponse & {
  __typename?: "SubjectsConnectionResponse";
  edges?: Maybe<Array<Maybe<SubjectsConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type UuidExclusiveFilter = {
  operator: UuidExclusiveOperator;
  value?: Maybe<Scalars["UUID"]>;
};

export enum UuidExclusiveOperator {
  Eq = "eq",
  IsNull = "isNull",
  Neq = "neq",
}

export type UuidFilter = {
  operator: UuidOperator;
  value: Scalars["UUID"];
};

export enum UuidOperator {
  Eq = "eq",
  Neq = "neq",
}

export type User = {
  __typename?: "User";
  addOrganization?: Maybe<OrganizationMembership>;
  addSchool?: Maybe<SchoolMembership>;
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  classesStudying?: Maybe<Array<Maybe<Class>>>;
  classesTeaching?: Maybe<Array<Maybe<Class>>>;
  createOrganization?: Maybe<Organization>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  full_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  membership?: Maybe<OrganizationMembership>;
  memberships?: Maybe<Array<Maybe<OrganizationMembership>>>;
  merge?: Maybe<User>;
  /**
   * 'my_organization' is the Organization that this user has created
   * @deprecated Use 'organization_ownerships'.
   */
  my_organization?: Maybe<Organization>;
  organization_ownerships?: Maybe<Array<Maybe<OrganizationOwnership>>>;
  organizationsWithPermission?: Maybe<Array<Maybe<OrganizationMembership>>>;
  phone?: Maybe<Scalars["String"]>;
  primary?: Maybe<Scalars["Boolean"]>;
  school_membership?: Maybe<SchoolMembership>;
  school_memberships?: Maybe<Array<Maybe<SchoolMembership>>>;
  schoolsWithPermission?: Maybe<Array<Maybe<SchoolMembership>>>;
  set?: Maybe<User>;
  setPrimary?: Maybe<Scalars["Boolean"]>;
  subjectsTeaching?: Maybe<Array<Maybe<Subject>>>;
  user_id: Scalars["ID"];
  /** @deprecated Use 'full_name'. */
  user_name?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type UserAddOrganizationArgs = {
  organization_id: Scalars["ID"];
};

export type UserAddSchoolArgs = {
  school_id: Scalars["ID"];
};

export type UserCreateOrganizationArgs = {
  address1?: Maybe<Scalars["String"]>;
  address2?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  organization_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  shortCode?: Maybe<Scalars["String"]>;
};

export type UserMembershipArgs = {
  organization_id: Scalars["ID"];
};

export type UserMergeArgs = {
  other_id?: Maybe<Scalars["String"]>;
};

export type UserOrganizationsWithPermissionArgs = {
  permission_name: Scalars["String"];
};

export type UserSchool_MembershipArgs = {
  school_id: Scalars["ID"];
};

export type UserSchoolsWithPermissionArgs = {
  permission_name: Scalars["String"];
};

export type UserSetArgs = {
  alternate_email?: Maybe<Scalars["String"]>;
  alternate_phone?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  date_of_birth?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  family_name?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  given_name?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
};

export type UserSetPrimaryArgs = {
  _?: Maybe<Scalars["Int"]>;
};

export type UserConnectionNode = {
  __typename?: "UserConnectionNode";
  alternateContactInfo?: Maybe<ContactInfo>;
  avatar?: Maybe<Scalars["String"]>;
  contactInfo: ContactInfo;
  dateOfBirth?: Maybe<Scalars["String"]>;
  familyName?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  givenName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  /** @deprecated Sunset Date: 31/01/22 Details: https://calmisland.atlassian.net/l/c/7Ry00nhw */
  organizations: Array<OrganizationSummaryNode>;
  organizationsConnection?: Maybe<OrganizationsConnectionResponse>;
  roles: Array<RoleSummaryNode>;
  schools: Array<SchoolSummaryNode>;
  status: Status;
};

export type UserConnectionNodeOrganizationsConnectionArgs = {
  count?: Maybe<Scalars["PageSize"]>;
  cursor?: Maybe<Scalars["String"]>;
  direction?: Maybe<ConnectionDirection>;
  filter?: Maybe<OrganizationFilter>;
  sort?: Maybe<OrganizationSortInput>;
};

export type UserFilter = {
  AND?: Maybe<Array<UserFilter>>;
  OR?: Maybe<Array<UserFilter>>;
  avatar?: Maybe<StringFilter>;
  classId?: Maybe<UuidExclusiveFilter>;
  email?: Maybe<StringFilter>;
  familyName?: Maybe<StringFilter>;
  givenName?: Maybe<StringFilter>;
  organizationId?: Maybe<UuidFilter>;
  organizationUserStatus?: Maybe<StringFilter>;
  phone?: Maybe<StringFilter>;
  roleId?: Maybe<UuidFilter>;
  schoolId?: Maybe<UuidExclusiveFilter>;
  userId?: Maybe<UuidFilter>;
  userStatus?: Maybe<StringFilter>;
};

export enum UserSortBy {
  FamilyName = "familyName",
  GivenName = "givenName",
}

export type UserSortInput = {
  field: Array<UserSortBy>;
  order: SortOrder;
};

export type UserSummaryNode = {
  __typename?: "UserSummaryNode";
  id?: Maybe<Scalars["String"]>;
};

export type UsersConnectionEdge = IConnectionEdge & {
  __typename?: "UsersConnectionEdge";
  cursor?: Maybe<Scalars["String"]>;
  node?: Maybe<UserConnectionNode>;
};

export type UsersConnectionResponse = IConnectionResponse & {
  __typename?: "UsersConnectionResponse";
  edges?: Maybe<Array<Maybe<UsersConnectionEdge>>>;
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};

export type IConnectionEdge = {
  cursor?: Maybe<Scalars["String"]>;
};

export type IConnectionResponse = {
  pageInfo?: Maybe<ConnectionPageInfo>;
  totalCount?: Maybe<Scalars["Int"]>;
};
