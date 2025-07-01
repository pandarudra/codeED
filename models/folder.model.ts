// folder.model.ts
import { Schema, model, Document, models, Types } from "mongoose";

export interface IFolder extends Document {
  name: string;
  parentWorkspaceId: Types.ObjectId;
  parentFolderId?: Types.ObjectId | null; // null for root folders
  path: string; // Full path for easier queries: "/src/components"
  isDeleted: boolean;
  lastModifiedBy: Types.ObjectId;
  permissions: {
    read: Types.ObjectId[];
    write: Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      validate: {
        validator: (name: string) => !/[<>:"/\\|?*]/.test(name),
        message: "Folder name contains invalid characters",
      },
    },
    parentWorkspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    parentFolderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    path: { type: String, required: true }, // e.g., "/src/components"
    isDeleted: { type: Boolean, default: false },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permissions: {
      read: [{ type: Schema.Types.ObjectId, ref: "User" }],
      write: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
folderSchema.index({ parentWorkspaceId: 1, isDeleted: 1 });
folderSchema.index({ parentFolderId: 1, isDeleted: 1 });
folderSchema.index({ parentWorkspaceId: 1, parentFolderId: 1 });
folderSchema.index({ parentWorkspaceId: 1, path: 1 });
folderSchema.index({ "permissions.read": 1 });
folderSchema.index({ "permissions.write": 1 });

// Compound index for efficient folder tree queries
folderSchema.index({ parentWorkspaceId: 1, parentFolderId: 1, isDeleted: 1 });

export const Folder = models.Folder || model<IFolder>("Folder", folderSchema);
