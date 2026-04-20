import {useEffect, useState} from "react";
import {App, Button, Form, Input, Typography} from "antd";
import {Link, useNavigate, useSearchParams} from "react-router";
import {supabase} from "@/utils";
import AuthShell from "@/screens/auth/authShell.tsx";

const {Title, Text} = Typography;

export default function ResetPasswordScreen() {
    const {message} = App.useApp();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) return;

        void supabase.auth.exchangeCodeForSession(code).then(({error}) => {
            if (error) {
                message.error(error.message);
            }
        });
    }, [message, searchParams]);

    const onFinish = async ({password}: {password: string}) => {
        setLoading(true);
        const {error} = await supabase.auth.updateUser({password});
        setLoading(false);

        if (error) {
            message.error(error.message);
            return;
        }

        message.success("Password updated.");
        navigate("/login", {replace: true});
    };

    return (
        <AuthShell>
            <Title>Create new password</Title>
            <Text>Choose a new password for your Wheela account.</Text>
            <Form name="reset-password" onFinish={onFinish} layout="vertical" className="mt-4" size="large">
                <Form.Item
                    name="password"
                    label="New password"
                    rules={[{required: true, message: "Please input your new password!"}, {min: 8, message: "Use at least 8 characters."}]}
                >
                    <Input.Password placeholder="New password"/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm password"
                    dependencies={["password"]}
                    rules={[
                        {required: true, message: "Please confirm your password!"},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) return Promise.resolve();
                                return Promise.reject(new Error("Passwords do not match."));
                            }
                        })
                    ]}
                >
                    <Input.Password placeholder="Confirm password"/>
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" className="w-full">
                        Update password
                    </Button>
                </Form.Item>
                <Form.Item className="flex justify-center text-center">
                    <Text><Link className="text-primary hover:underline" to="/login">Back to login</Link></Text>
                </Form.Item>
            </Form>
        </AuthShell>
    );
}
