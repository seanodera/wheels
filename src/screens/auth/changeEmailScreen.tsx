import {useState} from "react";
import {App, Button, Form, Input, Typography} from "antd";
import {Link} from "react-router";
import {supabase} from "@/utils";
import AuthShell from "@/screens/auth/authShell.tsx";

const {Title, Text} = Typography;

export default function ChangeEmailScreen() {
    const {message} = App.useApp();
    const [loading, setLoading] = useState(false);

    const onFinish = async ({email}: {email: string}) => {
        setLoading(true);
        const {error} = await supabase.auth.updateUser(
            {email},
            {emailRedirectTo: `${window.location.origin}/auth/callback`}
        );
        setLoading(false);

        if (error) {
            message.error(error.message);
            return;
        }

        message.success("Email change verification sent.");
    };

    return (
        <AuthShell>
            <Title>Change email</Title>
            <Text>We will send a verification email to your new address.</Text>
            <Form name="change-email" onFinish={onFinish} layout="vertical" className="mt-4" size="large">
                <Form.Item
                    name="email"
                    label="New email"
                    rules={[{required: true, message: "Please input your new email!"}, {type: "email", message: "Please enter a valid email!"}]}
                >
                    <Input placeholder="Enter new email"/>
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" className="w-full">
                        Send verification
                    </Button>
                </Form.Item>
                <Form.Item className="flex justify-center text-center">
                    <Text><Link className="text-primary hover:underline" to="/profile">Back to profile</Link></Text>
                </Form.Item>
            </Form>
        </AuthShell>
    );
}
