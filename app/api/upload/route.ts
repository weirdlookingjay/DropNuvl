import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    // parse request body
    const body = await request.json();
    const { imagekit, userId: bodyUserId } = body;

    if (bodyUserId !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!imagekit || !imagekit.url) {
      return new Response("Invalid file upload data", { status: 400 });
    }

    const fileData = {
      name: imagekit.name || "untitled",
      path: imagekit.filePath,
      size: imagekit.size || 0,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId,
      parentId: null,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to save info to database" },
      { status: 500 }
    );
  }
}
