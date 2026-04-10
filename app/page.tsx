"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  quantity: number;
  expiryDate: string;
};

type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
};

const recipeDatabase: Recipe[] = [
  { id: 1, name: "雞肉炒蛋", ingredients: ["雞胸肉", "雞蛋"] },
  { id: 2, name: "菠菜炒蛋", ingredients: ["菠菜", "雞蛋"] },
  { id: 3, name: "奶油雞肉飯", ingredients: ["雞胸肉", "牛奶"] },
  { id: 4, name: "菇菇炒雞肉", ingredients: ["雞胸肉", "杏鮑菇"] },
];

export default function Page() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "雞胸肉", quantity: 2, expiryDate: "2026-04-15" },
    { id: 2, name: "雞蛋", quantity: 5, expiryDate: "2026-04-12" },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    expiryDate: "",
  });

  // 🔥 食譜推薦（已修好）
  const recommendedRecipes = useMemo(() => {
    return recipeDatabase
      .map((recipe) => {
        const matched = recipe.ingredients.filter((ing) =>
          items.some((item) => item.name === ing)
        );

        const missing = recipe.ingredients.filter(
          (ing) => !items.some((item) => item.name === ing)
        );

        const urgentScore = matched.filter((ing) => {
          const item = items.find((i) => i.name === ing);
          if (!item) return false;

          const diff =
            (new Date(item.expiryDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24);

          return diff <= 2;
        }).length;

        return {
          ...recipe,
          matched,
          missing,
          score: matched.length * 10 + urgentScore * 20,
        };
      })
      .filter((r) => r.matched.length > 0)
      .sort((a, b) => b.score - a.score);
  }, [items]);

  const addItem = () => {
    if (!newItem.name || !newItem.expiryDate) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        ...newItem,
      },
    ]);

    setNewItem({ name: "", quantity: 1, expiryDate: "" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🍱 食材庫存</h1>

      {/* 新增食材 */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="食材名稱"
          value={newItem.name}
          onChange={(e) =>
            setNewItem({ ...newItem, name: e.target.value })
          }
        />
        <input
          type="number"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({ ...newItem, quantity: Number(e.target.value) })
          }
        />
        <input
          type="date"
          value={newItem.expiryDate}
          onChange={(e) =>
            setNewItem({ ...newItem, expiryDate: e.target.value })
          }
        />
        <button onClick={addItem}>新增</button>
      </div>

      {/* 食材列表 */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity}（到期：{item.expiryDate}）
          </li>
        ))}
      </ul>

      <h2>🍳 推薦食譜</h2>

      {/* 食譜 */}
      <ul>
        {recommendedRecipes.map((recipe) => (
          <li key={recipe.id}>
            <strong>{recipe.name}</strong>
            <br />
            已有：{recipe.matched.join(", ") || "無"}
            <br />
            缺少：{recipe.missing.join(", ") || "無"}
          </li>
        ))}
      </ul>
    </div>
  );
}
