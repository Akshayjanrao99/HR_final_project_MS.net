import React, { useState } from 'react';
import { authAPI } from './services/api';
import { showSuccessMessage, showErrorMessage } from './utils/utils';

function UserSetting() {
  const [form, setForm] = useState({
    password: '',
    newPassword1: '',
    newPassword2: '',
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword1 !== form.newPassword2) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);

    try {
      // Get user information from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = userData.email;
      
      console.log('User data from localStorage:', userData);
      console.log('User Email:', userEmail);
      
      if (!userEmail) {
        showErrorMessage('Error!', 'User information not found. Please login again.');
        return;
      }

      const requestData = {
        email: userEmail,
        currentPassword: form.password,
        newPassword: form.newPassword1
      };
      
      console.log('Sending password change request:', requestData);

      const response = await authAPI.changePassword(requestData);
      
      console.log('Password change response:', response);

      if (response.success) {
        showSuccessMessage('Success!', 'Password updated successfully!');
        setForm({ password: '', newPassword1: '', newPassword2: '' });
      } else {
        showErrorMessage('Error!', response.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      
      // Check if error has response data
      if (error.response && error.response.data) {
        showErrorMessage('Error!', error.response.data.message || 'Failed to update password');
      } else {
        showErrorMessage('Error!', 'Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 style={{ textAlign: 'center' }}>Change Password</h5>
              <hr />
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong></strong> Please Match Password !!!
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError(false)}></button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mt-3">
                  <label htmlFor="password">Enter Old Password</label>
                  <input type="password" name="password" className="form-control" required value={form.password} onChange={handleChange} />
                </div>
                <div className="mt-3">
                  <label htmlFor="newPassword1">Enter new Password</label>
                  <input type="password" name="newPassword1" className="form-control" required value={form.newPassword1} onChange={handleChange} />
                </div>
                <div className="mt-3">
                  <label htmlFor="newPassword2">Re-Enter new Password</label>
                  <input type="password" name="newPassword2" className="form-control" required value={form.newPassword2} onChange={handleChange} />
                </div>
                <div className="mt-3 container text-center">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserSetting; 