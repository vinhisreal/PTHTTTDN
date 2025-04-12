import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../createAxios";
import { findUser, updateUser, uploadImage } from "../../redux/apiRequest";
import { toast } from "react-toastify";
import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";

const cx = classNames.bind(styles);

function Account() {
  const currentUser = useSelector((state) => state.user.signin.currentUser);
  const accessToken = currentUser?.metadata.tokens.accessToken;
  const userID = currentUser?.metadata.user._id;
  const axiosJWT = createAxios(currentUser);
  const [userInfor, setUserInfor] = useState({});
  const dispatch = useDispatch();
  const normalizeGender = (gender) => (typeof gender === "string" ? gender : "unknown");

  const [form, setForm] = useState({
    userID: userID,
    name: userInfor?.user_name || "",
    email: userInfor?.user_email || "",
    birthday: userInfor?.user_birthday || "",
    phone: userInfor?.user_phone || "",
    avatar: userInfor?.user_avatar || "",
    gender: normalizeGender(userInfor?.user_gender),
  });

  const [editable, setEditable] = useState(false);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleToggleEdit = () => {
    setEditable(true);
  };

  const handleGetInfor = async () => {
    const data = await findUser(userID, dispatch);
    const birthday = data.metadata.user?.birthday;

    setUserInfor(data.metadata.user);
    setForm({
      userID: userID,
      name: data.metadata.user?.name || "",
      email: data.metadata.user?.email || "",
      birthday: birthday ? format(new Date(birthday), "dd-MM-yyyy") : "",
      phone: data.metadata.user?.phone || "",
      avatar: data.metadata.user?.avatar || "",
      gender: normalizeGender(data.metadata.user?.gender),
    });
  };

  useEffect(() => {
    handleGetInfor();
  }, []);

  const handleSubmit = async () => {
    let imageUrl = "";
    try {
      // Upload file if selected
      if (file) {
        imageUrl = await uploadImage(file, "service", dispatch);
        console.log(file);
        console.log(imageUrl);
        setForm((prev) => ({ ...prev, avatar: imageUrl.img_url }));
      }

      // Chuyển đổi ngày sinh nhập vào (dd-MM-yyyy) thành (yyyy-MM-dd)
      const birthday = form.birthday ? format(parse(form.birthday, "dd-MM-yyyy", new Date()), "yyyy-MM-dd") : "";

      // Update user information
      await updateUser(accessToken, userID, { 
        ...form, 
        avatar: imageUrl.img_url, 
        birthday: birthday, // Sử dụng ngày đã chuyển đổi
        userID: userID 
      }, dispatch, axiosJWT);
      await handleGetInfor();
      toast.success("Cập nhật thành công");
      setEditable(false);
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Thông tin tài khoản</div>

      <form className={cx("form")}>
        <div className={cx("avatar-container")}>
            <img src={form.avatar} alt="Avatar" className={cx("avatar")} />
        </div>


        <div className={cx("box")}>
          <label className={cx("label")}>Họ và tên</label>
          <input
            className={cx("input")}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>

        <div className={cx("box")}>
          <label className={cx("label")}>Email</label>
          <input
            className={cx("input")}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>

        <div className={cx("box")}>
          <label className={cx("label")}>Số điện thoại</label>
          <input
            className={cx("input")}
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>

        <div className={cx("box")}>
          <label className={cx("label")}>Ngày sinh</label>
          <DatePicker
            className={cx("input", "datepicker")}
            selected={form.birthday ? parse(form.birthday, "dd-MM-yyyy", new Date()) : null}
            onChange={(date) => setForm((prev) => ({ ...prev, birthday: format(date, "dd-MM-yyyy") }))}
            dateFormat="dd-MM-yyyy"
            disabled={!editable}
            
          />
        </div>

        {editable && 
          <div className={cx("box")}>
            <label className={cx("label")}>Avatar</label>
            {file && editable && (
              <div className={cx("avatar-container")}>
                <img src={URL.createObjectURL(file)} alt="Avatar" className={cx("preview-avatar")} />
              </div>
            )
            }

            {editable && (
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            )}
          </div>
        }

        <div className={cx("box")}>
          <label className={cx("label")}>Giới tính</label>
          <select
            className={cx("input")}
            name="gender"
            value={form.gender}
            onChange={handleChange}
            disabled={!editable}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="unknown">Không rõ</option>
          </select>
        </div>
      
        <div className={cx("box")}>
          <button
            className={cx("submit-button")}
            type="button"
            onClick={!editable ? handleToggleEdit : handleSubmit}
          >
            {!editable ? "Cập nhật" : "Lưu"}
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default Account;
