import Link from "next/link";

type BreadcrumbProps = {
  categoryName: string;
  categorySlug: string;
  projectTitle: string;
};

export default function Breadcrumb({
  categoryName,
  categorySlug,
  projectTitle,
}: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      <Link
        href={`/${categorySlug}`}
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {categoryName}
      </Link>
      <span className="mx-2">→</span>
      <span className="text-gray-900 dark:text-gray-100">{projectTitle}</span>
    </nav>
  );
}
