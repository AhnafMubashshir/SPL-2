import React, { useState, useEffect } from 'react'
import { MessageTwoTone } from '@ant-design/icons'
import axios from 'axios'
import './Home.css'
import { Modal } from 'antd'

const RootHome = () => {

  const [AllPosts, SetAllPosts] = useState([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [AllComments, setAllComments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5050/posts')
      .then((response) => {
        SetAllPosts(response.data);
      })
  }, []);

  function handleProfileClick() {
    console.log('i am here!!!!!!!!!!')
  }

  async function updateComments(postID) {
    const updatedComments = await axios.post('http://localhost:5050/comment', {
        postID: postID,
    });
    setAllComments(updatedComments.data);
}

  function handleCancelComment() {
    setCommentModalVisible(false);
  }

  async function handleCommentShow(postID) {
    await updateComments(postID);
    setCommentModalVisible(true);
  }


  return (
    <>
      <div className="homepage">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10vh', padding: '10px', background: '#f5f5f5', marginBottom: '20px' }}>
          <h1><strong>Welcome to the SVAS</strong></h1>
        </div>
        <main>
          {AllPosts.map((post) => (
            <div className="post" key={post.id}>
              <div className="post-info">
                <div className="post-uid" onClick={handleProfileClick}><strong>{post.userName}</strong></div>
                <hr className="divider" />
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <hr className="divider" />
                <div className="post-actions">
                  <p style={{ color: '#5e5e5e' }}>{post.likeCount} liked</p>
                  <button className="comment-btn" onClick={() => handleCommentShow(post.id)}><MessageTwoTone /></button>
                  <p style={{ color: '#5e5e5e' }}>{post.commentCount} commented</p>
                </div>
              </div>
            </div>
          ))}
        </main >
      </div >

      <Modal
        title={<p style={{ fontSize: '20px' }}><strong>Comments</strong></p>}
        visible={commentModalVisible}
        onCancel={handleCancelComment}
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
                </div>
                <hr className="divider" />
                <p style={{ fontSize: '18px' }}>{comment.body}</p>
              </div>
            </div>
          ))}


        </div>
      </Modal>
    </>
  )
}

export default RootHome
