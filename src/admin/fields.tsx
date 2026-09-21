import * as React from "react"
import { GripVertical, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

let fieldId = 0
function useFieldId(prefix: string) {
  return React.useMemo(() => `${prefix}-${++fieldId}`, [prefix])
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  className?: string
  type?: string
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  className,
  type = "text",
}: TextFieldProps) {
  const id = useFieldId("field")
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

interface AreaFieldProps extends Omit<TextFieldProps, "type"> {
  rows?: number
}

export function AreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  className,
  rows = 4,
}: AreaFieldProps) {
  const id = useFieldId("area")
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

interface ListFieldProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  /** Multi-line entries (paragraphs, bullet copy) get a textarea. */
  multiline?: boolean
  addLabel?: string
}

/** An editable array of strings — paragraphs, bullets, tech tags. */
export function ListField({
  label,
  values,
  onChange,
  placeholder,
  multiline = false,
  addLabel = "Add item",
}: ListFieldProps) {
  const update = (index: number, next: string) =>
    onChange(values.map((value, i) => (i === index ? next : value)))

  const remove = (index: number) => onChange(values.filter((_, i) => i !== index))

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= values.length) return
    const next = [...values]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <ul className="space-y-2">
        {values.map((value, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="flex flex-col pt-1.5">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="text-muted-foreground/60 transition-colors hover:text-foreground disabled:opacity-30"
                aria-label="Move up"
              >
                <GripVertical className="size-4" />
              </button>
            </div>
            {multiline ? (
              <Textarea
                rows={3}
                value={value}
                placeholder={placeholder}
                onChange={(event) => update(index, event.target.value)}
              />
            ) : (
              <Input
                value={value}
                placeholder={placeholder}
                onChange={(event) => update(index, event.target.value)}
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => remove(index)}
              aria-label={`Remove ${label} entry`}
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}>
        <Plus />
        {addLabel}
      </Button>
    </div>
  )
}

/** A bordered card wrapping one repeatable record, with a delete control. */
export function RecordCard({
  title,
  onDelete,
  children,
}: {
  title: string
  onDelete: () => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card/60 p-5">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 />
          Delete
        </Button>
      </div>
      {children}
    </div>
  )
}
