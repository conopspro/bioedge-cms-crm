"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownContentProps {
  content: string
}

/**
 * Auto-link bare URLs and domain names in markdown content.
 * Converts plain text URLs like "example.com" or "https://example.com"
 * into proper markdown links, but skips URLs already inside markdown link syntax.
 */
function autoLinkUrls(text: string): string {
  // Match bare URLs (with or without protocol) that are NOT already inside markdown links
  // This regex handles:
  // 1. Full URLs: https://example.com/path
  // 2. Bare domains: example.com, example.co.uk, example.com/path
  return text.replace(
    /(?<!\]\()(?<!\()((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:[-a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=%]*[a-zA-Z0-9/])?)(?!\))/g,
    (match, url, offset) => {
      // Check if this URL is already part of a markdown link [text](url) or <url>
      const before = text.slice(Math.max(0, offset - 2), offset)
      if (before.endsWith("](") || before.endsWith("<")) return match

      // Check if it's inside a markdown link text portion [url](...)
      // Look backwards for an unmatched [
      const textBefore = text.slice(0, offset)
      const lastOpenBracket = textBefore.lastIndexOf("[")
      const lastCloseBracket = textBefore.lastIndexOf("]")
      if (lastOpenBracket > lastCloseBracket) {
        // We're inside [...] — check if followed by (...) which makes it a link
        const afterMatch = text.slice(offset + match.length)
        if (afterMatch.match(/^\]\(/)) return match
      }

      const href = url.startsWith("http") ? url : `https://${url}`
      return `[${url}](${href})`
    }
  )
}

/**
 * Renders markdown content with proper styling
 * Uses react-markdown with GFM (GitHub Flavored Markdown) support
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  const processedContent = autoLinkUrls(content)

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-slate-700 leading-relaxed mb-4">{children}</p>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            {children}
          </a>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-slate-700 leading-relaxed">{children}</li>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 italic text-slate-600 bg-slate-50 rounded-r">
            {children}
          </blockquote>
        ),

        // Code
        code: ({ className, children }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-sm font-mono">
                {children}
              </code>
            )
          }
          return (
            <code className="block overflow-x-auto p-4 rounded-lg bg-slate-900 text-slate-100 text-sm font-mono">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="my-4 rounded-lg overflow-hidden">{children}</pre>
        ),

        // Horizontal Rule
        hr: () => <hr className="my-8 border-slate-200" />,

        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-slate-900">{children}</strong>
        ),

        // Emphasis/Italic
        em: ({ children }) => (
          <em className="italic text-slate-700">{children}</em>
        ),

        // Images
        img: ({ src, alt }) => (
          <figure className="my-6">
            <img
              src={src}
              alt={alt || ""}
              className="rounded-lg w-full"
            />
            {alt && (
              <figcaption className="text-center text-sm text-slate-500 mt-2">
                {alt}
              </figcaption>
            )}
          </figure>
        ),

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-slate-200 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-slate-50">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b border-slate-200">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-slate-700 border-r border-slate-200 last:border-r-0">
            {children}
          </td>
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  )
}
