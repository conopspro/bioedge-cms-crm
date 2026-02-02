import React from "react"

/**
 * Renders plain text with auto-linked URLs.
 * URLs in the text become clickable <a> tags that open in new tabs.
 * Preserves whitespace/newlines via the parent's whitespace-pre-line/pre-wrap.
 */
export function RichText({
  children,
  className,
  style,
  linkClassName,
}: {
  children: string
  className?: string
  style?: React.CSSProperties
  linkClassName?: string
}) {
  const urlRegex = /(https?:\/\/[^\s<>)"']+)/g
  const parts = children.split(urlRegex)

  return (
    <span className={className} style={style}>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName || "underline hover:opacity-80"}
            style={{ color: "inherit" }}
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  )
}
