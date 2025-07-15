import { useState } from "react";
import axios from "axios";
// import { Log } from "../../loggingMiddleware/logger.js";

function App() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/shorturls", {
        url,
        validity: validity ? parseInt(validity) : undefined,
        shortcode: shortcode || undefined,
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      // await Log(
      //   "frontend",
      //   "error",
      //   "api",
      //   "Creating url failed."
      // );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4 text-center">
          URL Shortener
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">URL </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="https://something.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Validity (in numbers)</label>
            <input
              type="number"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              min="1"
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">
              Custom Shortcode (optional)
            </label>
            <input
              type="text"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              maxLength={10}
              pattern="[a-zA-Z0-9]{1,10}"
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="e.g. mycode123"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded text-sm disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && (
          <div className="text-red-600 text-sm mt-4 text-center">{error}</div>
        )}

        {result && (
          <div className="mt-4 p-3 border rounded text-sm text-center">
            <p className="font-medium">Shortlink:</p>
            <a
              href={result.shortlink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {result.shortlink}
            </a>
            <p className="mt-1 text-gray-600">
              Expires at: {new Date(result.expiry).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
