import React, { useState, useEffect } from "react";

const ConsentForm = ({ consentUrl, onConsentApproved }) => {
    useEffect(() => {
        const handleIframeMessage = async (event) => {
            console.log("Received message from iframe:", event.data);
            if (event.data?.status === "SUCCESS") {
                console.log("Consent approved. Fetching CIBIL data...");
                onConsentApproved(); // Call API after consent approval
            }
        };

        window.addEventListener("message", handleIframeMessage);
        return () => window.removeEventListener("message", handleIframeMessage);
    }, [onConsentApproved]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-50">
            <iframe
                src={consentUrl}
                title="Consent Form"
                className="w-full h-full border-none"
            ></iframe>
        </div>
    );
};

const CIBILReportComponent = () => {
    const [panCard, setPanCard] = useState("");
    const [cibilData, setCibilData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [consentUrl, setConsentUrl] = useState("");

    const fetchCIBILReport = async () => {
        setLoading(true);
        setCibilData(null);
        setConsentUrl("");

        try {
            console.log("Fetching CIBIL report for PAN:", panCard);

            const response = await fetch("http://127.0.0.1:7843/getcibilscore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pan: panCard }),
            });

            const data = await response.json();
            console.log("Response received:", data);

            if (data.consentUrl1) {
                console.log("Opening consent form...");
                setConsentUrl(data.consentUrl1);
            } else {
                console.log("CIBIL data received:", data);
                setCibilData(data);
            }
        } catch (error) {
            console.error("Error fetching CIBIL report:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCIBILAfterConsent = async () => {
        setConsentUrl(""); // Close iframe

        try {
            console.log("Fetching CIBIL data after consent approval...");

            const response = await fetch("http://127.0.0.1:7843/getcibilscoreafterverification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pan: panCard }),
            });

            const data = await response.json();
            console.log("Final CIBIL data received:", data);
            setCibilData(data);
        } catch (error) {
            console.error("Error verifying consent:", error);
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <div className="bg-white shadow-lg rounded p-6 w-96 border border-black">
                <h2 className="text-2xl font-bold mb-4">Fetch CIBIL Report</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">PAN Number:</label>
                    <input
                        type="text"
                        placeholder="Enter PAN Number"
                        value={panCard}
                        onChange={(e) => setPanCard(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    onClick={fetchCIBILReport}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Fetch Report"}
                </button>
            </div>

            {/* Show ConsentForm if consentUrl exists */}
            {consentUrl && <ConsentForm consentUrl={consentUrl} onConsentApproved={fetchCIBILAfterConsent} />}

            {/* Show CIBIL Data */}
            {cibilData && (
                <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded w-96">
                    <h3 className="text-lg font-semibold">CIBIL Data</h3>
                    <pre className="text-sm text-gray-800">{JSON.stringify(cibilData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default CIBILReportComponent;
