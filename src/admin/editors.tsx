import { Plus } from "lucide-react"

import { AreaField, ListField, RecordCard, TextField } from "@/admin/fields"
import { Button } from "@/components/ui/button"
import type {
  Education,
  Experience,
  Profile,
  Project,
  SkillGroup,
  SocialLink,
} from "@/lib/types"

/** Stable ids for new records — readable in the Firestore console. */
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`

const nextOrder = (items: Array<{ order: number }>) =>
  items.reduce((max, item) => Math.max(max, item.order), 0) + 1

export function ProfileEditor({
  value,
  onChange,
}: {
  value: Profile
  onChange: (profile: Profile) => void
}) {
  const set = <K extends keyof Profile>(key: K, next: Profile[K]) =>
    onChange({ ...value, [key]: next })

  const setSocial = (index: number, patch: Partial<SocialLink>) =>
    set(
      "socials",
      value.socials.map((social, i) => (i === index ? { ...social, ...patch } : social))
    )

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={value.name} onChange={(v) => set("name", v)} />
        <TextField label="Role" value={value.role} onChange={(v) => set("role", v)} />
        <TextField label="Location" value={value.location} onChange={(v) => set("location", v)} />
        <TextField
          label="Availability"
          value={value.availability}
          onChange={(v) => set("availability", v)}
          hint="The small pill above the name."
        />
        <TextField label="Email" type="email" value={value.email} onChange={(v) => set("email", v)} />
        <TextField
          label="Phone"
          value={value.phone}
          onChange={(v) => set("phone", v)}
          hint="Stored but not shown on the site — add a phone social link to publish it."
        />
        <TextField
          label="Résumé URL"
          value={value.resumeUrl}
          onChange={(v) => set("resumeUrl", v)}
          hint="A path in /public, or any public link."
        />
        <TextField
          label="Career start"
          value={value.careerStart}
          onChange={(v) => set("careerStart", v)}
          hint="YYYY-MM — drives the years-of-experience count."
        />
      </div>

      <AreaField
        label="Tagline"
        value={value.tagline}
        onChange={(v) => set("tagline", v)}
        rows={3}
        hint="The paragraph under the hero headline."
      />

      <ListField
        label="About paragraphs"
        values={value.about}
        onChange={(v) => set("about", v)}
        multiline
        addLabel="Add paragraph"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Hero stats</p>
        <div className="space-y-3">
          {value.stats.map((stat, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)_auto]">
              <TextField
                label="Value"
                value={stat.value}
                onChange={(v) =>
                  set(
                    "stats",
                    value.stats.map((s, i) => (i === index ? { ...s, value: v } : s))
                  )
                }
              />
              <TextField
                label="Label"
                value={stat.label}
                onChange={(v) =>
                  set(
                    "stats",
                    value.stats.map((s, i) => (i === index ? { ...s, label: v } : s))
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="self-end text-muted-foreground hover:text-destructive"
                onClick={() => set("stats", value.stats.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => set("stats", [...value.stats, { value: "", label: "" }])}
        >
          <Plus />
          Add stat
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Social links</p>
        <div className="space-y-3">
          {value.socials.map((social, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)_8rem_auto]">
              <TextField
                label="Label"
                value={social.label}
                onChange={(v) => setSocial(index, { label: v })}
              />
              <TextField
                label="URL"
                value={social.url}
                onChange={(v) => setSocial(index, { url: v })}
              />
              <TextField
                label="Icon"
                value={social.icon}
                onChange={(v) => setSocial(index, { icon: v as SocialLink["icon"] })}
                hint="github · linkedin · mail · phone · globe · twitter"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="self-start text-muted-foreground hover:text-destructive sm:mt-7"
                onClick={() => set("socials", value.socials.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            set("socials", [...value.socials, { label: "", url: "", icon: "globe" }])
          }
        >
          <Plus />
          Add link
        </Button>
      </div>
    </div>
  )
}

export function ExperienceEditor({
  items,
  onChange,
}: {
  items: Experience[]
  onChange: (items: Experience[]) => void
}) {
  const patch = (index: number, next: Partial<Experience>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...next } : item)))

  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <RecordCard
          key={item.id}
          title={item.company || `Role ${index + 1}`}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Role" value={item.role} onChange={(v) => patch(index, { role: v })} />
            <TextField
              label="Company"
              value={item.company}
              onChange={(v) => patch(index, { company: v })}
            />
            <TextField
              label="Location"
              value={item.location}
              onChange={(v) => patch(index, { location: v })}
            />
            <TextField
              label="Order"
              value={String(item.order)}
              onChange={(v) => patch(index, { order: Number(v) || 0 })}
            />
            <TextField
              label="Start"
              value={item.start}
              onChange={(v) => patch(index, { start: v })}
              hint="YYYY-MM"
            />
            <TextField
              label="End"
              value={item.end}
              onChange={(v) => patch(index, { end: v })}
              hint="YYYY-MM, or empty for current"
            />
          </div>
          <AreaField
            label="Summary"
            value={item.summary}
            onChange={(v) => patch(index, { summary: v })}
          />
          <ListField
            label="Highlights"
            values={item.highlights}
            onChange={(v) => patch(index, { highlights: v })}
            multiline
            addLabel="Add highlight"
          />
        </RecordCard>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId("role"),
              order: nextOrder(items),
              role: "",
              company: "",
              location: "",
              start: "",
              end: "",
              summary: "",
              highlights: [],
            },
          ])
        }
      >
        <Plus />
        Add role
      </Button>
    </div>
  )
}

export function ProjectsEditor({
  items,
  onChange,
}: {
  items: Project[]
  onChange: (items: Project[]) => void
}) {
  const patch = (index: number, next: Partial<Project>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...next } : item)))

  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <RecordCard
          key={item.id}
          title={item.name || `Project ${index + 1}`}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" value={item.name} onChange={(v) => patch(index, { name: v })} />
            <TextField
              label="Organisation"
              value={item.org}
              onChange={(v) => patch(index, { org: v })}
            />
            <TextField label="URL" value={item.url} onChange={(v) => patch(index, { url: v })} />
            <TextField
              label="Period"
              value={item.period}
              onChange={(v) => patch(index, { period: v })}
            />
            <TextField
              label="Order"
              value={String(item.order)}
              onChange={(v) => patch(index, { order: Number(v) || 0 })}
            />
          </div>
          <AreaField
            label="Summary"
            value={item.summary}
            onChange={(v) => patch(index, { summary: v })}
          />
          <ListField
            label="Stack"
            values={item.stack}
            onChange={(v) => patch(index, { stack: v })}
            placeholder="Vue.js"
            addLabel="Add technology"
          />

          <div className="space-y-3">
            <p className="text-sm font-medium">Modules</p>
            {item.modules.map((module, moduleIndex) => (
              <div
                key={moduleIndex}
                className="space-y-3 rounded-md border border-border/70 bg-background p-4"
              >
                <div className="flex items-end gap-3">
                  <TextField
                    label="Module name"
                    className="flex-1"
                    value={module.name}
                    onChange={(v) =>
                      patch(index, {
                        modules: item.modules.map((m, i) =>
                          i === moduleIndex ? { ...m, name: v } : m
                        ),
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      patch(index, {
                        modules: item.modules.filter((_, i) => i !== moduleIndex),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
                <ListField
                  label="Points"
                  values={module.points}
                  multiline
                  onChange={(v) =>
                    patch(index, {
                      modules: item.modules.map((m, i) =>
                        i === moduleIndex ? { ...m, points: v } : m
                      ),
                    })
                  }
                  addLabel="Add point"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                patch(index, { modules: [...item.modules, { name: "", points: [] }] })
              }
            >
              <Plus />
              Add module
            </Button>
          </div>
        </RecordCard>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId("project"),
              order: nextOrder(items),
              name: "",
              org: "",
              url: "",
              period: "",
              summary: "",
              stack: [],
              modules: [],
              featured: true,
            },
          ])
        }
      >
        <Plus />
        Add project
      </Button>
    </div>
  )
}

export function SkillsEditor({
  items,
  onChange,
}: {
  items: SkillGroup[]
  onChange: (items: SkillGroup[]) => void
}) {
  const patch = (index: number, next: Partial<SkillGroup>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...next } : item)))

  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <RecordCard
          key={item.id}
          title={item.category || `Group ${index + 1}`}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
            <TextField
              label="Category"
              value={item.category}
              onChange={(v) => patch(index, { category: v })}
            />
            <TextField
              label="Order"
              value={String(item.order)}
              onChange={(v) => patch(index, { order: Number(v) || 0 })}
            />
          </div>
          <ListField
            label="Skills"
            values={item.items}
            onChange={(v) => patch(index, { items: v })}
            addLabel="Add skill"
          />
        </RecordCard>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            { id: newId("skills"), order: nextOrder(items), category: "", items: [] },
          ])
        }
      >
        <Plus />
        Add group
      </Button>
    </div>
  )
}

export function EducationEditor({
  items,
  onChange,
}: {
  items: Education[]
  onChange: (items: Education[]) => void
}) {
  const patch = (index: number, next: Partial<Education>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...next } : item)))

  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <RecordCard
          key={item.id}
          title={item.qualification || `Entry ${index + 1}`}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Qualification"
              className="sm:col-span-2"
              value={item.qualification}
              onChange={(v) => patch(index, { qualification: v })}
            />
            <TextField
              label="Institution"
              value={item.institution}
              onChange={(v) => patch(index, { institution: v })}
            />
            <TextField
              label="Detail"
              value={item.detail}
              onChange={(v) => patch(index, { detail: v })}
            />
            <TextField
              label="Grade"
              value={item.grade}
              onChange={(v) => patch(index, { grade: v })}
            />
            <TextField
              label="Order"
              value={String(item.order)}
              onChange={(v) => patch(index, { order: Number(v) || 0 })}
            />
          </div>
        </RecordCard>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId("education"),
              order: nextOrder(items),
              qualification: "",
              institution: "",
              detail: "",
              period: "",
              grade: "",
            },
          ])
        }
      >
        <Plus />
        Add entry
      </Button>
    </div>
  )
}
