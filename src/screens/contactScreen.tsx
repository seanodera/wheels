import {Button, Form, Input, Typography} from "antd";
import Navbar from "@/components/navigation/navbar.tsx";
import Footer from "@/components/navigation/footer.tsx";

const {Title, Text} = Typography;
const {TextArea} = Input;

export default function ContactPage() {
    return (
        <div>
            <Navbar/>
            <div
                className="bg-light-bg dark:bg-dark-bg min-h-[80vh] flex flex-col justify-center py-20 md:py-24 xl:py-28 px-4 md:px-8 xl:px-12 2xl:px-16">
                <div className="mx-auto max-w-400">

                    {/* HEADER */}
                    <div className="max-w-2xl">
                        <Text
                            className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                            Contact
                        </Text>

                        <Title level={2} className="mt-3! mb-2! leading-none text-black dark:text-white">
                            Get in touch.
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            For questions about listings, auctions, or transactions, reach out and we’ll respond as soon
                            as possible.
                        </Text>
                    </div>


                    {/* GRID */}
                    <div className="mt-12 md:mt-16 grid gap-8 md:grid-cols-2">

                        {/* FORM */}
                        <div className={'rounded-2xl glass-card border border-black/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5'}>
                            <Title
                                level={5}
                                className="mb-4! block uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                Message
                            </Title>
                            <Form title={'Message'} layout={'vertical'}>
                                <Form.Item label={'Your Name'}>
                                    <Input placeholder="Your name"/>
                                </Form.Item>
                                <Form.Item label={'Your Email'}>
                                    <Input placeholder="Email address"/>
                                </Form.Item>
                                <Form.Item label={'Your Message'}>
                                    <TextArea rows={5} placeholder="Your message"/>
                                </Form.Item>
                                <Button type="primary" size="large" block>
                                    Send message
                                </Button>
                            </Form>
                        </div>


                        {/* INFO */}
                        <div className="flex flex-col gap-6">

                            <div
                                className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                                <Text
                                    className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                    General
                                </Text>

                                <Title level={5} className="mb-1! text-black dark:text-white">
                                    Support & enquiries
                                </Title>

                                <Text className="text-sm text-black/65 dark:text-white/70">
                                    support@serid.com
                                </Text>
                            </div>

                            <div
                                className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                                <Text
                                    className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                    Response
                                </Text>

                                <Title level={5} className="mb-1! text-black dark:text-white">
                                    Typical response time
                                </Title>

                                <Text className="text-sm text-black/65 dark:text-white/70">
                                    Within 24–48 hours for most enquiries.
                                </Text>
                            </div>

                            <div
                                className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                                <Text
                                    className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                    Scope
                                </Text>

                                <Title level={5} className="mb-1! text-black dark:text-white">
                                    What to contact us about
                                </Title>

                                <Text className="text-sm text-black/65 dark:text-white/70">
                                    Listing issues, auction questions, account support, or general platform enquiries.
                                </Text>
                            </div>

                        </div>

                    </div>


                    {/* FOOTNOTE */}
                    <div className="mt-16 max-w-2xl">
                        <Text className="text-xs text-black/50 dark:text-white/50">
                            For urgent transaction-related matters, include your listing or auction ID in your message.
                        </Text>
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    );
}