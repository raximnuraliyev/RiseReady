import React, { ReactNode } from 'react'
import AnimatedGradientText from '../AnimatedGradientText'

interface Props {
  title: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export default function DashboardShell({ title, subtitle, icon, actions, children }: Props) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
                {icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1F4E79]"><AnimatedGradientText>{title}</AnimatedGradientText></h1>
                {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <div>
              {actions}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
