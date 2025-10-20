import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 p-4 border-r">
      <nav className="flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 rounded-md bg-red-600 text-white"
        >
          <span>HOME</span>
        </Link>
        <Link
          to="/mayors-desk"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>MAYOR'S DESK</span>
        </Link>
        <Link
          to="/government"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>GOVERNMENT</span>
        </Link>
        <Link
          to="/city-programs"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>CITY PROGRAMS</span>
        </Link>
        <Link
          to="/qc-e-services"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>QC E-SERVICES</span>
        </Link>
        <Link
          to="/public-notices"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>PUBLIC NOTICES</span>
        </Link>
        <Link
          to="/media"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>MEDIA</span>
        </Link>
        <Link
          to="/peoples-corner"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>PEOPLE'S CORNER</span>
        </Link>
        <Link
          to="/qc-gov-faqs"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>QC GOV FAQS</span>
        </Link>
        <Link
          to="/calendar"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>CALENDAR</span>
        </Link>
        <Link
          to="/places-to-visit"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>PLACES TO VISIT</span>
        </Link>
        <Link
          to="/careers"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>CAREERS</span>
        </Link>
        <Link
          to="/about-qc"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
        >
          <span>ABOUT QC</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;