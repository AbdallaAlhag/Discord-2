import express, { Router } from "express";
import { S3 } from "@aws-sdk/client-s3"; // Import S3 client from v3
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import the utility for generating signed URLs
import { PutObjectCommand } from "@aws-sdk/client-s3"; // Import the S3 command for 'putObject'

const router: Router = express.Router();

// Destructuring all the environment variables
const { AWSAccessKeyId, AWSSecretKey, AWSBucketName, AWSRegion } = process.env;

if (!AWSAccessKeyId || !AWSSecretKey || !AWSBucketName || !AWSRegion) {
  throw new Error("Missing one or more AWS environment variables");
}

// Create the S3 client instance with v3
const s3Client = new S3({
  region: AWSRegion,
  credentials: {
    accessKeyId: AWSAccessKeyId,
    secretAccessKey: AWSSecretKey,
  },
});

// Expiration time for generated upload URL
const URL_EXPIRATION_TIME = 60; // in seconds

// Since filenames in S3 bucket need to be unique, we have this helper function that breaks down user uploaded file by it's name and extension and then adds timestamp to it, converting something like "image.jpg" into "image-1668202200849.jpg"
const generateUniqueFilename = (fileName: string) => {
  // Destructure the name and extension from filename split by a period
  const [name, extension] = fileName ? fileName.split(".") : ["", ""];
  const uniqueFileName = `${name}-${Date.now()}.${extension}`;
  return uniqueFileName;
};

// Endpoint for requesting a unique upload URL from AWS
router.post("/get-signed-url", async (req, res) => {
  const { fileName, fileType } = req.body;
  // Log the request body for debugging
  console.log("Request body:", req.body);

  if (!fileName || !fileType) {
    console.log('missing "fileName" or "fileType" in request body');
    return;
  }

  try {
    // Generate a unique filename for S2 based on uploaded file name
    const uniqueFileName = generateUniqueFilename(fileName);
    console.log("Generated unique filename:", uniqueFileName);

    // Using AWS SDK v3 to get a unique upload URL
    const command = new PutObjectCommand({
      Bucket: AWSBucketName,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: URL_EXPIRATION_TIME,
    });

    console.log("Signed URL:", url);
    console.log("Unique Filename:", uniqueFileName);
    // Send the response with the URL and the unique filename
    res.status(200).json({
      url,
      fileName: uniqueFileName,
    });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).send(err);
  }
});

export default router;
