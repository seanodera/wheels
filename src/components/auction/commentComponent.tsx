import { useState } from "react";
import { Avatar, Button, Input, List } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, UserOutlined } from "@ant-design/icons";
import {CarAuction, CarItem, CommentItem} from "@/types";

const { TextArea } = Input;

function CommentCard({ comment }: { comment: CommentItem }) {
    return (
        <div className="rounded-lg bg-dark-400/30 px-4 py-3">
            <div className="flex items-start gap-3">
                <Avatar icon={<UserOutlined />} />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-gray-400">
                            {new Date(comment.timestamp).toLocaleString()}
                        </span>
                    </div>
                    <p className="mb-0 mt-2 whitespace-pre-wrap">{comment.text}</p>
                </div>
            </div>
        </div>
    );
}

export default function CommentsComponent({ listing }: { listing: CarAuction|CarItem }) {
    const [comments, setComments] = useState<CommentItem[]>(listing.comments ?? []);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    const addComment = () => {
        if (!newComment.trim()) return;
        const newCommentObj: CommentItem = {
            id: (comments.length + 1).toString(),
            user: {
                id: '1',
                email: "",
                name: 'you'
            },
            text: newComment,
            timestamp: new Date().toISOString(),
            replies: [],
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
    };

    const addReply = (parentId: string) => {
        if (!replyText.trim()) return;

        const newReply: CommentItem = {
            id: Date.now().toString(),
            user: {
                id: '1',
                email: "",
                name: "you"
            },
            text: replyText,
            timestamp: new Date().toISOString(),
            replies: [],
        };

        const updatedComments = comments.map((comment) =>
            comment.id === parentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), newReply] as CommentItem[], // ✅ Explicitly cast replies
                }
                : comment
        );

        setComments(updatedComments as CommentItem[]); // ✅ Ensure type consistency
        setReplyingTo(null);
        setReplyText("");
    };
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <Button type={'primary'} onClick={() => {console.log(comments)}}>Print</Button>
            {/* Add New Comment */}
            <div className={'flex items-end border border-gray-500 border-solid rounded-lg px-2 py-1 bg-dark-400/20 mb-4'}>
                <TextArea
                    autoSize={true}
                    placeholder="Add comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant={'borderless'}
                />
                <Button type={'primary'} shape={'circle'} onClick={addComment} icon={<ArrowDownOutlined/>}/>
            </div>

            {/* Display Comments */}
            <List
                dataSource={comments}
                renderItem={(comment) => (
                    <li key={comment.id} className="mb-4">
                        <CommentCard comment={comment} />

                        {/* Reply Section */}
                        {replyingTo === comment.id ? (
                            <div className={'flex items-end border border-gray-500 border-solid rounded-lg px-2 py-1 bg-dark-400/20 ml-10 my-4'}>
                                <TextArea
                                    autoSize={true}
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    variant={'borderless'}
                                />
                                <Button type={'primary'} shape={'circle'} onClick={() => addReply(comment.id)} icon={<ArrowUpOutlined/>}/>
                            </div>
                        ) : (
                            <Button color={'primary'} variant={'text'} onClick={() => {
                                setReplyingTo(comment.id)
                                setReplyText('')
                            }} className="ml-4 mt-2">
                                Reply
                            </Button>
                        )}

                        {/* Show Replies */}
                        {comment.replies && comment.replies?.length > 0 && (
                            <div className="ml-8 mt-2">
                                <List
                                    dataSource={comment.replies}
                                    renderItem={(reply) => (
                                        <li key={reply.id} className={'rounded-lg'}>
                                            <CommentCard comment={reply} />
                                        </li>
                                    )}
                                />
                            </div>
                        )}
                    </li>
                )}
            />
        </div>
    );
}
