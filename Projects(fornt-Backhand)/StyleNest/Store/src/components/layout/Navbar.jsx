import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              StyleNest
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                <FaUser className="text-xl" />
              </Link>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 