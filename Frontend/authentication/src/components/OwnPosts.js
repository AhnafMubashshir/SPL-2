import React, { useState, useEffect } from 'react'
import { SettingTwoTone, MessageTwoTone, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Space, Modal, Button, Input, Menu, Empty } from 'antd';
import axios from 'axios'
import './Home.css';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;

const OwnPosts = () => {
    const params = useParams();

    useEffect(() => {
        axios.post('http://localhost:5050/posts/ownPosts', {
            userID: params
        })
            .then((response) => {
                const updatedPosts = response.data.map((post) => ({
                    ...post,
                    liked: false,
                }));
                SetAllPosts(updatedPosts);
            })
    }, [params]);


    const items = [
        {
            label: 'Edit Post',
            key: '0',
            onClick: (post) => handleEditPost(post),
        },
        {
            label: 'Delete post',
            key: '1',
            onClick: (post) => handleDeletePost(post),
        },
    ];
    const [fieldvalue, setFiledValue] = useState({
        title: '',
        body: '',
        UserName: '',
    });
    const [AllPosts, SetAllPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [AllComments, setAllComments] = useState([]);
    const [comment, setComment] = useState('');
    const [commentPostID, setCmmentPostID] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editCommentModalVisible, setEditCommentModalVisible] = useState(false);
    const [editedComment, setEditedComment] = useState('');
    const [editCommentId, setEditCommentId] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteComment, setDeleteComment] = useState();
    const [postDeleteModalVisible, setPostDeleteModalVisible] = useState(false);
    const [deletePost, setDeletePost] = useState();

    async function updateComments(postID) {
        const updatedComments = await axios.post('http://localhost:5050/comment', {
            postID: postID,
        });
        setAllComments(updatedComments.data);
    }

    async function updatePosts() {
        axios.post('http://localhost:5050/posts/ownPosts', {
            userID: params
        }).then((response) => {
            const updatedPosts = response.data.map((post) => ({
                ...post,
                liked: false,
            }));
            SetAllPosts(updatedPosts);
        });
    }

    const getData = (data) => {
        const fieldName = data.target.name;
        const fieldValue = data.target.value;

        setFiledValue((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue,
        }));
    };

    const handleClearValues = () => {
        setFiledValue({
            title: '',
            PostText: '',
            UserName: '',
        });
    };

    console.log(fieldvalue);

    const handleEditPost = (post) => {
        setOpen(true);
        fieldvalue.title = post.title;
        fieldvalue.body = post.body;
        fieldvalue.UserName = post.UserName;
        fieldvalue.id = post.id;
        // console.log(post);
    }

    const handleOk = (data) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);

        data.preventDefault();

        axios.post('http://localhost:5050/posts/update', fieldvalue)
            .then((response) => {
                if (response) {
                    console.log('Eta age', response);
                    updatePosts();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleCancel = () => {
        handleClearValues();
        setOpen(false);
    };

    const handleLikeClick = async (postID) => {

        const response = await axios.post('http://localhost:5050/like/postLikeOperation', {
            postID: postID,
            uID: params
        })

        console.log("After liking: ", response.data.liked);

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

        console.log(updatedPosts);

        SetAllPosts(updatedPosts);
    };

    const handleCommentModalOk = async () => {
        if (!comment) {
            alert("Please write a comment");
            return;
        }

        const response = await axios.post('http://localhost:5050/comment/postCommentOperation', {
            postID: commentPostID,
            comment: comment,
            uID: params
        })

        console.log("After commenting: ", response);


        await updateComments(commentPostID);

        await updatePosts();

        setComment('');
    };

    const handleCommentModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleCommentButton = async (postID) => {
        const response = await axios.post('http://localhost:5050/comment', {
            postID: postID
        })
        console.log("Comments: ", response.data);
        setAllComments(response.data);
        setCmmentPostID(postID);
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
        try {
            await axios.post(`http://localhost:5050/comment/editComment`, {
                commentID: editCommentId,
                commentBody: editedComment,
            });

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

    const handlePostDeleteConfirm = async () => {
        console.log(deletePost);
        await axios.post('http://localhost:5050/posts/deletePost', {
            post: deletePost
        })

        await updatePosts();

        setPostDeleteModalVisible(false);
    };

    const handlePostDeleteCancel = () => {
        setPostDeleteModalVisible(false);
    }

    const handleDeletePost = async (post) => {
        console.log("in here: ", post);
        setDeletePost(post);
        setPostDeleteModalVisible(true);
    };


    return (
        <>
            <div className="homepage">
                {
                    !AllPosts || AllPosts.length === 0 ? (
                        <Empty />
                    ) : (
                        <main>
                            {AllPosts.map((post) => (
                                <div className="post" key={post.id}>
                                    <div className="post-info">
                                        <div className="post-header">
                                            <div className="user-name">
                                                <p><strong>{post.userName}</strong></p>
                                            </div>
                                            <div className="settings-button">
                                                <Dropdown
                                                    menu={{
                                                        items: items.map((item) => ({
                                                            ...item,
                                                            onClick: () => item.onClick(post),
                                                        })),
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button onClick={(e) => e.preventDefault()}>
                                                        <Space>
                                                            <SettingTwoTone />
                                                        </Space>
                                                    </Button>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <hr className="divider" />
                                        <h2>{post.title}</h2>
                                        <p>{post.body}</p>
                                        <hr className="divider" />
                                        <div className="post-actions">
                                            <button className="btn btn-light" onClick={() => handleLikeClick(post.id)}>
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
                        </main>
                    )
                }

                <div style={{ marginBottom: '60px' }} />
            </div>

            <Modal
                open={open}
                title="Edit Your Post"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel} style={{ marginTop: '10px' }}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk} style={{ background: '#192841', marginTop: '10px' }} >
                        Submit
                    </Button>,
                ]}
            >
                <TextArea
                    showCount
                    name='title'
                    style={{
                        height: 50,
                        marginBottom: 24,
                    }}
                    onChange={getData}
                    value={fieldvalue.title}
                />
                <TextArea
                    showCount
                    name='body'
                    style={{
                        height: 150,
                    }}
                    onChange={getData}
                    value={fieldvalue.body}
                />
            </Modal>

            <Modal
                title={<p style={{ fontSize: '20px' }}><strong>Comments</strong></p>}
                visible={isModalVisible}
                onOk={handleCommentModalOk}
                onCancel={handleCommentModalCancel}
                width={800}
                footer={null}
                className='custom-modal'
                style={{ marginLeft: '400px' }}
            >
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {AllComments.map((comment) => (
                        <div className="post" key={comment.id} >
                            <div className="post-info">
                                <div className="post-uid">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <strong>{comment.userName}</strong>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>

                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    {comment.userID === params.uID && (
                                                        <Menu.Item key="edit" onClick={() => handleEditComment(comment)}>
                                                            Edit
                                                        </Menu.Item>
                                                    )}
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
                                    </div>
                                </div>
                                <hr className="divider" />
                                <p>{comment.body}</p>
                                <hr className="divider" />
                                <div className="post-actions">
                                    <button className="comment-btn">
                                        <MessageTwoTone />
                                    </button>


                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <Input value={comment} onChange={(e) => setComment(e.target.value)} style={{ marginRight: '20px' }} />
                    <Button type="primary" onClick={handleCommentModalOk} style={{ background: '#192841' }}>
                        Comment
                    </Button>
                </div>

            </Modal>

            <Modal
                title="Edit Comment"
                visible={editCommentModalVisible}
                onOk={handleSaveEditComment}
                onCancel={handleCancelEditComment}
            >
                <TextArea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
            </Modal>

            <Modal
                visible={deleteModalVisible}
                title="Delete Profile"
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okButtonProps={{ style: { background: '#192841' } }}
            >
                <p>Are you sure you want to delete your Comment?</p>
            </Modal>

            <Modal
                visible={postDeleteModalVisible}
                title="Delete Profile"
                onOk={handlePostDeleteConfirm}
                onCancel={handlePostDeleteCancel}
                okButtonProps={{ style: { background: '#192841' } }}
            >
                <p>Are you sure you want to delete your Post?</p>
            </Modal>
        </>
    )
}

export default OwnPosts;
