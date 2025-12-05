import AddBlogForm from "@/components/add-blog-form";
import { isAdmin } from "@/lib/auth";

export default async function AdminBlogPage() {
  const allowed = await isAdmin();
  if (!allowed) {
    return (
      <div className="container py-12">
        <p>Unauthorized</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Manage Blog</h1>
      <AddBlogForm />
    </div>
  );
}
