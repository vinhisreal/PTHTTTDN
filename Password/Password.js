import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../createAxios";
import { changePassword } from "../../redux/apiRequest";
import { toast } from "react-toastify";
import classNames from "classnames/bind";
import styles from "./Password.module.scss";
import { FiEye, FiEyeOff } from "react-icons/fi";

const cx = classNames.bind(styles);

function Password() {
  const currentUser = useSelector((state) => state.user.signin.currentUser);
  const accessToken = currentUser?.metadata.tokens.accessToken;
  const userID = currentUser?.metadata.user._id;
  const userEmail = currentUser?.metadata.user?.user_email || "";

  const axiosJWT = createAxios(currentUser);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    password: "",
    new_password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.new_password || !form.confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (form.new_password !== form.confirmPassword) {
      toast.error("Xác nhận mật khẩu mới không trùng khớp!");
      return;
    }

    try {
      const res = await changePassword(
        accessToken,
        userID,
        {
          email: userEmail,
          password: form.password,
          new_password: form.new_password,
        },
        dispatch,
        axiosJWT
      );

      if (res && res.metadata) {
        toast.success("Đổi mật khẩu thành công!");
        setForm({
          password: "",
          new_password: "",
          confirmPassword: "",
        });
      } else {
        toast.error("Mật khẩu không chính xác!");
      }
    } catch (error) {
      toast.error("Mật khẩu không chính xác!");
    }
  };

  return (
    <div className={cx("change-password-container")}>
      <h2>Đổi mật khẩu</h2>

      <form className={cx("form")} onSubmit={handleSubmit}>
        {/* Mật khẩu hiện tại */}
        <div className={cx("form-group")}>
          <label>Mật khẩu hiện tại</label>
          <div className={cx("input-wrapper")}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <span
              className={cx("toggle-password")}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div className={cx("form-group")}>
          <label>Mật khẩu mới</label>
          <div className={cx("input-wrapper")}>
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
            />
            <span
              className={cx("toggle-password")}
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div className={cx("form-group")}>
          <label>Xác nhận mật khẩu mới</label>
          <div className={cx("input-wrapper")}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu mới"
            />
            <span
              className={cx("toggle-password")}
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <button type="submit" className={cx("submit-button")}>
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
}

export default Password;
