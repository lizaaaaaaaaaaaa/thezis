const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let serviceAccount;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_CONTENT) {
  serviceAccount = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_CONTENT
  );
} else {
  serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://thesis-cddf6-default-rtdb.firebaseio.com/",
});

const db = admin.database();
const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/products", async (req, res) => {
  try {
    const product = req.body;

    const newRef = db.ref("products").push();
    await newRef.set({
      name: product.name,
      brand: product.brand,
      volume: product.volume,
      age: product.age,
      skinTypes: product.skinTypes,
      effects: product.effects,
      composition: product.composition,
      description: product.description,
      activeIngredients: product.activeIngredients,
      image: product.image,
      link: product.link,
    });
    res.status(201).send({
      message: "Product saved successfully",
      id: newRef.key,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/api/ingredients", async (req, res) => {
  try {
    const ingredient = req.body;

    const newRef = db.ref("ingredients").push();
    await newRef.set({
      name: ingredient.name,
      safetyRating: ingredient.safetyRating,
      comedogenicRating: ingredient.comedogenicRating,
      isAllergen: ingredient.isAllergen,
      allergenType: ingredient.allergenType,
      function: ingredient.function,
      description: ingredient.description,
    });

    res.status(201).send({
      message: "Ingredient saved successfully",
      id: newRef.key,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const snapshot = await db.ref("products").once("value");
    const data = snapshot.val();
    if (!data) {
      return res.status(200).send([]);
    }
    const products = Object.entries(data).map(([id, product]) => ({
      id,
      ...product,
    }));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/ingredients", async (req, res) => {
  try {
    const snapshot = await db.ref("ingredients").once("value");

    if (!snapshot.exists()) {
      return res
        .status(404)
        .send({ error: "Інгредієнти не знайдені в базі даних" });
    }

    const data = snapshot.val();
    const ingredients = Object.entries(data).map(([id, ing]) => ({
      id,
      ...ing,
    }));

    res.status(200).send(ingredients);
  } catch (error) {
    res.status(500).send({ error: "Внутрішня помилка сервера" });
  }
});

app.get("/api/ingredients/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const snapshot = await db.ref("ingredients").once("value");

    if (!snapshot.exists()) {
      return res
        .status(404)
        .send({ error: "Інгредієнти не знайдені в базі даних" });
    }

    const ingredients = snapshot.val();

    const filteredIngredients = Object.values(ingredients).filter(
      (ingredient) => ingredient.name.toLowerCase().includes(name.toLowerCase())
    );

    if (filteredIngredients.length === 0) {
      return res
        .status(404)
        .send({ error: `Інгредієнт з назвою ${name} не знайдений` });
    }
    res.status(200).send(filteredIngredients);
  } catch (error) {
    console.error("Помилка при отриманні інгредієнтів:", error);
    res.status(500).send({ error: "Внутрішня помилка сервера" });
  }
});

app.get("/api/ingredients/function/:function", async (req, res) => {
  const { function: func } = req.params; // Отримуємо функцію інгредієнта для пошуку
  console.log(`Запит на інгредієнти з функцією: ${func}`);

  try {
    const snapshot = await db.ref("ingredients").once("value");

    if (!snapshot.exists()) {
      return res
        .status(404)
        .send({ error: "Інгредієнти не знайдені в базі даних" });
    }

    const ingredients = snapshot.val();
    const filteredIngredients = Object.values(ingredients).filter(
      (ingredient) =>
        ingredient.function.some((item) =>
          item.toLowerCase().includes(func.toLowerCase())
        )
    );

    if (filteredIngredients.length === 0) {
      return res
        .status(404)
        .send({ error: `Інгредієнти з функцією ${func} не знайдені` });
    }

    res.status(200).send(filteredIngredients);
  } catch (error) {
    console.error("Помилка при отриманні інгредієнтів:", error);
    res.status(500).send({ error: "Внутрішня помилка сервера" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params; // Отримуємо ID інгредієнта з URL

  try {
    const snapshot = await db.ref("products").child(id).once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: `Product з ID ${id} не знайдений` });
    }

    const product = snapshot.val(); // Отримуємо дані конкретного інгредієнта

    res.status(200).send({ id, ...product }); // Повертаємо дані інгредієнта
  } catch (error) {
    console.error("Помилка при отриманні product:", error);
    res.status(500).send({ error: "Внутрішня помилка сервера" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db.ref("users").once("value");
    const users = snapshot.val();

    for (const uid in users) {
      const user = users[uid];
      if (user.email === email) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return res
            .status(200)
            .send({ success: true, userId: uid, user: user });
        } else {
          return res.status(401).send({ error: "Неправильний пароль" });
        }
      }
    }

    res.status(404).send({ error: "Користувача з таким email не знайдено" });
  } catch (err) {
    res.status(500).send({ error: "Помилка сервера", details: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send({ error: "Email і пароль є обов’язковими" });
  }

  try {
    const snapshot = await db.ref("users").once("value");
    const users = snapshot.val();

    const emailExists = Object.values(users || {}).some(
      (user) => user.email === email
    );

    if (emailExists) {
      return res.status(409).send({ error: "Такий email вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // хешування

    const newUserRef = db.ref("users").push();
    await newUserRef.set({
      email,
      name: name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    res.status(201).send({
      message: "Користувач зареєстрований успішно",
      id: newUserRef.key,
    });
  } catch (err) {
    res.status(500).send({ error: "Помилка сервера", details: err.message });
  }
});

app.patch("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const userRef = db.ref(`users/${id}`);
    const snapshot = await userRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Користувач не знайдений" });
    }

    const userData = snapshot.val();

    if (updates.newComposition) {
      const existing = userData.savedCompositions || [];
      const updated = [...existing, updates.newComposition];

      await userRef.update({ savedCompositions: updated });

      return res.status(200).send({
        message: "Склад додано",
        savedCompositions: updated,
      });
    }

    if (Array.isArray(updates.savedCompositions)) {
      // Оновлення всієї колекції через set (перезапис повністю)
      await userRef.child("savedCompositions").set(updates.savedCompositions);

      return res.status(200).send({
        message: "Склади оновлено",
        savedCompositions: updates.savedCompositions,
      });
    }

    await userRef.update(updates);
    res.status(200).send({ message: "Дані оновлено успішно" });
  } catch (err) {
    res.status(500).send({ error: "Помилка сервера", details: err.message });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (Array.isArray(updates.effects)) {
    updates.effects = updates.effects.map((x) =>
      typeof x === "string"
        ? x.replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "").trim()
        : x
    );
  }

  try {
    const ref = db.ref(`products/${id}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Продукт не знайдено" });
    }

    await ref.update(updates);
    res.status(200).send({ message: "Продукт оновлено успішно" });
  } catch (err) {
    res.status(500).send({ error: "Помилка сервера", details: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ref = db.ref(`products/${id}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Продукт не знайдено" });
    }

    await ref.remove();
    res.status(200).send({ message: "Продукт видалено успішно" });
  } catch (err) {
    res.status(500).send({ error: "Помилка сервера", details: err.message });
  }
});

app.patch("/api/ingredients/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const ref = db.ref(`ingredients/${id}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Інгредієнт не знайдено" });
    }

    await ref.update(updates);
    res.status(200).send({ message: "Інгредієнт оновлено успішно" });
  } catch (err) {
    res.status(500).send({ error: "Помилка сервера", details: err.message });
  }
});

app.delete("/api/ingredients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ref = db.ref(`ingredients/${id}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Інгредієнт не знайдено" });
    }

    await ref.remove();
    res.status(200).send({ message: "Інгредієнт видалено успішно" });
  } catch (err) {
    res.status(500).send({ error: "Помилка сервера", details: err.message });
  }
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
