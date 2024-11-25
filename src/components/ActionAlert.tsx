'use client'

import { toast } from 'sonner'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useEffect } from 'react'

interface ActionAlertProps {
  state: { message?: string; error?: string } | null
}

export default function ActionAlert({ state }: ActionAlertProps) {
  useEffect(() => {
    if (!state) return

    // Dismiss all existing toasts before showing a new one
    toast.dismiss()

    if (state.message) {
      toast.success(state.message, {
        icon: <CheckCircle2 className="h-4 w-4" />,
        action: {
          label: "Dismiss",
          onClick: () => toast.dismiss(),
        },
      })
    }

    if (state.error) {
      toast.error(state.error, {
        icon: <AlertCircle className="h-4 w-4" />,
        action: {
          label: "Dismiss",
          onClick: () => toast.dismiss(),
        },
      })
    }
  }, [state])

  return null
}