import {App, Avatar, Button, Checkbox, Flex, Form, Input, Typography} from "antd";
import LogoComponent from "../assets/logoComponent.tsx";
import {Link, useNavigate} from "react-router";
import {asyncLoginUser, useAppDispatch, useAppSelector} from "@/store";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";

const {Title,Text} = Typography;

export default function LoginScreen() {
    const {message} = App.useApp()
    const navigate = useNavigate();
    const {loading} = useAppSelector(state => state.authentication);
    const dispatch = useAppDispatch();
    const onFinish = async (values: {email: string,password: string, remember?: boolean}) => {
        const res = await dispatch(asyncLoginUser(values)).unwrap()
        if (res.onboardingRequired){
           await message.info('You need to create a profile. Redirecting now...')
            navigate(res.redirectTo)
            return;
        }
        message.success('User authenticated successfully.')
        if (res.redirectTo === '/'){
            try {
                navigate(-1)
            } catch (e){
                navigate(res.redirectTo)
                return e;
            }
        }
        navigate(res.redirectTo)
        return;
    };

    if (loading) {

        return <LoadingScreen/>
    }

    return <div className={'flex flex-col justify-between items-center px-8 py-2 h-screen w-screen bg-dark-950'}>
        <Link to={'/'} className={'w-full flex items-center justify-start'}>
            <div className={"flex text-primary items-center gap-2"}>
                <Avatar shape={"square"} size={"large"} src={<LogoComponent className={'text-primary'}/>}
                        className={" text-primary"}/>
                <Title level={4} className={"leading-none my-0"}>
                    Wheela
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
                <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Button className={'hover:underline'} color={'primary'} variant={'link'} type={'primary'}>Forgot your password?</Button>
                </Flex>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" size={'large'}>
                        Log In
                    </Button>
                </Form.Item>
                <Form.Item className={'flex justify-center text-center'}>
                    <Text className={'text-center'}>New To Wheela? <Link className={'text-primary hover:underline'} to={'/sign-up'}>Create an account</Link></Text>
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
