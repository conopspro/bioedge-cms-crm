"use client"

import Link from "next/link"
import { Check, Pencil, UserPlus, Sparkles, Eye, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PipelineProps {
  campaignId: string
  campaignStatus: string
  hasSender: boolean
  hasName: boolean
  hasPurpose: boolean
  recipientCounts: {
    total: number
    pending: number
    generated: number
    approved: number
    sent: number
  }
  onGenerate: () => void
  generating: boolean
}

type StepStatus = "completed" | "current" | "upcoming"

interface WorkflowStep {
  label: string
  icon: React.ReactNode
  status: StepStatus
  detail: string
  action?: React.ReactNode
}

export function CampaignWorkflowPipeline({
  campaignId,
  campaignStatus,
  hasSender,
  hasName,
  hasPurpose,
  recipientCounts,
  onGenerate,
  generating,
}: PipelineProps) {
  const { total, pending, generated, approved, sent } = recipientCounts
  const configComplete = hasName && hasPurpose && hasSender

  // Determine step statuses
  const steps: WorkflowStep[] = [
    {
      label: "Configure",
      icon: <Pencil className="h-3.5 w-3.5" />,
      status: configComplete ? "completed" : "current",
      detail: configComplete ? "Done" : "Missing fields",
      action: (
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link href={`/dashboard/campaigns/${campaignId}/edit`}>Edit</Link>
        </Button>
      ),
    },
    {
      label: "Recipients",
      icon: <UserPlus className="h-3.5 w-3.5" />,
      status: total > 0
        ? "completed"
        : configComplete
          ? "current"
          : "upcoming",
      detail: total > 0 ? `${total} added` : "None yet",
      action: (
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link href={`/dashboard/campaigns/${campaignId}/recipients`}>
            {total > 0 ? "Add more" : "Add"}
          </Link>
        </Button>
      ),
    },
    {
      label: "Generate",
      icon: <Sparkles className="h-3.5 w-3.5" />,
      status:
        campaignStatus === "generating"
          ? "current"
          : pending === 0 && (generated + approved + sent) > 0
            ? "completed"
            : pending > 0
              ? "current"
              : "upcoming",
      detail:
        campaignStatus === "generating"
          ? "In progress..."
          : pending > 0
            ? `${pending} pending`
            : (generated + approved + sent) > 0
              ? "Done"
              : "--",
      action:
        pending > 0 && campaignStatus !== "generating" ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onGenerate}
            disabled={generating}
          >
            {generating ? "..." : `Generate (${pending})`}
          </Button>
        ) : undefined,
    },
    {
      label: "Review",
      icon: <Eye className="h-3.5 w-3.5" />,
      status:
        generated === 0 && (approved + sent) > 0
          ? "completed"
          : generated > 0
            ? "current"
            : "upcoming",
      detail:
        generated > 0
          ? `${generated} to review`
          : (approved + sent) > 0
            ? "Done"
            : "--",
      action:
        generated > 0 ? (
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <Link href={`/dashboard/campaigns/${campaignId}/review`}>
              Review ({generated})
            </Link>
          </Button>
        ) : undefined,
    },
    {
      label: "Send",
      icon: <Send className="h-3.5 w-3.5" />,
      status:
        campaignStatus === "completed"
          ? "completed"
          : ["ready", "sending"].includes(campaignStatus)
            ? "current"
            : "upcoming",
      detail:
        sent > 0
          ? `${sent}/${total} sent`
          : campaignStatus === "completed"
            ? "Complete"
            : "--",
    },
  ]

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start flex-1">
            {/* Step circle + content */}
            <div className="flex flex-col items-center text-center flex-1 min-w-0">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                  ${step.status === "completed"
                    ? "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400"
                    : step.status === "current"
                      ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20"
                      : "bg-muted border-muted-foreground/20 text-muted-foreground/40"
                  }
                `}
              >
                {step.status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="mt-1.5">
                <div
                  className={`text-xs font-medium ${
                    step.status === "upcoming"
                      ? "text-muted-foreground/50"
                      : "text-foreground"
                  }`}
                >
                  {step.label}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    step.status === "current"
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.detail}
                </div>
              </div>
              {step.action && step.status !== "upcoming" && (
                <div className="mt-1">{step.action}</div>
              )}
            </div>

            {/* Connector line (not after last step) */}
            {i < steps.length - 1 && (
              <div className="flex items-center pt-4 px-1 flex-shrink-0">
                <div
                  className={`h-0.5 w-6 ${
                    steps[i + 1].status !== "upcoming"
                      ? "bg-green-400 dark:bg-green-600"
                      : "bg-muted-foreground/15"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
