import {useState} from "react";
import {App, Button, Form, Input, Typography} from "antd";
import {Link} from "react-router";
import {supabase} from "@/utils";
import AuthShell from "@/screens/auth/authShell.tsx";

const {Title, Text} = Typography;

export default function ReauthenticationScreen() {
    const {message} = App.useApp();
    const [loading, setLoading] = useState(false);
    const [nonceSent, setNonceSent] = useState(false);

    const sendNonce = async () => {
        setLoading(true);
        const {error} = await supabase.auth.reauthenticate();
        setLoading(false);

        if (error) {
            message.error(error.message);
            return;
        }

        setNonceSent(true);
        message.success("Security code sent.");
    };

    const onFinish = async ({password, nonce}: {password: string; nonce: string}) => {
        setLoading(true);
        const {error} = await supabase.auth.updateUser({password, nonce});
        setLoading(false);

        if (error) {
            message.error(error.message);
            return;
        }

        message.success("Sensitive action completed.");
    };

    return (
        <AuthShell>
            <Title>Reauthenticate</Title>
            <Text>Request a security code before completing a sensitive account action.</Text>
            <Button loading={loading} type="primary" className="mt-4" onClick={sendNonce}>
                Send security code
            </Button>
            {nonceSent && (
                <Form name="reauthentication" onFinish={onFinish} layout="vertical" className="mt-4" size="large">
                    <Form.Item name="nonce" label="Security code" rules={[{required: true, message: "Please input your code!"}]}>
                        <Input placeholder="Enter security code"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="New password"
                        rules={[{required: true, message: "Please input your new password!"}, {min: 8, message: "Use at least 8 characters."}]}
                    >
                        <Input.Password placeholder="New password"/>
                    </Form.Item>
                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit" className="w-full">
                            Confirm action
                        </Button>
                    </Form.Item>
                </Form>
            )}
            <div className="mt-4">
                <Link className="text-primary hover:underline" to="/profile">Back to profile</Link>
            </div>
        </AuthShell>
    );
}
