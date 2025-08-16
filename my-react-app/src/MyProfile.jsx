import React, { useState, useEffect } from 'react';
import { employeeAPI } from './services/api';
import { showErrorMessage } from './utils/utils';

function MyProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (userData.id) {
          // Fetch detailed employee data from API
          const employeeData = await employeeAPI.getById(userData.id);
          setEmployee({
            employeeName: employeeData.name || userData.name,
            designation: employeeData.designation || userData.designation,
            email: employeeData.email || userData.email,
            dateOfBirth: employeeData.dateOfBirth || 'Not specified',
            mobileNumber: employeeData.contact || 'Not specified',
            department: employeeData.department || 'Not specified',
            currentAddress: employeeData.address || 'Not specified',
            permanentAddress: employeeData.address || 'Not specified',
            salary: employeeData.salary || 'Not specified',
            joinDate: employeeData.joinDate || 'Not specified'
          });
        } else {
          // Fallback to localStorage data
          setEmployee({
            employeeName: userData.name || 'User',
            designation: userData.designation || 'Employee',
            email: userData.email || 'Not specified',
            dateOfBirth: 'Not specified',
            mobileNumber: 'Not specified',
            department: 'Not specified',
            currentAddress: 'Not specified',
            permanentAddress: 'Not specified',
            salary: 'Not specified',
            joinDate: 'Not specified'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showErrorMessage('Error', 'Failed to load profile data');
        
        // Fallback to localStorage data
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setEmployee({
          employeeName: userData.name || 'User',
          designation: userData.designation || 'Employee',
          email: userData.email || 'Not specified',
          dateOfBirth: 'Not specified',
          mobileNumber: 'Not specified',
          department: 'Not specified',
          currentAddress: 'Not specified',
          permanentAddress: 'Not specified',
          salary: 'Not specified',
          joinDate: 'Not specified'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <section>
        <div className="row">
          <div className="col-md-6 offset-md-3 mt-3">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!employee) {
    return (
      <section>
        <div className="row">
          <div className="col-md-6 offset-md-3 mt-3">
            <div className="card">
              <div className="card-body text-center">
                <p>Unable to load profile data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="row">
        <div className="col-md-6 offset-md-3 mt-3">
          <div className="card">
            <div className="card-body">
              <div className="container text-center">
                <img alt="image" src="/assets/img/default.png" style={{ height: 100 }} />
                <h5>{employee.employeeName}</h5>
                <p><i>{employee.designation}</i></p>
                <hr />
              </div>
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td><b>Email</b></td>
                    <td>{employee.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td><b>Date of Birth </b></td>
                    <td>{employee.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td><b>Mobile Number </b></td>
                    <td>{employee.mobileNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td><b>Department</b></td>
                    <td>{employee.department}</td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td><b>Current Address</b></td>
                    <td>{employee.currentAddress}</td>
                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td><b>Permanent Address</b></td>
                    <td>{employee.permanentAddress}</td>
                  </tr>
                </tbody>
              </table>
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyProfile; 