import React, { useState, useEffect } from "react";
import { CopyIcon, CheckIcon, Code2, FileJson, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePopup } from "@/contexts/PopupContext";
import { generatePopupCode } from "@/utils/code-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CodeView: React.FC = () => {
  const { currentTemplate } = usePopup();
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopupCode = async () => {
      try {
        setIsLoading(true);
        const generatedCode = await generatePopupCode(currentTemplate);
        setCode(generatedCode);
      } catch (error) {
        console.error('Error generating popup code:', error);
        setCode('Error generating popup code');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopupCode();
  }, [currentTemplate]);

  const jsonTemplate = JSON.stringify(currentTemplate, null, 2);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtmlFile = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${currentTemplate.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Show toast notification
    const event = new CustomEvent('toast', {
      detail: {
        title: 'File downloaded',
        description: `HTML file has been downloaded successfully`
      }
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="bg-background rounded-lg overflow-hidden w-full h-full flex flex-col">
      <Tabs defaultValue="html" className="flex flex-col h-full">
        <div className="flex justify-between items-center p-2 border-b">
          <TabsList>
            <TabsTrigger value="html" className="flex items-center gap-1">
              <Code2 className="h-4 w-4" />
              <span>HTML & JavaScript</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-1">
              <FileJson className="h-4 w-4" />
              <span>JSON Template</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              onClick={() => copyToClipboard(code)}
              disabled={isLoading}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
              <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2"
              onClick={downloadHtmlFile}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-1" />
              Export HTML
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="html" className="mt-0 h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Generating popup code...</p>
              </div>
            ) : (
              <pre className="code-block text-xs h-full p-4 overflow-auto font-mono">
                {code}
              </pre>
            )}
          </TabsContent>

          <TabsContent value="json" className="mt-0 h-full">
            <pre className="code-block text-xs h-full p-4 overflow-auto font-mono">
              {jsonTemplate}
            </pre>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CodeView;