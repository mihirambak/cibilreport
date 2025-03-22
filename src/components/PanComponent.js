import React, { useState, useEffect } from "react";

const ConsentForm = ({ consentUrl, onClose, setCibilData ,panCard}) => {
    useEffect(() => {
        const handleIframeMessage = async (event) => {
            console.log("Received message from iframe:", event.data);
            if (event.data?.status === "SUCCESS") {
                console.log("Consent form submitted successfully. Fetching CIBIL data...");
                onClose(); // Close the consent form

                try {

                    const response = await fetch(
                        "https://apis.ambak.com/central-service/cibil/verifyDirectConsent",
                        {
                            method: "POST",
                            headers: {
                                "apikey": "AMBAK-CENT-SERVICE-83MPHT-ANIL1990-AMBK",
                                "cache-control": "no-cache",
                                "content-type": "application/json"
                            },
                            body: JSON.stringify({
                                pan_card: panCard, // Assuming pan_card comes in event
                                mobile: "6388740951",
                                partner_id: "10151",
                                report_type:
                                    "report_summary,enquiry_details,loan_accounts,credit_utilization_details,payment_history,payment_history_details,credit_age",
                            }),
                        }
                    );

                    const data = await response.json();
                    console.log("helllkjfdlkjflkdsjfljslf",panCard)
                    console.log("Final CIBIL data received:", data);
                    setCibilData(data); // Update the state with the final CIBIL data
                } catch (error) {
                    console.error("Error verifying consent:", error);
                }
            }
        };

        window.addEventListener("message", handleIframeMessage);
        return () => {
            window.removeEventListener("message", handleIframeMessage);
        };
    }, [onClose, setCibilData]);

    return (
        <div className="ml-6 w-[600px]">
            <h3 className="text-xl font-semibold">Please Provide Consent</h3>
            <iframe
                src={consentUrl}
                title="Consent Form"
                className="w-[600px] h-[300px] border border-black rounded-md"
            ></iframe>
        </div>
    );
};

const CIBILReportComponent = () => {
    const [panCard, setPanCardNo] = useState("");
    const [cibilData, setCibilData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [consentUrl, setConsentUrl] = useState("");

    const fetchCIBILReport = async () => {
        try {
            setLoading(true);
            console.log("Fetching CIBIL report for PAN:", panCard);

            const response = await fetch(
                "https://apis.ambak.com/central-service/cibil/getDirectCibil",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        apiKey: "AMBAK-CENT-SERVICE-83MPHT-ANIL1990-AMBK",
                    },
                    body: JSON.stringify({
                        pan_card: panCard,
                        mobile: "6388740951",
                        partner_id: "10151",
                        partner_name: "Aqib Siddiqui",
                        user_id: "85",
                    }),
                }
            );

            const data = await response.json();
            console.log("Response received:", data);

            if (data.status === 200 && data.data?.consign_url) {
                console.log("Consent URL received, opening consent form...");
                setConsentUrl(data.data.consign_url);
            } else {
                console.log("CIBIL data received directly:", data);
                setCibilData(data);
            }
        } catch (error) {
            console.error("Error fetching CIBIL report:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-between items-start p-6">
            <div className="bg-white shadow-lg rounded p-6 w-96 border border-black rounded-md">
                <h2 className="text-2xl font-bold mb-4">Fetch CIBIL Report</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">PAN Number:</label>
                    <input
                        type="text"
                        placeholder="Enter PAN Number"
                        value={panCard}
                        onChange={(e) => setPanCardNo(e.target.value)}
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

            {/* Render ConsentForm if consentUrl exists */}
            {consentUrl && (
                <ConsentForm
                consentUrl={consentUrl}
                onClose={() => setConsentUrl("")}
                setCibilData={setCibilData}
                panCard={panCard}  
            />
            )}

            {/* Print CIBIL data when available */}
            {cibilData && (
                <div className="ml-6 p-4 bg-gray-100 border border-gray-300 rounded">
                    <h3 className="text-lg font-semibold">CIBIL Data</h3>
                    <pre className="text-sm text-gray-800">{JSON.stringify(cibilData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default CIBILReportComponent;
