import {Avatar, Button, Checkbox, Flex, Form, Input, Typography} from "antd";
import LogoComponent from "../assets/logoComponent.tsx";
import {Link} from "react-router-dom";

const {Title,Text} = Typography;

export default function LoginScreen() {
    const onFinish = (values: {email: string,password: string}) => {
        console.log('Received values:', values);
    };

    return <div className={'flex flex-col justify-between items-center px-8 py-2 h-screen w-screen'}>
        <Link to={'/'} className={'w-full flex items-center justify-start'}>
            <div className={"flex text-primary items-center gap-2"}>
                <Avatar shape={"square"} size={"large"} src={<LogoComponent className={'text-primary'}/>}
                        className={" text-primary"}/>
                <Title level={4} className={"leading-none my-0"}>
                    ChatSync
                </Title>
            </div>
        </Link>

        <div className={'max-w-md w-full'}>
            <Title>Log In</Title>
            <Text>Sign In to your account</Text>
            <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
                className="mt-4"
                size={'large'}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input size={'large'} placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size={'large'} placeholder="Enter your password" />
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Button className={'hover:underline'} color={'primary'} variant={'link'} type={'primary'}>Forgot your password?</Button>
                    </Flex>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" size={'large'}>
                        Log In
                    </Button>
                </Form.Item>
                <Form.Item className={'flex justify-center text-center'}>
                    <Text className={'text-center'}>New To Chain Sync? <Link className={'text-primary hover:underline'} to={'/sign-up'}>Create an account</Link></Text>
                </Form.Item>
            </Form>
        </div>
        <div className={'flex justify-center items-center gap-4'}>
            <Link to={'/privacy'} className={'text-gray-500 hover:underline hover:text-primary'}>Terms Of Service</Link>
            <Link to={'/privacy'} className={'text-gray-500 hover:underline hover:text-primary'}>Privacy Policy</Link>
            <Link to={'/privacy'} className={'text-gray-500 hover:underline hover:text-primary'}>Security</Link>
        </div>
    </div>
}
