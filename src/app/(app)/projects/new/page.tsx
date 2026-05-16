import { PageHeader } from "@/components/common/page-header";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Create project"
        description="Start with a simple project identity. The next step will collect land, water, soil, and farming goal details."
      />
      <CreateProjectForm />
    </div>
  );
}
