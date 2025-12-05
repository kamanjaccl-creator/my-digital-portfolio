"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddBlogFormProps {
  onBlogAdded?: () => void;
}

export default function AddBlogForm({ onBlogAdded }: AddBlogFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("");
  const [readTime, setReadTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!slug) setSlug(generateSlug(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !excerpt || !content || !author) {
      toast({ title: "Validation Error", description: "Fill required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, content, coverImage: coverImage || null, author, readTime: readTime || null }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: json?.error || "Failed to create post", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Blog post created" });
        setTitle("");
        setSlug("");
        setExcerpt("");
        setContent("");
        setCoverImage("");
        setAuthor("");
        setReadTime("");
        if (onBlogAdded) onBlogAdded();
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Server error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Blog Post</CardTitle>
        <CardDescription>Create a new blog post</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input value={title} onChange={(e) => onTitleChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt *</label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content *</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image URL</label>
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Author *</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Read Time</label>
            <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Blog Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
