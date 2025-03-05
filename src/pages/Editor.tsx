
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "@/contexts/PopupContext";
import AppLayout from "@/components/layout/AppLayout";

const Editor: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = usePopup();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn]);

    return <AppLayout />;
};

export default Editor;