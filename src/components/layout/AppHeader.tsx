
import React from "react";
import {
  ChevronDown,
  FileCode,
  Eye,
  EyeOff,
  Save,
  Plus,
  Download,
  Moon,
  Sun,
  Laptop
} from "lucide-react";
import { usePopup } from "@/contexts/PopupContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generatePopupCode } from "@/utils/code-generator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

const AppHeader: React.FC = () => {
  const {
    currentTemplate,
    templates,
    saveCurrentTemplate,
    createTemplate,
    loadTemplate,
    isPreviewVisible,
    togglePreview,
    isCodeVisible,
    toggleCodeView
  } = usePopup();

  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const exportCode = async () => {
    const code = await generatePopupCode(currentTemplate);
    navigator.clipboard.writeText(code);

    toast({
      title: "Code copied to clipboard",
      description: "You can now paste the code into your website",
      variant: "default"
    });
  };

  return (
    <header className="border-b border-border flex justify-between items-center py-3 px-4 bg-background h-14">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold mr-4">Popup Builder</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
              {currentTemplate.name || "Select Template"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {templates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => loadTemplate(template.id)}
                className={`${template.id === currentTemplate.id ? 'bg-muted' : ''}`}
              >
                {template.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={createTemplate} className="border-t mt-1 pt-1">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {theme === 'dark' ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : theme === 'light' ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Laptop className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={togglePreview}
          className="flex items-center gap-1"
        >
          {isPreviewVisible ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span className="hidden sm:inline">Hide Preview</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Show Preview</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleCodeView}
          className="flex items-center gap-1"
        >
          <FileCode className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isCodeVisible ? "Hide Code" : "View Code"}
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={exportCode}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export Code</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={saveCurrentTemplate}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
