import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import classNames from "classnames/bind";
import styles from "./Signin.module.scss";
import { signin } from "../../redux/apiRequest";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import { toast } from "react-toastify";


const cx = classNames.bind(styles);

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const user = { email, password };

    if (rememberMe) {
      Cookies.set("email", email, { expires: 7 });
      Cookies.set("password", password, { expires: 7 });
    } else {
      Cookies.remove("email");
      Cookies.remove("password");
    }

    const result = await signin(user, dispatch, navigate);
    if (result === false) {
      toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin!");
    }
  };

  useEffect(() => {
    const savedEmail = Cookies.get("email");
    const savedPassword = Cookies.get("password");
    setRememberMe(!!savedEmail);
    setEmail(savedEmail || "");
    setPassword(savedPassword || "");
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <div className={cx("left-part")}>
          <Link to={"/"}>
            <img
              src="https://res.cloudinary.com/lewisshop/image/upload/v1743512129/toeic/answers/1743512126263-Logo.png.png"
              alt="Logo"
            />
          </Link>
        </div>

        <div className={cx("right-part")}>
          <h1 className={cx("title")}>Đăng nhập</h1>

          <form onSubmit={handleSubmit} className={cx("form")}>
            {/* Email */}
            <Box mb={1}>
              <label style={{ color: "white" }}>Email</label>
              <input
                className={cx("input")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!email && openSnackbar && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  Vui lòng nhập email
                </p>
              )}
            </Box>

            {/* Mật khẩu với icon */}
            <Box mb={1}>
              <label style={{ color: "white" }}>Mật khẩu</label>
              <div className={cx("input-wrapper")}>
                <input
                  className={cx("input")}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className={cx("toggle-password")}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {!password && openSnackbar && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  Vui lòng nhập mật khẩu
                </p>
              )}
            </Box>

            {/* Ghi nhớ */}
            <Box>
              <FormControlLabel
                sx={{ marginBottom: "0px" }}
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "var(--yellow)",
                      "&.Mui-checked": {
                        color: "var(--yellow)",
                      },
                    }}
                  />
                }
                label={
                  <span style={{ color: "white", margin: "0px" }}>
                    Ghi nhớ đăng nhập
                  </span>
                }
              />
            </Box>

            {/* Nút đăng nhập */}
            <Box mb={2} sx={{ textAlign: "center" }}>
              <Button
                sx={{
                  backgroundColor: "var(--yellow)",
                  color: "var(--dark)",
                  fontWeight: "bold",
                  width: "200px",
                  "&:hover": {
                    backgroundColor: "var(--white)",
                    color: "var(--black)",
                  },
                }}
                type="submit"
                variant="contained"
              >
                Đăng nhập
              </Button>
            </Box>

            {/* Đăng ký */}
            <Box mb={1}>
              Chưa có tài khoản?
              <Link
                to="/signup"
                style={{
                  color: "var(--yellow)",
                  marginLeft: "12px",
                  fontWeight: "bold",
                }}
              >
                Đăng ký
              </Link>
            </Box>
          </form>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </MuiAlert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}

export default Signin;
