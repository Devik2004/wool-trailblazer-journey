
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BarChart3, Workflow, Package, Building, Users } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-wool-cream border-b border-wool-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-wool-darkBrown text-xl font-bold">WoolTracer</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-wool-brown hover:text-wool-darkBrown border-transparent hover:border-wool-darkBrown inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/farm-registry"
                className="text-wool-brown hover:text-wool-darkBrown border-transparent hover:border-wool-darkBrown inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Building className="mr-2 h-4 w-4" />
                Farms
              </Link>
              <Link
                to="/batch-tracking"
                className="text-wool-brown hover:text-wool-darkBrown border-transparent hover:border-wool-darkBrown inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Package className="mr-2 h-4 w-4" />
                Batches
              </Link>
              <Link
                to="/supply-chain"
                className="text-wool-brown hover:text-wool-darkBrown border-transparent hover:border-wool-darkBrown inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Workflow className="mr-2 h-4 w-4" />
                Supply Chain
              </Link>
              <Link
                to="/analytics"
                className="text-wool-brown hover:text-wool-darkBrown border-transparent hover:border-wool-darkBrown inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                Partners
              </Link>
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-wool-brown hover:text-wool-darkBrown hover:bg-wool-beige focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-wool-brown hover:bg-wool-beige block pl-3 pr-4 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              <BarChart3 className="inline-block mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/farm-registry"
              className="text-wool-brown hover:bg-wool-beige block pl-3 pr-4 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              <Building className="inline-block mr-2 h-4 w-4" />
              Farms
            </Link>
            <Link
              to="/batch-tracking"
              className="text-wool-brown hover:bg-wool-beige block pl-3 pr-4 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              <Package className="inline-block mr-2 h-4 w-4" />
              Batches
            </Link>
            <Link
              to="/supply-chain"
              className="text-wool-brown hover:bg-wool-beige block pl-3 pr-4 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              <Workflow className="inline-block mr-2 h-4 w-4" />
              Supply Chain
            </Link>
            <Link
              to="/analytics"
              className="text-wool-brown hover:bg-wool-beige block pl-3 pr-4 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              <Users className="inline-block mr-2 h-4 w-4" />
              Partners
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
