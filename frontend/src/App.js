import { useEffect, useState } from "react";
import "./App.css";

const API_BASE =
  "https://sxijzgpe3x765rzfbphu3bjoci0zwmxf.lambda-url.ap-south-1.on.aws";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load todos
  useEffect(() => {
    fetch(`${API_BASE}/todos`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Add todo
  const addTodo = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const newTodo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);
      setText("");
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ✅ Delete todo (SOFT delete)
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_BASE}/todos/${id}`, {
        method: "DELETE",
      });

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>📝 Serverless Todo App</h2>

        <div className="input-group">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your task"
          />
          <button onClick={addTodo}>Add</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <span>{todo.text}</span>
                <button
                  className="delete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
