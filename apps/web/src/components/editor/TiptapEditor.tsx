"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { createLowlight } from "lowlight"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import css from "highlight.js/lib/languages/css"
import html from "highlight.js/lib/languages/xml"
import python from "highlight.js/lib/languages/python"
import sql from "highlight.js/lib/languages/sql"
import bash from "highlight.js/lib/languages/bash"
import { useState } from "react"

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Code, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  Undo, Redo, Highlighter, Type, ListChecks,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Wand2, Sparkles, Minus, CornerDownLeft
} from "lucide-react"

// Setup lowlight for syntax highlighting
const lowlight = createLowlight()
lowlight.register("javascript", js)
lowlight.register("typescript", ts)
lowlight.register("css", css)
lowlight.register("html", html)
lowlight.register("python", python)
lowlight.register("sql", sql)
lowlight.register("bash", bash)

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  onWordCountChange?: (words: number, chars: number) => void
  onAiAction?: (action: string, selectedText: string) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL: ToolBtn uses onMouseDown + e.preventDefault().
//   • This prevents the browser from moving focus out of the ProseMirror editor
//     when the user clicks a toolbar button, so the selection is preserved.
//   • The command runs via onMouseDown so it fires BEFORE the click causes any
//     selection collapse.
// ─────────────────────────────────────────────────────────────────────────────
const ToolBtn = ({
  onMouseDown: handleMouseDown,
  active,
  children,
  label
}: {
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void
  active?: boolean
  children: React.ReactNode
  label: string
}) => (
  <button
    type="button"
    aria-label={label}
    onMouseDown={handleMouseDown}
    className={`size-8 rounded-lg border flex items-center justify-center transition-all duration-150 shrink-0
      ${active
        ? "bg-primary text-primary-foreground border-primary shadow-sm"
        : "border-divider bg-surface-secondary text-default-500 hover:text-foreground hover:bg-surface hover:border-default-300"
      }`}
  >
    {children}
  </button>
)

// Helper to wrap every toolbar command with e.preventDefault()
const cmd = (
  e: React.MouseEvent<HTMLButtonElement>,
  fn: () => void
) => {
  e.preventDefault()
  fn()
}

const Divider = () => <div className="h-4 w-px bg-divider mx-1 shrink-0" />

