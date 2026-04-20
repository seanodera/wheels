import {useState} from "react";
import {App, Button, Form, Input, Typography} from "antd";
import {Link, useNavigate, useSearchParams} from "react-router";
import {supabase} from "@/utils";
import AuthShell from "@/screens/auth/authShell.tsx";

const {Title, Text} = Typography;

export default function VerifyEmailScreen() {
    const {message} = App.useApp();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const initialEmail = searchParams.get("email") ?? "";

    const onFinish = async ({email, token}: {email: string; token: string}) => {
        setLoading(true);
        const {error} = await supabase.auth.verifyOtp({
            email,
            token,
            type: "signup"
        });
        setLoading(false);

        if (error) {
            message.error(error.message);
            return;
        }

        message.success("Email verified.");
        navigate("/login", {replace: true});
    };

    const resend = async () => {
        const email = (document.querySelector("input#verify_email") as HTMLInputElement | null)?.value;
        if (!email) {
            message.error("Enter your email first.");
            return;
        }

        const {error} = await supabase.auth.resend({type: "signup", email});
        if (error) {
            message.error(error.message);
            return;
        }
        message.success("Verification email resent.");
    };

    return (
        <AuthShell>
            <Title>Verify email</Title>
            <Text>Enter the code from your Wheela confirmation email.</Text>
            <Form
                name="verify-email"
                onFinish={onFinish}
                layout="vertical"
                className="mt-4"
                size="large"
                initialValues={{email: initialEmail}}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{required: true, message: "Please input your email!"}, {type: "email", message: "Please enter a valid email!"}]}
                >
                    <Input id="verify_email" placeholder="Enter your email"/>
                </Form.Item>
                <Form.Item name="token" label="Verification code" rules={[{required: true, message: "Please input the code!"}]}>
                    <Input placeholder="Enter verification code"/>
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" className="w-full">
                        Verify email
                    </Button>
                </Form.Item>
                <Button type="link" className="px-0" onClick={resend}>Resend verification email</Button>
                <Form.Item className="flex justify-center text-center">
                    <Text><Link className="text-primary hover:underline" to="/login">Back to login</Link></Text>
                </Form.Item>
            </Form>
        </AuthShell>
    );
}
