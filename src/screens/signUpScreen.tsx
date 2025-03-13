import {Avatar, Form, Typography, Input, Button} from "antd";
import LogoComponent from "../assets/logoComponent.tsx";
import {Link} from "react-router-dom";

const {Title, Text} = Typography;

export default function SignUpScreen() {
    const onFinish = (values: { firstName: string; lastName: string; email: string; password: string; companyName: string }) => {
        console.log('Received values:', values);
    };
    return <div className={'flex flex-col justify-between items-center px-8 py-2 h-screen w-screen'}>
        <div className={'w-full flex items-center justify-start'}>
            <Link to={'/'} className={"flex text-primary items-center gap-2"}>
                <Avatar shape={"square"} size={"large"} src={<LogoComponent className={'text-primary'}/>}
                        className={" text-primary"}/>
                <Title level={4} className={"leading-none my-0"}>
                    ChatSync
                </Title>
            </Link>
        </div>

        <div className={'max-w-md w-full'}>
            <Title>Sign Up</Title>
            <Text>Create your account</Text>
            <Form
                name="sign-up"
                onFinish={onFinish}
                layout="vertical"
                className="mt-4 space-y-4"
                size={'large'}
            >
                <div className={'grid grid-cols-2 gap-4'}>
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input placeholder="Enter your first name" />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input placeholder="Enter your last name" />
                    </Form.Item>
                </div>
                <Form.Item
                    name="companyName"
                    label="Company Name"
                    rules={[{ required: true, message: 'Please input your company name!' }]}
                >
                    <Input placeholder="Enter your company name" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Create Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Create a password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                    <Input.Password placeholder="Confirm your password" />
                </Form.Item>



                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">
                        Sign Up
                    </Button>
                </Form.Item>
                <Form.Item className={'flex justify-center text-center'}>
                    <Text className={'text-center'}>Already have an account? <Link className={'text-primary hover:underline'} to={'/login'}>Log in</Link></Text>
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
