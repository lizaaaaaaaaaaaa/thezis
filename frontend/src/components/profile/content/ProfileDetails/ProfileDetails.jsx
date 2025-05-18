import React, { useEffect, useState } from "react";
import styles from "./ProfileDetails.module.scss";
import AdminLinks from "./AdminLinks/AdminLinks";
import AdminDashboard from "../../../../admin/dashboard/AdminDashBoard";
import UserStats from "./UserStats/UserStats";

const ProfileDetails = () => {
  const userId = localStorage.getItem("userId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser(storedUser);
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = { name, email };
    if (password) updates.password = password;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Дані оновлено успішно!");
        const updatedUser = { ...user, ...updates };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Помилка оновлення. Дані не було збережено.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("Помилка з'єднання з сервером");
    }
  };

  return (
    <section className={styles.profile__details}>
      <h1>Персональний кабінет</h1>
      <h3>{user?.name ? `З поверненням, ${user.name}!` : "З поверненням!"}</h3>
      <form onSubmit={handleSubmit} className={styles.profile__form}>
        <div>
          <label htmlFor="username">Імʼя</label>
          <input
            id="username"
            name="username"
            type="text"
            value={name}
            autoComplete="username"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="newPassword">Новий пароль</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Зберегти</button>

        {message && (
          <p
            className={`${styles.profile__message} ${
              message === "Дані оновлено успішно!" &&
              styles["profile__message-good"]
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <UserStats />

      {user?.accessType === "admin" && (
        <div>
          <AdminLinks />
          <AdminDashboard />
        </div>
      )}
    </section>
  );
};

export default ProfileDetails;
