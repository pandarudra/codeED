// file.model.ts
import { Schema, model, Document, models, Types } from "mongoose";

export interface IFile extends Document {
  name: string;
  extension: string;
  type: string; // File type category
  mimeType: string;
  parentWorkspaceId: Types.ObjectId;
  parentFolderId: Types.ObjectId;
  path: string; // Full path: "/src/components/Button.tsx"
  b2Key: string; // B2 object key
  size: number; // File size in bytes
  checksum: string; // For integrity checks
  isDeleted: boolean;
  lastModifiedBy: Types.ObjectId;
  version: number; // For version tracking
  permissions: {
    read: Types.ObjectId[];
    write: Types.ObjectId[];
  };
  metadata: {
    language?: string;
    encoding?: string;
    lineCount?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      validate: {
        validator: (name: string) => !/[<>:"/\\|?*]/.test(name),
        message: "File name contains invalid characters",
      },
    },
    extension: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "javascript",
        "typescript",
        "python",
        "html",
        "css",
        "scss",
        "sass",
        "json",
        "xml",
        "yaml",
        "markdown",
        "text",
        "shell",
        "dockerfile",
        "sql",
        "php",
        "java",
        "cpp",
        "c",
        "go",
        "rust",
        "ruby",
        "other",
      ],
    },
    mimeType: { type: String, required: true },
    parentWorkspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    parentFolderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    path: { type: String, required: true }, // e.g., "/src/components/Button.tsx"
    b2Key: { type: String, required: true, unique: true },
    size: { type: Number, default: 0, min: 0 },
    checksum: { type: String, required: true }, // MD5 or SHA256
    isDeleted: { type: Boolean, default: false },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    version: { type: Number, default: 1, min: 1 },
    permissions: {
      read: [{ type: Schema.Types.ObjectId, ref: "User" }],
      write: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    metadata: {
      language: String,
      encoding: { type: String, default: "utf-8" },
      lineCount: { type: Number, min: 0 },
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
fileSchema.index({ parentWorkspaceId: 1, isDeleted: 1 });
fileSchema.index({ parentFolderId: 1, isDeleted: 1 });
fileSchema.index({ parentWorkspaceId: 1, parentFolderId: 1 });
fileSchema.index({ parentWorkspaceId: 1, path: 1 });
fileSchema.index({ type: 1 });
fileSchema.index({ extension: 1 });
fileSchema.index({ b2Key: 1 }); // Unique index for B2 keys
fileSchema.index({ "permissions.read": 1 });
fileSchema.index({ "permissions.write": 1 });
fileSchema.index({ lastModifiedBy: 1, updatedAt: -1 });

// Compound index for efficient file listing
fileSchema.index({ parentWorkspaceId: 1, parentFolderId: 1, isDeleted: 1 });

// Text index for file search
fileSchema.index({ name: "text", "metadata.language": "text" });

export const File = models.File || model<IFile>("File", fileSchema);
