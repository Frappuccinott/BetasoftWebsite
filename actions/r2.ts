"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";

export async function getPresignedUploadUrl(fileName: string, contentType: string, folder?: string) {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not configured");
  }

  // Güvenlik ve çakışmaları önlemek için dosya adına timestamp ekleyebilirsiniz
  const safeFileName = fileName.replace(/\s+/g, "-");
  const uniqueFileName = folder 
    ? `${folder}/${Date.now()}-${safeFileName}` 
    : `${Date.now()}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    ContentType: contentType,
  });

  try {
    // URL 5 dakika (300 saniye) boyunca geçerli olacak
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL 
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFileName}`
      : ``;

    return {
      success: true,
      uploadUrl: signedUrl,
      publicUrl,
      fileName: uniqueFileName
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return { success: false, error: "URL oluşturulamadı" };
  }
}

import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function deleteImageFromR2(fileKey: string) {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not configured");
  }
  
  if (!fileKey) {
    return { success: false, error: "Dosya anahtarı (key) boş olamaz." };
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  try {
    await r2Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return { success: false, error: "Dosya R2'den silinemedi" };
  }
}
