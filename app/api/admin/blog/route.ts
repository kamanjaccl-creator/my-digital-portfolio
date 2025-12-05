import { NextResponse } from "next/server";
import { db, blogPosts } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const { title, slug, excerpt, content, coverImage = null, author, readTime = null } = data ?? {};

    if (!title || !slug || !excerpt || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // check slug uniqueness
    const existing = await db.select().from(blogPosts).where((col) => col.slug === slug);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const inserted = await db.insert(blogPosts).values({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      readTime,
    }).returning();

    if (!inserted || inserted.length === 0) {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
    }

    const newPost = inserted[0];

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Error in admin blog API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
