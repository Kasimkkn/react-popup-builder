
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePopup } from "@/contexts/PopupContext";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = usePopup();
    const { toast } = useToast();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (username === "admin" && password === "admin") {
                toast({
                    title: "Login successful",
                    description: "Welcome to Popup Builder!",
                    variant: "default",
                });
                setIsLoggedIn(true);
                navigate("/dashboard");
            } else {
                toast({
                    title: "Login failed",
                    description: "Invalid credentials. Use admin/admin to login.",
                    variant: "destructive",
                });
            }

            setIsLoading(false);
        }, 1000);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Popup Builder</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>Demo credentials: username <strong>admin</strong>, password <strong>admin</strong></p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Log in"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;