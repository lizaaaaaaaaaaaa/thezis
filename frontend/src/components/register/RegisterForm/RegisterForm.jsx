import React, { useState } from "react";
import styles from "./RegisterForm.module.scss";
import Loader from "../../UI/Loader/Loader";
import { registerSchema } from "../../../helpers/validation/profileFields";
import { useNavigate } from "react-router-dom";
import passwordVisible from "../../../assets/svg/password-show.svg";
import passwordInvisible from "../../../assets/svg/password-hide.svg";

const RegisterForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const changePasswordVisibility = (e) => {
    e.preventDefault();
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { error } = registerSchema.validate({ name, email, password });
    if (error) {
      setErrorMessage(error.details[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Помилка реєстрації");
      } else {
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userData", JSON.stringify({ name, email }));
        navigate("/profile");
      }
    } catch (err) {
      navigate("/error", {
        state: {
          message: "Не вдалося завершити реєстрацію. Сервер недоступний.",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.register__form} onSubmit={handleSubmit}>
      {isLoading && (
        <div className={styles.register__loader}>
          <Loader />
        </div>
      )}
      <div className={styles.register__inputs}>
        <input
          type="text"
          placeholder="Імʼя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <div className={styles.register__password}>
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
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
        </div>
      </div>

      {errorMessage && <p className={styles.register__error}>{errorMessage}</p>}

      <button type="submit" disabled={isLoading}>
        Зареєструватися
      </button>
    </form>
  );
};

export default RegisterForm;
