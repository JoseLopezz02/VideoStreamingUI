import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-10">
      <input
        type="text"
        placeholder="Search..."
        className="w-3/4 p-3 border rounded-lg shadow-md text-lg"
      />
      <Link to="/trending" className="mt-4">
        <Button>Trendy Videos</Button>
      </Link>
    </div>
  );
}
