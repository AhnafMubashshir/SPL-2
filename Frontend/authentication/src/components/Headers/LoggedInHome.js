import React, { useState, useEffect } from 'react';
import { MessageTwoTone, EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import { Dropdown, Modal, Button, Input, Menu, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import '../Home.css';
import './Modal.css';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

const LoggedInHome = () => {
    const params = useParams();
    const [form] = useForm();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [comment, setComment] = useState('');
    const [commentPostID, setCommentPostID] = useState('');
    const [AllPosts, SetAllPosts] = useState([]);
    const [AllComments, setAllComments] = useState([]);
    const [editCommentModalVisible, setEditCommentModalVisible] = useState(false);
    const [editedComment, setEditedComment] = useState('');
    const [editCommentId, setEditCommentId] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteComment, setDeleteComment] = useState();


    useEffect(() => {
        axios.get('http://localhost:5050/posts').then((response) => {
            const updatedPosts = response.data.map((post) => ({
                ...post,
                liked: false,
            }));
            SetAllPosts(updatedPosts);
        });
    }, []);

    async function updateComments(postID) {
        const updatedComments = await axios.post('http://localhost:5050/comment', {
            postID: postID,
        });
        setAllComments(updatedComments.data);
    }

    async function updatePosts() {
        axios.get('http://localhost:5050/posts').then((response) => {
            SetAllPosts(response.data);
        });
    }

    const handleLikeClick = async (postID) => {
        const response = await axios.post('http://localhost:5050/like/postLikeOperation', {
            postID: postID,
            uID: params,
        });

        const updatedPosts = AllPosts.map((post) => {
            if (post.id === postID) {
                return {
                    ...post,
                    liked: response.data.liked,
                    likeCount: response.data.likeCount,
                };
            }
            return post;
        });

        SetAllPosts(updatedPosts);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = async () => {
        if (!comment) {
            alert('Please write a comment');
            return;
        }

        await axios.post('http://localhost:5050/comment/postCommentOperation', {
            postID: commentPostID,
            comment: comment,
            uID: params,
        });

        await updatePosts();

        await updateComments(commentPostID);

        setComment('');
    };

    const handleCommentButton = async (postID) => {
        await updateComments(postID);
        setCommentPostID(postID);
        setIsModalVisible(true);
    };

    const handleEditComment = async (comment) => {
        setEditedComment(comment.body);
        setEditCommentId(comment.id);
        setEditCommentModalVisible(true);
    };

    const handleCancelEditComment = () => {
        setEditCommentModalVisible(false);
    };

    const handleSaveEditComment = async () => {
        if (!editedComment) {
            return;
        }
        try {
            // Send the updated comment to the server
            await axios.post(`http://localhost:5050/comment/editComment`, {
                commentID: editCommentId,
                commentBody: editedComment,
            });
            // Update the comment in the AllComments state
            const updatedComments = AllComments.map((comment) => {
                if (comment.id === editCommentId) {
                    return {
                        ...comment,
                        body: editedComment,
                    };
                }
                return comment;
            });
            setAllComments(updatedComments);
            setEditedComment('');
            setEditCommentId('');
            setEditCommentModalVisible(false);
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        await axios.post('http://localhost:5050/comment/deleteComment', {
            comment: deleteComment
        })

        await updatePosts();

        await updateComments(deleteComment.postID);
        setDeleteModalVisible(false);
    };

    const handleDeleteComment = async (comment) => {
        console.log(comment);
        setDeleteComment(comment);
        setDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
    }

    function handleSearch(value) {
        console.log(value);
        if (params.userType === 'AU') {
            navigate(`/admin/${params.userType}/${params.uID}/search/${value}`);
        }
        else {
            navigate(`/user/${params.userType}/${params.uID}/search/${value}`);
        }
    }


    return (
        <>
            <div className="homepage">
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Input.Search
                        placeholder="Search"
                        enterButton={
                            <Button type="primary" icon={<SearchOutlined />} style={{ background: '#192841' }} />
                        }
                        onSearch={handleSearch}
                    />
                </div>
                <main>
                    {AllPosts.map((post) => (
                        <div className="post" key={post.id}>
                            <div className="post-info">
                                <div className="post-uid" onClick={() => handleSearch(post.userID)}>
                                    <strong>{post.userName}</strong>
                                </div>
                                <hr className="divider" />
                                <h2>{post.title}</h2>
                                <p>{post.body}</p>
                                <hr className="divider" />
                                <div className="post-actions">
                                    <button
                                        className={`btn btn-light ${post.liked ? 'liked' : ''}`}
                                        onClick={() => handleLikeClick(post.id)}
                                    >
                                        <span className="bi bi-hand-thumbs-up"></span> {post.likeCount} &#x1F44D;
                                    </button>
                                    {post.liked && <p style={{ color: '#5e5e5e' }}>You liked</p>}
                                    <button className="comment-btn" onClick={() => handleCommentButton(post.id)}>
                                        <MessageTwoTone />
                                    </button>
                                    <p style={{ color: '#5e5e5e' }}>{post.commentCount} commented</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div style={{ marginBottom: '60px' }} />

                    <Modal
                        title={<p style={{ fontSize: '20px' }}><strong>Comments</strong></p>}
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width={800}
                        footer={null}
                        className='custom-modal'
                        style={{ marginLeft: '400px' }}
                    >
                        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {AllComments.map((comment) => (
                                <div className="post" key={comment.id}>
                                    <div className="post-info">
                                        <div className="post-uid">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <strong>{comment.userName}</strong>
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                {comment.userID === params.uID && (
                                                    <Dropdown
                                                        overlay={
                                                            <Menu>
                                                                <Menu.Item key="edit" onClick={() => handleEditComment(comment)}>
                                                                    Edit
                                                                </Menu.Item>
                                                                <Menu.Item key="delete" onClick={() => handleDeleteComment(comment)}>
                                                                    Delete
                                                                </Menu.Item>
                                                            </Menu>
                                                        }
                                                        trigger={['click']}
                                                        placement="bottomRight"
                                                    >
                                                        <Button className="comment-options-button" icon={<EllipsisOutlined />} />
                                                    </Dropdown>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="divider" />
                                        <p style={{ fontSize: '18px' }}>{comment.body}</p>
                                    </div>
                                </div>
                            ))}

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                            <Input value={comment} onChange={(e) => setComment(e.target.value)} style={{ marginRight: '20px' }} />
                            <Button type="primary" onClick={handleOk} style={{ background: '#192841' }}>
                                Comment
                            </Button>
                        </div>
                    </Modal>
                </main>
            </div>

            <Modal
                title="Edit Comment"
                visible={editCommentModalVisible}
                okButtonProps={{ style: { background: '#192841' } }}
                onOk={handleSaveEditComment}
                onCancel={handleCancelEditComment}
            >
                <Form form={form}>
                    <Form.Item
                        name="comment"
                        rules={[{ required: true, message: 'Please enter a comment' }]}
                    >
                        <TextArea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                visible={deleteModalVisible}
                title="Delete Profile"
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okButtonProps={{ style: { background: '#192841' } }}
            >
                <p>Are you sure you want to delete your profile?</p>
            </Modal>
        </>
    );
};

export default LoggedInHome;
