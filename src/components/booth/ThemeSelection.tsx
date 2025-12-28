import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { themes, themeCategories, Theme, ThemeCategory } from "@/data/themes";
import { cn } from "@/lib/utils";

interface ThemeSelectionProps {
  onSelect: (theme: Theme) => void;
  onBack: () => void;
}

export function ThemeSelection({ onSelect, onBack }: ThemeSelectionProps) {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>("events");

  const filteredThemes = themes.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Choose Your Style
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              Pick a theme for your transformation
            </p>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="px-4 py-4">
        <Tabs
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as ThemeCategory)}
          className="max-w-4xl mx-auto"
        >
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-muted h-auto p-1">
            {themeCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="font-body py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="mr-2">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {themeCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {themes
                  .filter((t) => t.category === cat.id)
                  .map((theme, index) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      onClick={() => onSelect(theme)}
                      delay={index * 0.05}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

interface ThemeCardProps {
  theme: Theme;
  onClick: () => void;
  delay: number;
}

function ThemeCard({ theme, onClick, delay }: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      className="theme-card text-left group animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Preview */}
      <div
        className={cn(
          "aspect-square rounded-xl mb-3 flex items-center justify-center text-5xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-105 overflow-hidden",
          theme.previewColor
        )}
      >
        <img src={theme.previewImage} alt={theme.name} className="w-full h-full object-cover" />
      </div>
      

      {/* Info */}
      <h3 className="font-display font-semibold text-foreground text-sm mb-1 line-clamp-1">
        {theme.name}
      </h3>
      <p className="font-body text-xs text-muted-foreground line-clamp-2">
        {theme.description}
      </p>
    </button>
  );
}
