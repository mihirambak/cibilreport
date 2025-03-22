import React, { useState } from "react";
import PanForm from "../components/PanForm";

const Home = () => {
  const [cibilScore, setCibilScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetCibil = async (pan) => {
    try {
      setLoading(true);
      setError("");
      // Clear previous score when attempting a new request
      setCibilScore(null);
      
      const response = await fetch("http://127.0.0.1:7843/getcibilscore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pan }),
      });
      
      const data = await response.json();
      setLoading(false);
      
      if (response.ok) {
        setCibilScore(data.cibilScore);
      } else {
        setError(data.error || "Incorrect PAN number");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <h1 className="text-white text-4xl font-bold mb-8">Check Your CIBIL Score</h1>
      <PanForm onGetCibil={handleGetCibil} />
      
      {loading && <p className="text-white mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {cibilScore && (
        <p className="text-white text-2xl mt-4">Your CIBIL Score: {cibilScore}</p>
      )}
    </div>
  );
};

export default Home;


// import React, { useState } from "react";

// const PanForm = ({ onGetCibil }) => {
//   const [pan, setPan] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onGetCibil(pan);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
//       <input
//         type="text"
//         placeholder="Enter your PAN number"
//         value={pan}
//         onChange={(e) => setPan(e.target.value)}
//         className="w-80 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
//         required
//       />
//       <button
//         type="submit"
//         className="w-32 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
//       >
//         Get CIBIL
//       </button>
//     </form>
//   );
// };

// export default PanForm;
