import {useState} from "react";
import {App, Button, Form, Input, Typography} from "antd";
import {Link} from "react-router";
import {supabase} from "@/utils";
import AuthShell from "@/screens/auth/authShell.tsx";

const {Title, Text} = Typography;

export default function MagicLinkScreen() {
    const {message} = App.useApp();
    const [loading, setLoading] = useState(false);

    const onFinish = async ({email}: {email: string}) => {
        setLoading(true);
        const {error} = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });
        setLoading(false);

        if (error) {
            message.error(error.message);
            return;
        }

        message.success("Magic link sent.");
    };

    return (
        <AuthShell>
            <Title>Magic link</Title>
            <Text>Get a one-time sign-in link in your email.</Text>
            <Form name="magic-link" onFinish={onFinish} layout="vertical" className="mt-4" size="large">
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{required: true, message: "Please input your email!"}, {type: "email", message: "Please enter a valid email!"}]}
                >
                    <Input placeholder="Enter your email"/>
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" className="w-full">
                        Send magic link
                    </Button>
                </Form.Item>
                <Form.Item className="flex justify-center text-center">
                    <Text><Link className="text-primary hover:underline" to="/login">Use password instead</Link></Text>
                </Form.Item>
            </Form>
        </AuthShell>
    );
}
