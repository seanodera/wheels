import { useState } from "react";
import {  Avatar, Button, Input, List } from "antd";
import { Comment } from '@ant-design/compatible';
import {ArrowDownOutlined, ArrowUpOutlined, UserOutlined} from "@ant-design/icons";
import {CarAuction, CommentItem} from "@/types.ts";

const { TextArea } = Input;



export default function CommentsComponent({ listing }: { listing: CarAuction }) {
    const [comments, setComments] = useState<CommentItem[]>(listing.comments);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    const addComment = () => {
        if (!newComment.trim()) return;
        const newCommentObj: CommentItem = {
            id: comments.length + 1,
            user: {
                id: 1, username: "You",
                email: ""
            },
            text: newComment,
            timestamp: new Date().toISOString(),
            replies: [],
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
    };

    const addReply = (parentId: number) => {
        if (!replyText.trim()) return;

        const newReply: CommentItem = {
            id: Date.now(),
            user: {
                id: 1, username: "You",
                email: ""
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
                        <Comment
                            className={'rounded-lg !bg-dark-400/30 !px-4'}
                            author={comment.user.username}
                            avatar={<Avatar icon={<UserOutlined />} />}
                            content={<p>{comment.text}</p>}
                            datetime={new Date(comment.timestamp).toLocaleString()}
                        />

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
                                            <Comment
                                                className={'rounded-lg'}
                                                author={reply.user.username}
                                                avatar={<Avatar icon={<UserOutlined />} />}
                                                content={<p>{reply.text}</p>}
                                                datetime={new Date(reply.timestamp).toLocaleString()}
                                            />
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
