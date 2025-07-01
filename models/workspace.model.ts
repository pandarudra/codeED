// workspace.model.ts
import mongoose, { Schema, model, models, Types } from "mongoose";

interface Workspace {
  name: string;
  description?: string;
  parentUserId: Types.ObjectId;
  b2BucketPath: string; // More specific than b2Link
  isDeleted: boolean;
  isPublic: boolean;
  collaborators: Types.ObjectId[]; // For future collaboration features
  settings: {
    defaultLanguage?: string;
    theme?: string;
  };
}

const workspaceSchema = new Schema<Workspace>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    parentUserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    b2BucketPath: { type: String, required: true, trim: true }, // e.g., "workspaces/workspace-id/"
    isDeleted: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    settings: {
      defaultLanguage: { type: String, default: "javascript" },
      theme: { type: String, default: "dark" },
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
workspaceSchema.index({ parentUserId: 1 });
workspaceSchema.index({ parentUserId: 1, isDeleted: 1 });
workspaceSchema.index({ collaborators: 1 });
workspaceSchema.index({ isPublic: 1, isDeleted: 1 });

export const Workspace =
  models.Workspace || model("Workspace", workspaceSchema);
export type WorkspaceDocument = mongoose.HydratedDocument<Workspace>;
