"use client";

import React from "react";
import AddBlogForm from "./add-blog-form";
import { useAdmin } from "@/hooks/use-admin";

export default function AdminBlogSection() {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) return null;
  if (!isAdmin) return null;

  return <AddBlogForm />;
}
