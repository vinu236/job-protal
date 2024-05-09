import { S3 } from "aws-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const s3Config = {
  accessKeyId: process.env.ACCESS_KEY_AWS ?? "",
  secretAccessKey: process.env.SECRET_AWS ?? "",
  region: process.env.AWS_REGION ?? "",
};
// initializing the S3
const s3 = new S3(s3Config);

// function defines :
// upload files into the bucket
// need to pass filePath and folder name
export const s3UploadV2 = async (filePath: string, folder: string) => {
  // for creating the readable stream : which is actual file data
  // buffering of the data read from the file
  const file = fs.createReadStream(filePath);
  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME ?? "",
    Key: `${folder}/${path.basename(filePath)}`,
    Body: file, // which is like file.buffer
  };
  // return a promise: whether it accepts or reject
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // this wil delete the file from the system , after upload to aws s3 bucket
        fs.unlinkSync(filePath);
        resolve(data);
      }
    });
  });
};
