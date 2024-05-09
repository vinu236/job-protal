import { generateStorage } from "../helpers/helpers";
import multer from "multer";

// multer error config
export enum MulterErrorCode {
  fileCountLimit = "LIMIT_FILE_COUNT", // jobSeeker
  fileSizeLimit = "LIMIT_FILE_SIZE",
}

// const uploadProfile = multer({ storage: generateStorage("src/temp/profile") });
const uploadProfile = multer({
  storage: generateStorage("src/temp/files"),
  limits: { files: 2, fileSize: 45 * 1024 * 1024 }, // two files allowed, 45mb
});

export { uploadProfile };
