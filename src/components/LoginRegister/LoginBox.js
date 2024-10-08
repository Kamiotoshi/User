import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginBox = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
 
  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm kiểm tra hợp lệ form đăng nhập
  const validateLogin = () => {
    let errors = { email: '', password: '' };
    let isValid = true;

    if (!validateEmail(loginData.email)) {
      errors.email = 'Định dạng email không hợp lệ';
      isValid = false;
    }
    if (loginData.password.length < 6) {
      errors.password = 'Mật khẩu phải ít nhất 6 ký tự';
      isValid = false;
    }

    setLoginErrors(errors);
    return isValid;
  };

  // Xử lý form đăng nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (validateLogin()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          'https://projectky320240926105522.azurewebsites.net/api/Auth/login',
          loginData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, // Send cookies along with the request
          }
        );

        const data = response.data;
        console.log("Dữ liệu đăng nhập thành công:", data);

        // Alert success message
        window.alert("Đăng nhập thành công!");
        
        // Fetch user information using the cookies
        const userInfoResponse = await axios.get(
          'https://projectky320240926105522.azurewebsites.net/api/User/userProfile',
          {
            withCredentials: true, // Ensure that cookies are sent to fetch user info
          }
        );

        console.log("Thông tin người dùng:", userInfoResponse.data.userId);
        localStorage.setItem('Token', userInfoResponse.data.userId);
 
        // Optionally, navigate to the home page or dashboard
        navigate("/");
        // Force reloading the page to ensure all state is updated and cleared
        window.location.reload();
      } catch (error) {
        if (error.response) {
          // Check for specific error codes and display detailed messages
          if (error.response.status === 401) {
            // Unauthorized: Incorrect credentials
            window.alert('Sai tài khoản hoặc mật khẩu.');
          } else if (error.response.status === 403) {
            // Forbidden: User does not have permission
            window.alert('Bạn không có quyền truy cập. Vui lòng liên hệ với quản trị viên.');
          } else {
            // Any other error status or unknown error
            window.alert('Đăng nhập thất bại: ' + error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
          }
          console.error("Lỗi đăng nhập:", error.response.data);
        } else {
          window.alert('Đăng nhập thất bại. Vui lòng thử lại.');
          console.error("Lỗi đăng nhập:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="login_box_area section_gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="login_box_img">
              <img className="img-fluid" src="img/login.jpg" alt="" />
              <div className="hover">
                <h4>New to our website?</h4>
                <p>There are advances being made in science and technology every day, and a good example of this is the</p>
                <Link className="primary-btn" to="/register">Create an Account</Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="login_form_inner">
              <h3>Log in to enter</h3>
              <form className="row login_form" onSubmit={handleLoginSubmit} noValidate>
                <div className="col-md-12 form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                  {loginErrors.email && <p style={{ color: 'red' }}>{loginErrors.email}</p>}
                </div>
                <div className="col-md-12 form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
                <div className="col-md-12 form-group">
                  <div className="creat_account">
                    <input type="checkbox" id="f-option2" name="selector" />
                    <label htmlFor="f-option2">Keep me logged in</label>
                  </div>
                </div>
                {loginErrors.password && <p style={{ color: 'red' }}>{loginErrors.password}</p>}
                <div className="col-md-12 form-group">
                  <button className="primary-btn" disabled={isLoading}>
                    {isLoading ? 'Log In...' : 'Log In'}
                  </button>
                  <a href="#">Forgot Password?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginBox;