export function TiptapEditor({ content, onChange, onWordCountChange, onAiAction }: TiptapEditorProps) {
  // Floating selection bubble bar state — driven by Tiptap's onSelectionUpdate
  const [bubble, setBubble] = useState<{
    show: boolean
    top: number
    left: number
    selectedText: string
  }>({ show: false, top: 0, left: 0, selectedText: "" })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4] }
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph", "listItem"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" }
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full h-auto my-4" },
        allowBase64: true
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: "Start writing your article here..."
      }),
      CharacterCount
    ],
    content,
    immediatelyRender: false,

    // Tiptap fires this every time the ProseMirror selection changes —
    // use it to position / hide the floating bubble bar.
    onSelectionUpdate({ editor }) {
      const { from, to } = editor.state.selection
      const isEmpty = from === to
      if (isEmpty) {
        setBubble(prev => ({ ...prev, show: false }))
        return
      }
      // Get selection coords from ProseMirror DOM
      const view = editor.view
      const start = view.coordsAtPos(from)
      const end   = view.coordsAtPos(to)
      const midX  = (start.left + end.right) / 2
      const topY  = Math.min(start.top, end.top) - 52
      const text  = editor.state.doc.textBetween(from, to, " ")
      setBubble({ show: true, top: topY, left: midX, selectedText: text })
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML())
      const words = editor.storage.characterCount.words()
      const chars = editor.storage.characterCount.characters()
      onWordCountChange?.(words, chars)
    }
  })

  if (!editor) return null

  const handleInsertLink = () => {
    const url = prompt("Enter URL:", "https://")
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const handleInsertImage = () => {
    const url = prompt("Enter Image URL:", "https://")
    if (url) editor.chain().focus().setImage({ src: url, alt: "" }).run()
  }

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="flex flex-col h-full">

      {/* ════════════════════════════════════════════════════════════════
          TOOLBAR — every button uses onMouseDown + e.preventDefault()
          so the ProseMirror editor never loses focus / selection.
          ════════════════════════════════════════════════════════════════ */}
      <div className="border-b border-divider bg-surface px-4 py-2 flex items-center flex-wrap gap-1 shrink-0">

        {/* History */}
        <ToolBtn label="Undo" active={false}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().undo().run())}>
          <Undo className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Redo" active={false}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().redo().run())}>
          <Redo className="size-3.5" />
        </ToolBtn>
        <Divider />

        {/* Text Formatting */}
        <ToolBtn label="Bold" active={editor.isActive("bold")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleBold().run())}>
          <Bold className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Italic" active={editor.isActive("italic")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleItalic().run())}>
          <Italic className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Underline" active={editor.isActive("underline")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleUnderline().run())}>
          <UnderlineIcon className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Strikethrough" active={editor.isActive("strike")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleStrike().run())}>
          <Strikethrough className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Highlight" active={editor.isActive("highlight")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleHighlight().run())}>
          <Highlighter className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Subscript" active={editor.isActive("subscript")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleSubscript().run())}>
          <SubscriptIcon className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Superscript" active={editor.isActive("superscript")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleSuperscript().run())}>
          <SuperscriptIcon className="size-3.5" />
        </ToolBtn>
        <Divider />

        {/* Headings */}
        <ToolBtn label="Heading 1" active={editor.isActive("heading", { level: 1 })}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleHeading({ level: 1 }).run())}>
          <Heading1 className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Heading 2" active={editor.isActive("heading", { level: 2 })}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}>
          <Heading2 className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Heading 3" active={editor.isActive("heading", { level: 3 })}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleHeading({ level: 3 }).run())}>
          <Heading3 className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Paragraph" active={editor.isActive("paragraph")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setParagraph().run())}>
          <Type className="size-3.5" />
        </ToolBtn>
        <Divider />

        {/* Lists */}
        <ToolBtn label="Bullet List" active={editor.isActive("bulletList")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleBulletList().run())}>
          <List className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Numbered List" active={editor.isActive("orderedList")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleOrderedList().run())}>
          <ListOrdered className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Task List" active={editor.isActive("taskList")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleTaskList().run())}>
          <ListChecks className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Blockquote" active={editor.isActive("blockquote")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleBlockquote().run())}>
          <Quote className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Code Block" active={editor.isActive("codeBlock")}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleCodeBlock().run())}>
          <Code className="size-3.5" />
        </ToolBtn>
        <Divider />

        {/* Alignment */}
        <ToolBtn label="Align Left" active={editor.isActive({ textAlign: "left" })}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setTextAlign("left").run())}>
          <AlignLeft className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Align Center" active={editor.isActive({ textAlign: "center" })}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setTextAlign("center").run())}>
          <AlignCenter className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Align Right" active={editor.isActive({ textAlign: "right" })}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setTextAlign("right").run())}>
          <AlignRight className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Justify" active={editor.isActive({ textAlign: "justify" })}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setTextAlign("justify").run())}>
          <AlignJustify className="size-3.5" />
        </ToolBtn>
        <Divider />

        {/* Media & Inserts */}
        <ToolBtn label="Insert Link" active={editor.isActive("link")}
          onMouseDown={(e) => cmd(e, handleInsertLink)}>
          <LinkIcon className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Insert Image" active={false}
          onMouseDown={(e) => cmd(e, handleInsertImage)}>
          <ImageIcon className="size-3.5 text-primary" />
        </ToolBtn>
        <ToolBtn label="Insert Table" active={editor.isActive("table")}
          onMouseDown={(e) => cmd(e, handleInsertTable)}>
          <TableIcon className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Horizontal Rule" active={false}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setHorizontalRule().run())}>
          <Minus className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Hard Break" active={false}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setHardBreak().run())}>
          <CornerDownLeft className="size-3.5" />
        </ToolBtn>

        {/* Table Controls — visible only when cursor is inside a table */}
        {editor.isActive("table") && (
          <>
            <Divider />
            {[
              { label: "+Col", fn: () => editor.chain().focus().addColumnBefore().run() },
              { label: "+Row", fn: () => editor.chain().focus().addRowAfter().run() },
              { label: "−Col", fn: () => editor.chain().focus().deleteColumn().run() },
              { label: "−Row", fn: () => editor.chain().focus().deleteRow().run() },
            ].map(({ label, fn }) => (
              <button
                key={label}
                type="button"
                onMouseDown={(e) => cmd(e, fn)}
                className="px-2 h-8 rounded-lg border border-divider bg-surface-secondary text-default-500 hover:text-foreground text-[11px] font-bold transition-all"
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onMouseDown={(e) => cmd(e, () => editor.chain().focus().deleteTable().run())}
              className="px-2 h-8 rounded-lg border border-divider bg-danger/10 text-danger hover:bg-danger/20 text-[11px] font-bold transition-all"
            >
              Del Table
            </button>
          </>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          FLOATING BUBBLE BAR — appears when text is selected.
          Driven by onSelectionUpdate (ProseMirror level), NOT by DOM
          selectionchange events which fire at the wrong time.
          All buttons use onMouseDown + e.preventDefault().
          ════════════════════════════════════════════════════════════════ */}
      {bubble.show && (
        <div
          style={{
            position: "fixed",
            top: `${bubble.top}px`,
            left: `${bubble.left}px`,
            transform: "translateX(-50%)",
            zIndex: 9999
          }}
          // IMPORTANT: onMouseDown on the container also prevents default
          // so clicking anywhere on the floating bar doesn't collapse selection
          onMouseDown={(e) => e.preventDefault()}
          className="flex items-center gap-0.5 bg-surface border border-divider rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${editor.isActive("bold") ? "bg-primary text-primary-foreground" : "hover:bg-surface-secondary text-foreground"}`}
          >B</button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
            className={`px-2.5 py-1.5 rounded-lg text-xs italic font-bold transition-all ${editor.isActive("italic") ? "bg-primary text-primary-foreground" : "hover:bg-surface-secondary text-foreground"}`}
          >I</button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
            className={`px-2.5 py-1.5 rounded-lg text-xs underline font-bold transition-all ${editor.isActive("underline") ? "bg-primary text-primary-foreground" : "hover:bg-surface-secondary text-foreground"}`}
          >U</button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHighlight().run() }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-surface-secondary text-foreground transition-all"
          ><Highlighter className="size-3.5" /></button>
          <div className="h-4 w-px bg-divider mx-0.5" />
          <button
            onMouseDown={(e) => {
              e.preventDefault()
              onAiAction?.("rewrite", bubble.selectedText)
              setBubble(prev => ({ ...prev, show: false }))
            }}
            className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-extrabold flex items-center gap-1 transition-all"
          ><Wand2 className="size-3" /> Rewrite</button>
          <button
            onMouseDown={(e) => {
              e.preventDefault()
              onAiAction?.("expand", bubble.selectedText)
              setBubble(prev => ({ ...prev, show: false }))
            }}
            className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-extrabold flex items-center gap-1 transition-all"
          ><Sparkles className="size-3" /> Expand</button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          EDITOR CANVAS — white paper on grey surface
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-10 flex justify-center bg-surface-secondary">
        <div className="w-full max-w-4xl bg-surface border border-divider rounded-3xl shadow-sm p-8 md:p-14 self-start min-h-[750px]">
          <EditorContent
            editor={editor}
            className="tiptap-editor w-full min-h-[600px]"
          />
        </div>
      </div>

    </div>
  )
}
