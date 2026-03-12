import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FeedTabs({ activeTab, onTabChange, isDark, onToggleTheme }) {
  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center">
        {/* Tabs */}
        <div className="flex flex-1">
          {['For You', 'Following'].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                'flex-1 py-5 text-base font-medium transition-colors relative',
                'hover:bg-accent/50',
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
