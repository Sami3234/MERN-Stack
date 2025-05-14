import { useState } from "react";
import axios from "axios";

function AddProduct({ onAdd }) {
  const [product, setProduct] = useState({ name: "", price: "", quantity: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/products", product);
    onAdd(res.data);
    setProduct({ name: "", price: "", quantity: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        placeholder="Product Name"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <input
        className="input"
        type="number"
        placeholder="Price"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />
      <input
        className="input"
        type="number"
        placeholder="Quantity"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
      />
      <button className="button" type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct;
