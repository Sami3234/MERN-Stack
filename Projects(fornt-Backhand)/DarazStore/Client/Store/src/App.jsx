import { useState, useEffect } from "react";
import AddProduct from "./components/AddProduct";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleAdd = (product) => {
    setProducts([...products, product]);
  };

  return (
    <div className="container">
      <h1>Store App</h1>
      <AddProduct onAdd={handleAdd} />
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} - Rs {p.price} x {p.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
