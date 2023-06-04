import { S3Handler } from "aws-lambda";
// import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import sharp from 'sharp';

// const s3 = new S3Client({});

export const handler: S3Handler = async (event) => {
  console.log('Received S3 BOB event:', JSON.stringify(event, null, 2));

  // const record = event.Records[0];
  // const bucket = record.s3.bucket.name;
  // const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

  // try {
  //   const originalImage = await s3.send(new GetObjectCommand({
  //     Bucket: bucket, Key: key
  //   }))

  //   const img = await resizeImage(await originalImage.Body.transformToByteArray(), 128);

  //   console.log("Resized image", img.length);
  //   console.log("bob");
  // } catch (error) {
  //   console.error("Error resizing image", error);
  // }
};

// const resizeImage = async (image: Uint8Array, sizeInPx: number): Promise<Buffer> => {
//   return await sharp(image).resize(sizeInPx, sizeInPx, { fit: "cover" }).toBuffer();
// }

// const uploadImage = async (image: Buffer, bucket: string, originalKey: string, size: number) => {
//   const newKey =

//     await s3.send(new PutObjectCommand({
//       Bucket: bucket,
//     }))
// }

