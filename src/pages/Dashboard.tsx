
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "@/contexts/PopupContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Copy } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import HelpPopup from "@/components/help/HelpPopup";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const {
        templates,
        isLoggedIn,
        createTemplate,
        loadTemplate,
        removeTemplate,
        cloneTemplate
    } = usePopup();

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const handleCreateTemplate = () => {
        createTemplate();
        navigate("/editor");
    };

    const handleEditTemplate = (templateId: string) => {
        loadTemplate(templateId);
        navigate("/editor");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Popup Builder</h1>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleCreateTemplate} className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            New Template
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto py-10 px-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Your Templates</h2>
                    </div>

                    {templates.length === 0 ? (
                        <div className="text-center p-12 border rounded-lg bg-muted/30">
                            <h3 className="text-xl font-medium mb-4">No templates yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Create your first popup template to get started
                            </p>
                            <Button onClick={handleCreateTemplate} size="lg" className="gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Create Template
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <Card key={template.id} className="group relative">
                                    <CardHeader className="pb-0">
                                        <CardTitle className="truncate">{template.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="min-h-[120px] flex items-center justify-center p-6">
                                        <div
                                            className="w-full h-[120px] bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center"
                                            style={{
                                                backgroundColor: template.popupStyles.background,
                                                border: template.popupStyles.border,
                                                borderRadius: template.popupStyles.borderRadius,
                                            }}
                                        >
                                            <span className="text-sm opacity-50">Preview</span>
                                        </div>
                                    </CardContent>
                                    <div className="absolute top-0 right-0 p-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 bg-white/20 backdrop-blur text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                cloneTemplate(template.id);
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            className="flex-1 mr-2"
                                            onClick={() => handleEditTemplate(template.id)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" className="h-9 w-9">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete "{template.name}"? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => removeTemplate(template.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <HelpPopup />
        </div>
    );
};

export default Dashboard;