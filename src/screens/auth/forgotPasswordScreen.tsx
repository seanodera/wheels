import {useState} from "react";
import {App, Button, Form, Input, Typography} from "antd";
import {Link} from "react-router";
import {supabase} from "@/utils";
import AuthShell from "@/screens/auth/authShell.tsx";

const {Title, Text} = Typography;

export default function ForgotPasswordScreen() {
    const {message} = App.useApp();
    const [loading, setLoading] = useState(false);

    const onFinish = async ({email}: {email: string}) => {
        setLoading(true);
        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        setLoading(false);

        if (error) {
            message.error(error.message);
            return;
        }

        message.success("Password reset email sent.");
    };

    return (
        <AuthShell>
            <Title>Reset password</Title>
            <Text>Enter your email and we will send a secure reset link.</Text>
            <Form name="forgot-password" onFinish={onFinish} layout="vertical" className="mt-4" size="large">
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{required: true, message: "Please input your email!"}, {type: "email", message: "Please enter a valid email!"}]}
                >
                    <Input placeholder="Enter your email"/>
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" className="w-full">
                        Send reset link
                    </Button>
                </Form.Item>
                <Form.Item className="flex justify-center text-center">
                    <Text>Remembered it? <Link className="text-primary hover:underline" to="/login">Log in</Link></Text>
                </Form.Item>
            </Form>
        </AuthShell>
    );
}
