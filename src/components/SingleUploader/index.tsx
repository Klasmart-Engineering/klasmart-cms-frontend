import { getContentResourceUploadPath } from "@reducers/content";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { BatchItem, FileLike } from "@rpldy/shared";
import { PreSendData, UploadyContextType, useItemProgressListener, useRequestPreSend } from "@rpldy/shared-ui";
import { UPLOADER_EVENTS } from "@rpldy/uploader";
import Uploady, { UploadyContext, UploadyProps } from "@rpldy/uploady";
import React, { forwardRef, ReactNode, RefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../api";

export interface SingleUploaderControl {
  uploady: UploadyContextType;
  item: BatchItem;
  btnRef: RefObject<HTMLButtonElement>;
  value?: string;
  isUploading?: boolean;
}

export interface ImageDimesion {
  width: number;
  height: number;
}
export function getImageDimension(file: FileLike): Promise<ImageDimesion> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      resolve({ width, height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file as File);
  });
}
export interface BaseUploaderProps {
  value?: string;
  render: (control: SingleUploaderControl) => ReactNode;
}
function BaseUploader(props: BaseUploaderProps) {
  const { value, render } = props;
  const uploady = useContext(UploadyContext);
  const item = useItemProgressListener();
  const btnRef = useRef<HTMLButtonElement>(null);
  const isUploading = item?.completed > 0 && item?.completed < 100;
  useEffect(() => {
    const handleClick = () => uploady.showFileUpload();
    const btn = btnRef.current;
    btn?.addEventListener("click", handleClick);
    return () => btn?.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploady, btnRef.current]);
  return <>{render({ uploady, item, btnRef, value, isUploading })}</>;
}

const parseExtension = (filename: string) => {
  if (!filename.includes(".")) return "";
  return filename.split(".").pop() || "";
};

interface FileLikeWithId extends FileLike {
  id?: string;
}
export type useRequestPreSendReturnType = boolean | ReturnType<Parameters<typeof useRequestPreSend>[0]>;

export interface SingleUploaderProps extends BaseUploaderProps, UploadyProps {
  partition: NonNullable<Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0]>["partition"];
  value?: string;
  transformFile?: (file: FileLike) => Promise<FileLike>;
  onChange?: (value?: string) => any;
  onChangeFile?: (file?: FileLikeWithId) => any;
  beforeUpload?: (file: FileLike) => Promise<boolean>;
}
export const SingleUploader = forwardRef<HTMLDivElement, SingleUploaderProps>((props, ref) => {
  const { value, onChange, render, partition, transformFile, onChangeFile, beforeUpload, ...uploadyProps } = props;
  const dispatch = useDispatch();
  const [rid, setRid] = useState<string>();
  const [file, setFile] = useState<FileLike>();
  const listeners = useMemo(
    () => ({
      async [UPLOADER_EVENTS.REQUEST_PRE_SEND](props: PreSendData): Promise<useRequestPreSendReturnType> {
        const { items } = props;
        try {
          const file = transformFile ? await transformFile(items[0].file) : items[0].file;
          const extension = parseExtension(file.name);

          const getPathAndId: () => Promise<useRequestPreSendReturnType> = async () => {
            const { payload } = (await dispatch(getContentResourceUploadPath({ partition, extension }))) as unknown as PayloadAction<
              AsyncTrunkReturned<typeof getContentResourceUploadPath>
            >;
            if (!payload) return false;
            const { path, resource_id } = payload;
            setRid(resource_id);
            setFile(file);
            return { options: { destination: { url: path } }, items: [{ ...items[0], file }] };
          };
          if (beforeUpload && extension.toLowerCase() === "pdf") {
            const isValidate = await beforeUpload(file);
            return isValidate ? getPathAndId() : false;
          } else {
            return getPathAndId();
          }
        } catch (err) {
          return false;
        }
      },
      [UPLOADER_EVENTS.ITEM_FINISH]() {
        if (onChange) onChange(rid);
        if (onChangeFile && file) onChangeFile(Object.assign(file, { id: rid }));
      },
    }),
    [transformFile, beforeUpload, dispatch, partition, onChange, rid, onChangeFile, file]
  );
  return (
    <div ref={ref}>
      <Uploady {...uploadyProps} method="PUT" sendWithFormData={false} listeners={listeners}>
        <BaseUploader {...{ value, onChange, render }} />
      </Uploady>
    </div>
  );
});
