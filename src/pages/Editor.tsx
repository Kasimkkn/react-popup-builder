
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "@/contexts/PopupContext";
import AppLayout from "@/components/layout/AppLayout";

const Editor: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = usePopup();

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    return <AppLayout />;
};

export default Editor;