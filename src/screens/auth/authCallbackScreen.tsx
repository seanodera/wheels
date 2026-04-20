import {useEffect, useState} from "react";
import {Alert, Button, Typography} from "antd";
import {Link, useNavigate, useSearchParams} from "react-router";
import AuthShell from "@/screens/auth/authShell.tsx";
import {autoLoginUser, useAppDispatch} from "@/store";

const {Title, Text} = Typography;

export default function AuthCallbackScreen() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuth = async () => {
            // Parse hash (tokens live here)
            const hash = window.location.hash.substring(1);
            const hashParams = new URLSearchParams(hash);

            const access_token = hashParams.get("access_token");
            const refresh_token = hashParams.get("refresh_token");

            // type can be in either
            const type =
                searchParams.get("type") || hashParams.get("type");

            try {
                if (!access_token || !refresh_token) {
                    throw new Error("Missing authentication tokens.");
                }

                await dispatch(autoLoginUser({access_token, refresh_token})).unwrap()

                // 🎯 Route based on type
                switch (type) {
                    case "recovery":
                        navigate("/reset-password", {replace: true});
                        break;

                    case "signup":
                        navigate("/onboarding", {replace: true});
                        break;

                    case "invite":
                        navigate("/accept-invite", {replace: true});
                        break;

                    case "email_change":
                        navigate("/profile", {replace: true});
                        break;

                    case "magiclink":
                    default:
                        navigate("/", {replace: true});
                        break;
                }
            } catch (err: any) {
                setError(err.message || "Authentication failed.");
            }
        };

        void handleAuth();
    }, [navigate, searchParams]);

    return (
        <AuthShell>
            <Title>Finishing sign in</Title>
            <Text>Confirming your secure session.</Text>
            {error && (
                <Alert
                    className="mt-4"
                    type="error"
                    message={error}
                    action={<Link to="/login"><Button size="small">Back to login</Button></Link>}
                />
            )}
        </AuthShell>
    );
}
