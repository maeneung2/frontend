import axios from "axios";
import { api } from "./axios";

type UploadFolder = "profiles" | "notices" | "notes";

export const uploadImageToS3 = async (file: File, folder: UploadFolder): Promise<string> => {
  const res = await api.post<{ data: { uploadUrl: string; publicUrl: string } }>(
    "/api/v1/upload/presigned-url",
    { contentType: file.type, folder }
  );
  const { uploadUrl, publicUrl } = res.data.data;

  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return publicUrl;
};