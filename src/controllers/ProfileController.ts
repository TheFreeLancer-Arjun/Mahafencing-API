import { Request, Response, NextFunction, RequestHandler } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../db/prisma";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config";

// Utility type for async request handlers
type AsyncRequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => Promise<void | any>;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Multer configuration with file filtering
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

// Upload profile handler
const uploadProfileHandler: AsyncRequestHandler = async (req, res, next) => {
  const authReq = req as AuthenticatedRequest;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const accountId = authReq.user?.id;
    if (!accountId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload image to Cloudinary with optimizations
    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "letmerecall_avatar_uploads",
      transformation: [
        { width: 500, height: 500, crop: "fill" }, // Standardize image size
        { quality: "auto:best" } // Optimize quality
      ]
    });

    // Delete existing profile images for this user
    await prisma.profile.deleteMany({ where: { accountId } });

    // Create new profile record in DB
    const profile = await prisma.profile.create({
      data: {
        publicUrl: cloudinaryResponse.secure_url, // Using secure HTTPS URL
        accountId,
      },
    });

    return res.status(201).json({
      message: "Image uploaded successfully",
      profile,
      imageInfo: {
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
        format: cloudinaryResponse.format
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to upload image" });
  }
};

export const uploadProfile = [upload.single("image"), uploadProfileHandler];

export const getProfile: AsyncRequestHandler = async (req, res, next) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const accountId = authReq.user?.id;
    if (!accountId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await prisma.profile.findFirst({
      where: { accountId },
      select: {
        id: true,
        publicUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "No profile found" });
    }

    return res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Optional: Add profile deletion endpoint
export const deleteProfile: AsyncRequestHandler = async (req, res, next) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const accountId = authReq.user?.id;
    if (!accountId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find profile to get Cloudinary URL
    const profile = await prisma.profile.findFirst({ where: { accountId } });
    
    if (profile) {
      // Extract public_id from URL for Cloudinary deletion
      const urlParts = profile.publicUrl.split('/');
      const publicId = urlParts.slice(urlParts.indexOf('upload') + 1).join('/').split('.')[0];
      
      await cloudinary.uploader.destroy(publicId);
      await prisma.profile.deleteMany({ where: { accountId } });
    }

    return res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Failed to delete profile" });
  }
};
