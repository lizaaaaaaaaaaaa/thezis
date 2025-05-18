import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LogInForm.module.scss";
import passwordVisible from "../../../assets/svg/password-show.svg";
import passwordInvisible from "../../../assets/svg/password-hide.svg";
import { loginSchema } from "../../../helpers/validation/profileFields";
import Loader from "../../UI/Loader/Loader";

const LogInForm = ({ onLoginSuccess }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const changePasswordVisibility = (e) => {
    e.preventDefault();
    setIsPasswordVisible((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { error } = loginSchema.validate({ email, password });
    if (error) {
      setErrorMessage(error.details[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Помилка авторизації");
      } else {
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userData", JSON.stringify(data.user));
        onLoginSuccess();
        navigate("/profile");
      }
    } catch (err) {
      navigate("/error", {
        state: {
          reason:
            err.message ||
            "Сервер недоступний або відбулась помилка з'єднання.",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.header__form} onSubmit={handleLogin}>
      {isLoading && (
        <div className={styles.header__loader}>
          <Loader />
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />

      <div className={styles.header__password}>
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="current-password"
        />
        <button
          onClick={changePasswordVisibility}
          type="button"
          disabled={isLoading}
        >
          <img
            src={isPasswordVisible ? passwordVisible : passwordInvisible}
            alt="Видимість пароля"
          />
        </button>

        {errorMessage && <p className={styles.header__error}>{errorMessage}</p>}
      </div>

      <button type="submit" disabled={isLoading}>
        Увійти
      </button>
    </form>
  );
};

export default LogInForm;
