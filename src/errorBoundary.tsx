import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorPage />
            );
        }

        return this.props.children;
    }
}

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="error"
            title="Something went wrong"
            subTitle="Sorry, an unexpected error has occurred."
            className={'!bg-dark-700 !min-h-screen'}

            extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                    Back Home
                </Button>,
                <Button key="reload" onClick={() => window.location.reload()}>
                    Try Again
                </Button>,
            ]}
        />
    );
};

export default ErrorBoundary;
