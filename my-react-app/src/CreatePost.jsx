import React, { useState, useEffect } from 'react';
import { postsAPI } from './services/api';
import { showSuccessMessage, showErrorMessage } from './utils/utils';

function CreatePost() {
  const [form, setForm] = useState({ title: '', comment: '' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showErrorMessage('Error!', 'Failed to fetch posts from database');
      // Fallback to demo data
      setPosts([
        { id: 1, title: 'Welcome', content: 'This is the first post!', addedDate: '2024-06-01', author: 'Admin' },
        { id: 2, title: 'Reminder', content: 'Don\'t forget the meeting tomorrow.', addedDate: '2024-06-02', author: 'HR' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const postData = {
        title: form.title,
        content: form.comment,
        author: user.name || 'Anonymous'
      };
      
      const response = await postsAPI.create(postData);
      
      if (response.success) {
        showSuccessMessage('Success!', 'Post created successfully');
        setForm({ title: '', comment: '' });
        // Refresh posts list
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showErrorMessage('Error!', error.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize component
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section>
      <h4 style={{ textAlign: 'center' }} className="mt-3">Create Post And Share</h4>
      <hr />
      <div className="row">
        <div className="col-md-8 offset-2">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mt-3">
                  <label htmlFor="title" className="form-label">Enter Title</label>
                  <input type="text" name="title" className="form-control" required value={form.title} onChange={handleChange} />
                </div>
                <div className="mt-3">
                  <label htmlFor="comment" className="form-label">Enter Comment</label>
                  <textarea rows={5} name="comment" style={{ width: '100%' }} required value={form.comment} onChange={handleChange}></textarea>
                </div>
                <div className="mt-3 container text-center">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="container mt-3 mb-3">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status" aria-hidden="true"></div>
                  <p className="mt-2">Loading posts...</p>
                </div>
              ) : (
                <dl>
                  {posts.length > 0 ? (
                    posts.map((e, idx) => (
                      <React.Fragment key={e.id || idx}>
                        <dt>
                          <span>{e.title}</span>
                          <small style={{ float: 'right' }}>
                            {e.author && <span className="badge bg-secondary me-2">{e.author}</span>}
                            {e.addedDate}
                          </small>
                        </dt>
                        <dd>{e.content || e.comment}</dd>
                        <hr />
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="fas fa-file-alt fa-3x mb-3"></i>
                      <p>No posts available. Create your first post!</p>
                    </div>
                  )}
                </dl>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreatePost; 