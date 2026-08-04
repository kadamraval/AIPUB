"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { Node } from "@tiptap/core"
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
import { useState, useEffect } from "react"

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  Undo, Redo, Highlighter, Type, ListChecks,
  Wand2, Sparkles, Minus, ChevronDown, LayoutGrid, Trash2, Plus
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

// ─────────────────────────────────────────────────────────────────────────────
// BULLETPROOF NATIVE TIPTAP EXTENSIONS: GridColumn & GridBlock
// Uses inline styles on renderHTML to guarantee side-by-side flex layout
// ─────────────────────────────────────────────────────────────────────────────
const GridColumn = Node.create({
  name: "gridColumn",
  content: "block+",
  isolating: true,
  parseHTML() {
    return [
      { tag: 'div[data-type="grid-column"]' }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        ...HTMLAttributes,
        "data-type": "grid-column",
        style: "flex: 1 1 0% !important; width: 0 !important; min-width: 0 !important; padding: 1.25rem !important; border-radius: 0.875rem !important; border: 1.5px dashed var(--border) !important; background-color: var(--surface) !important; box-sizing: border-box !important;"
      },
      0
    ]
  }
})

const GridBlock = Node.create({
  name: "gridBlock",
  group: "block",
  content: "gridColumn+",
  isolating: true,
  parseHTML() {
    return [
      { tag: 'div[data-type="grid-block"]' }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        ...HTMLAttributes,
        "data-type": "grid-block",
        style: "display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: stretch !important; gap: 1.5rem !important; width: 100% !important; margin: 1.5rem 0 !important; box-sizing: border-box !important;"
      },
      0
    ]
  }
})

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  onWordCountChange?: (words: number, chars: number) => void
  onAiAction?: (action: string, selectedText: string) => void
}

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
        ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
        : "border-divider bg-surface-secondary text-default-500 hover:text-foreground hover:bg-surface hover:border-default-300"
      }`}
  >
    {children}
  </button>
)

const cmd = (e: React.MouseEvent<HTMLElement>, fn: () => void) => {
  e.preventDefault()
  fn()
}

const Divider = () => <div className="h-4 w-px bg-divider mx-1.5 shrink-0" />

export function TiptapEditor({ content, onChange, onWordCountChange, onAiAction }: TiptapEditorProps) {
  const [bubble, setBubble] = useState<{
    show: boolean
    top: number
    left: number
    selectedText: string
  }>({ show: false, top: 0, left: 0, selectedText: "" })

  const [gridMenu, setGridMenu] = useState<{
    show: boolean
    top: number
    left: number
    pos: number
    colPos: number
  }>({ show: false, top: 0, left: 0, pos: 0, colPos: 0 })

  const [headingOpen, setHeadingOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [alignOpen, setAlignOpen] = useState(false)

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
      GridBlock,
      GridColumn,
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
        placeholder: "Start typing your article here..."
      }),
      CharacterCount
    ],
    content,
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "tiptap ProseMirror focus:outline-none min-h-[550px] text-foreground select-text cursor-text leading-relaxed",
      },
    },

    onSelectionUpdate({ editor }) {
      const { from, to } = editor.state.selection
      
      // GRID MENU LOGIC
      if (editor.isActive("gridBlock") || editor.isActive("gridColumn")) {
        let gridPos = -1
        let colPos = -1
        const $pos = editor.state.selection.$from
        for (let d = $pos.depth; d > 0; d--) {
          if ($pos.node(d).type.name === 'gridColumn' && colPos === -1) {
            colPos = $pos.before(d)
          }
          if ($pos.node(d).type.name === 'gridBlock' && gridPos === -1) {
            gridPos = $pos.before(d)
          }
        }
        
        if (gridPos !== -1) {
          const dom = editor.view.nodeDOM(gridPos) as HTMLElement
          if (dom && dom.getBoundingClientRect) {
            const rect = dom.getBoundingClientRect()
            setGridMenu({
              show: true,
              top: rect.top - 48,
              left: rect.left + rect.width / 2,
              pos: gridPos,
              colPos: colPos !== -1 ? colPos : gridPos
            })
          }
        }
      } else {
        setGridMenu(prev => ({ ...prev, show: false }))
      }

      // TEXT BUBBLE LOGIC
      const text = editor.state.doc.textBetween(from, to, " ").trim()
      if (from === to || !text) {
        setBubble(prev => ({ ...prev, show: false }))
        return
      }
      const domSelection = window.getSelection()
      if (!domSelection || domSelection.isCollapsed || !domSelection.toString().trim()) {
        setBubble(prev => ({ ...prev, show: false }))
        return
      }
      const range = domSelection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        setBubble(prev => ({ ...prev, show: false }))
        return
      }
      setBubble({
        show: true,
        top: Math.max(10, rect.top - 52),
        left: rect.left + rect.width / 2,
        selectedText: text
      })
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML())
      const words = editor.storage.characterCount.words()
      const chars = editor.storage.characterCount.characters()
      onWordCountChange?.(words, chars)
    }
  })

  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [editor, content])

  if (!editor) return null

  const getCurrentHeadingLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1"
    if (editor.isActive("heading", { level: 2 })) return "Heading 2"
    if (editor.isActive("heading", { level: 3 })) return "Heading 3"
    if (editor.isActive("heading", { level: 4 })) return "Heading 4"
    if (editor.isActive("blockquote")) return "Quote"
    if (editor.isActive("codeBlock")) return "Code Block"
    return "Paragraph"
  }

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

  // Insert EXACTLY 2 side-by-side columns by default on single Grid click
  const handleInsertDefaultGrid = () => {
    if (editor.isActive("gridBlock") || editor.isActive("gridColumn")) return
    editor.chain().focus().insertContent({
      type: 'gridBlock',
      content: [
        { type: 'gridColumn', content: [{ type: 'paragraph' }] },
        { type: 'gridColumn', content: [{ type: 'paragraph' }] }
      ]
    }).run()
  }

  const closeAllDropdowns = () => {
    setHeadingOpen(false)
    setListOpen(false)
    setAlignOpen(false)
  }

  return (
    <div className="flex flex-col h-full relative">

      {/* ════════════════════════════════════════════════════════════════
          CLEAN, UNCLUTTERED, INDUSTRY-STANDARD TOOLBAR (LUCIDE ICONS ONLY)
          ════════════════════════════════════════════════════════════════ */}
      <div className="border-b border-divider bg-surface px-4 py-2 flex items-center flex-wrap gap-1.5 shrink-0 select-none">

        {/* 1. History Group */}
        <ToolBtn label="Undo" active={false}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().undo().run())}>
          <Undo className="size-3.5" />
        </ToolBtn>
        <ToolBtn label="Redo" active={false}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().redo().run())}>
          <Redo className="size-3.5" />
        </ToolBtn>

        <Divider />

        {/* 2. Block Style Selector */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); const next = !headingOpen; closeAllDropdowns(); setHeadingOpen(next); }}
            className="h-8 px-3 rounded-lg border border-divider bg-surface-secondary text-xs font-bold text-foreground flex items-center gap-1.5 hover:bg-surface transition-all"
          >
            <span>{getCurrentHeadingLabel()}</span>
            <ChevronDown className="size-3 text-default-400" />
          </button>

          {headingOpen && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 top-10 z-50 bg-surface border border-divider rounded-xl shadow-xl p-1 w-44 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
            >
              {[
                { label: "Paragraph", action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
                { label: "Heading 1 (H1)", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
                { label: "Heading 2 (H2)", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
                { label: "Heading 3 (H3)", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
                { label: "Quote Block", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
                { label: "Code Block", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    opt.action()
                    setHeadingOpen(false)
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    opt.active ? "bg-primary text-primary-foreground font-bold" : "hover:bg-surface-secondary text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* 3. Text Formatting Group */}
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

        <Divider />

        {/* 4. Lists Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); const next = !listOpen; closeAllDropdowns(); setListOpen(next); }}
            className={`h-8 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
              editor.isActive("bulletList") || editor.isActive("orderedList") || editor.isActive("taskList")
                ? "bg-primary text-primary-foreground border-primary"
                : "border-divider bg-surface-secondary text-default-500 hover:text-foreground"
            }`}
          >
            <List className="size-3.5" />
            <ChevronDown className="size-3 opacity-60" />
          </button>

          {listOpen && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 top-10 z-50 bg-surface border border-divider rounded-xl shadow-xl p-1 w-40 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); setListOpen(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  editor.isActive("bulletList") ? "bg-primary text-primary-foreground font-bold" : "hover:bg-surface-secondary text-foreground"
                }`}
              >
                <List className="size-3.5" /> Bullet List
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); setListOpen(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  editor.isActive("orderedList") ? "bg-primary text-primary-foreground font-bold" : "hover:bg-surface-secondary text-foreground"
                }`}
              >
                <ListOrdered className="size-3.5" /> Numbered List
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleTaskList().run(); setListOpen(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  editor.isActive("taskList") ? "bg-primary text-primary-foreground font-bold" : "hover:bg-surface-secondary text-foreground"
                }`}
              >
                <ListChecks className="size-3.5" /> Check List
              </button>
            </div>
          )}
        </div>

        {/* 5. Alignment Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); const next = !alignOpen; closeAllDropdowns(); setAlignOpen(next); }}
            className="h-8 px-2.5 rounded-lg border border-divider bg-surface-secondary text-default-500 hover:text-foreground text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <AlignLeft className="size-3.5" />
            <ChevronDown className="size-3 opacity-60" />
          </button>

          {alignOpen && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 top-10 z-50 bg-surface border border-divider rounded-xl shadow-xl p-1 w-36 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
            >
              {[
                { label: "Left", icon: AlignLeft, action: () => editor.chain().focus().setTextAlign("left").run() },
                { label: "Center", icon: AlignCenter, action: () => editor.chain().focus().setTextAlign("center").run() },
                { label: "Right", icon: AlignRight, action: () => editor.chain().focus().setTextAlign("right").run() },
                { label: "Justify", icon: AlignJustify, action: () => editor.chain().focus().setTextAlign("justify").run() },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    opt.action()
                    setAlignOpen(false)
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-surface-secondary text-foreground flex items-center gap-2 transition-colors"
                >
                  <opt.icon className="size-3.5" /> {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* 6. Media & Structure Inserts */}
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

        {/* 7. Clean Single-Click Grid Button */}
        <ToolBtn
          label="Insert Grid"
          active={editor.isActive("gridBlock") || editor.isActive("gridColumn")}
          onMouseDown={(e) => cmd(e, handleInsertDefaultGrid)}
        >
          <LayoutGrid className="size-3.5 text-primary" />
        </ToolBtn>

        <ToolBtn label="Horizontal Rule" active={false}
          onMouseDown={(e) => cmd(e, () => editor.chain().focus().setHorizontalRule().run())}>
          <Minus className="size-3.5" />
        </ToolBtn>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          FLOATING BUBBLE BAR ON TEXT SELECTION
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
          onMouseDown={(e) => e.preventDefault()}
          className="flex items-center gap-1 bg-surface border border-divider rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
        >
          <button
            type="button"
            onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleBold().run())}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${editor.isActive("bold") ? "bg-primary text-primary-foreground" : "hover:bg-surface-secondary"}`}
          >B</button>
          <button
            type="button"
            onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleItalic().run())}
            className={`px-2.5 py-1.5 rounded-lg text-xs italic font-extrabold transition-all ${editor.isActive("italic") ? "bg-primary text-primary-foreground" : "hover:bg-surface-secondary"}`}
          >I</button>
          <button
            type="button"
            onMouseDown={(e) => cmd(e, () => editor.chain().focus().toggleUnderline().run())}
            className={`px-2.5 py-1.5 rounded-lg text-xs underline font-extrabold transition-all ${editor.isActive("underline") ? "bg-primary text-primary-foreground" : "hover:bg-surface-secondary"}`}
          >U</button>

          <div className="h-4 w-px bg-divider mx-0.5" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              onAiAction?.("rewrite", bubble.selectedText)
              setBubble(prev => ({ ...prev, show: false }))
            }}
            className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-extrabold flex items-center gap-1 transition-all"
          ><Wand2 className="size-3" /> Rewrite</button>
          <button
            type="button"
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
          FLOATING GRID MENU ON GRID SELECTION
          ════════════════════════════════════════════════════════════════ */}
      {gridMenu.show && (
        <div
          style={{
            position: "fixed",
            top: `${gridMenu.top}px`,
            left: `${gridMenu.left}px`,
            transform: "translateX(-50%)",
            zIndex: 9999
          }}
          onMouseDown={(e) => e.preventDefault()}
          className="flex items-center gap-1 bg-surface border border-divider shadow-md rounded-xl p-1 animate-in fade-in zoom-in-95 duration-100 select-none"
        >
          <button
            type="button"
            onMouseDown={(e) => cmd(e, () => {
              // Add new column right after the currently active column (or at end of grid)
              const colNode = editor.state.doc.nodeAt(gridMenu.colPos)
              const targetPos = (colNode && gridMenu.colPos > 0) 
                ? gridMenu.colPos + colNode.nodeSize 
                : gridMenu.pos + (editor.state.doc.nodeAt(gridMenu.pos)?.nodeSize || 1) - 1
              
              editor.chain().focus().insertContentAt(targetPos, { 
                type: 'gridColumn', 
                content: [{ type: 'paragraph' }] 
              }).run()
            })}
            className="px-2 py-1.5 rounded-lg text-xs font-extrabold hover:bg-surface-secondary transition-all"
            title="Add Column to Right"
          >
            <Plus className="size-4 text-primary" />
          </button>
          <div className="h-4 w-px bg-divider mx-0.5" />
          <button
            type="button"
            onMouseDown={(e) => cmd(e, () => {
              const gridNode = editor.state.doc.nodeAt(gridMenu.pos)
              const colNode = editor.state.doc.nodeAt(gridMenu.colPos)
              
              // If grid has > 1 column and a specific column is focused, delete only that column
              if (gridNode && gridNode.childCount > 1 && colNode && gridMenu.colPos > 0) {
                editor.chain().focus().deleteRange({ from: gridMenu.colPos, to: gridMenu.colPos + colNode.nodeSize }).run()
              } else if (gridNode) {
                // Otherwise delete the entire grid
                editor.chain().focus().deleteRange({ from: gridMenu.pos, to: gridMenu.pos + gridNode.nodeSize }).run()
              }
            })}
            className="px-2 py-1.5 rounded-lg text-xs font-extrabold hover:bg-danger/10 transition-all"
            title="Delete Focused Column / Grid"
          >
            <Trash2 className="size-4 text-danger" />
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          EDITOR CANVAS
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-10 flex justify-center bg-surface-secondary">
        <div className="w-full max-w-4xl bg-surface border border-divider rounded-3xl shadow-sm p-8 md:p-14 self-start min-h-[750px] tiptap-editor">
          <EditorContent
            editor={editor}
          />
        </div>
      </div>

    </div>
  )
}
