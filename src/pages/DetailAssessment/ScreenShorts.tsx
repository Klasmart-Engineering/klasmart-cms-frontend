import { d } from "@locale/LocaleManager";
import { useDownloadMedia, useImageMetadata } from "kidsloop-media-ui";

export interface ScreenShortsProps {
  userId: string;
  roomId: string;
  h5pId: string;
  h5pSubId?: string;
  resourceType?: string;
}
export function ScreenShorts(props: ScreenShortsProps) {
  const { userId, roomId, h5pId, h5pSubId, resourceType } = props;
  const multipleScreenShorts = ["ArithmeticQuiz", "Flashcards"];
  const { loading, error, mediaMetadata } = useImageMetadata({
    userId,
    roomId,
    h5pId,
    h5pSubId: h5pSubId ? h5pSubId : undefined,
  });
  const length = mediaMetadata?.length;
  if (error) {
    return <p>{d("Server request failed").t("general_error_unknown")}</p>;
  }
  if (loading) return <p>Loading ...</p>;
  if (!length) return <p>{"This image is not available. Please try again later."}</p>;
  if (multipleScreenShorts.indexOf(resourceType as string) < 0) {
    return <ImageView
            resourceType={resourceType}
            imageId={mediaMetadata[0].id}
            roomId={roomId as string}
            mimeType={mediaMetadata[0].mimeType ? mediaMetadata[0].mimeType : "image/jpeg"}
          />
  }
  const imgsCon = mediaMetadata.map(item => (
    <ImageView
      key={item.id}
      resourceType={resourceType}
      imageId={item.id}
      roomId={roomId as string}
      mimeType={item.mimeType ? item.mimeType : "image/jpeg"}
    />
  ))
  return (
    <>
      {imgsCon}
    </>
  );
}

export interface ImageViewProps {
  resourceType?: string;
  imageId: string;
  roomId: string;
  mimeType: string;
}
export function ImageView(props: ImageViewProps) {
  const { imageId, roomId, mimeType } = props;
  const {
    loading,
    error,
    src: imgSrc,
  } = useDownloadMedia({
    mediaId: imageId,
    roomId,
    mimeType,
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    return <p>{d("Server request failed").t("general_error_unknown")}</p>;
  }
  return (
    <div style={{width: "100%", height: "auto"}}>
      <img style={{width: "100%", height: "auto"}} src={imgSrc} alt={"screenshorts"} />
    </div>
  )
}