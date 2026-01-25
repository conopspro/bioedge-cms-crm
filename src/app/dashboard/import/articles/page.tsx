import { ArticleImportForm } from "@/components/import/article-import-form"

export default function ImportArticlesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Articles</h1>
        <p className="text-muted-foreground">
          Upload markdown files to import as articles
        </p>
      </div>

      <ArticleImportForm />
    </div>
  )
}
