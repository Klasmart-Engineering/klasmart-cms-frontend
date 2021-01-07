import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentTypeList } from "../../api/type";
import { h5plibId2Name, H5PLibraryContent, H5PSchema } from "../../models/ModelH5pSchema";
import { H5pCompare } from "./H5pCompare";
import { H5pDetails } from "./H5pDetails";
import H5pInfo from "./H5pInfo";
import { H5pLibraryInput } from "./H5pLibraryInput";
// import { RichTextInput } from "../../components/RichTextInput";

const useSchema = (library?: string) => {
  const [schema, setSchema] = useState<H5PSchema>();
  useEffect(() => {
    if (!library) return;
    apiCreateContentTypeSchema<H5PSchema>(library).then(setSchema);
  }, [setSchema, library]);
  return schema;
};

const useContentTypeList = () => {
  const [contentTypeList, setContentTypeList] = useState<ContentTypeList>();
  useEffect(() => {
    apiGetContentTypeList().then(setContentTypeList);
  }, []);
  return contentTypeList;
};

const useLibrary = (libraryOfContent?: string) => {
  const [userSpecifiedLibrary, setUserSpecifiedLibrary] = useState<string>();
  const library = libraryOfContent ?? userSpecifiedLibrary;
  return [library, setUserSpecifiedLibrary] as const;
};

export function H5pEditor() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [libContent, setLibContent] = useState<H5PLibraryContent>();
  const [library, setLibrary] = useLibrary(query.get("library") || undefined);
  const h5p_id = query.get("h5p_id") || undefined;
  const contentTypeList = useContentTypeList();
  const schema = useSchema(library);
  if (!library)
    return !contentTypeList ? null : h5p_id ? (
      <H5pInfo contentTypeList={contentTypeList} />
    ) : (
      <H5pLibraryInput onChange={setLibrary} contentTypeList={contentTypeList} />
    );
  return !schema ? null : (
    <Fragment>
      <H5pCompare value={libContent} />
      <H5pDetails value={{ library: h5plibId2Name(library) }} schema={schema} onChange={setLibContent} />
    </Fragment>
  );
}

H5pEditor.routeBasePath = "/h5pEditor";
H5pEditor.routeRedirectDefault = `/h5pEditor`;
