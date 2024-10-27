import React, { useState, useEffect } from "react";
import axios from "axios";

const RuleForm = ({ addRule, combineRules, setData, evaluateRule }) => {
  const [ruleName, setRuleName] = useState("");
  const [ruleString, setRuleString] = useState("");
  const [inputData, setInputData] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [ruleNames, setRuleNames] = useState([]);
  const [selectedRule, setSelectedRule] = useState("");

  // Fetch rule names on component mount
  useEffect(() => {
    const fetchRuleNames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/rules/names"
        );
        console.log("Fetched Rule Names:", response.data);
        setRuleNames(response.data);
      } catch (error) {
        console.error("Failed to fetch rule names:", error);
      }
    };
    fetchRuleNames();
  }, []);

  const isValidInput = () => {
    if (!ruleName.trim() || !ruleString.trim()) {
      alert("Please enter both a rule name and rule string.");
      return false;
    }
    return true;
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (isValidInput()) {
      addRule(ruleName, ruleString);
      setRuleName("");
      setRuleString("");
    }
  };

  const handleCombineRules = () => {
    combineRules();
  };

  const handleDataChange = (e) => {
    setInputData(e.target.value);
    setSubmitted(false);
  };

  const handleEvaluateRule = (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const parsedData = JSON.parse(inputData);
      setData(parsedData);
      setJsonError(null);
    } catch (error) {
      setJsonError("Invalid JSON format. Please correct it.");
      return;
    }

    if (!inputData.trim() || !selectedRule) {
      alert("Please select a rule and provide input data for evaluation.");
      return;
    }

    evaluateRule(selectedRule, inputData);
    setInputData("");
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Rule Management
      </h2>

      <form onSubmit={handleAddRule} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="ruleName" style={{ fontWeight: "bold" }}>
            Rule Name:
          </label>
          <input
            id="ruleName"
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="Enter Rule Name"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="ruleString" style={{ fontWeight: "bold" }}>
            Rule String:
          </label>
          <input
            id="ruleString"
            type="text"
            value={ruleString}
            onChange={(e) => setRuleString(e.target.value)}
            placeholder="Enter Rule String"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Rule
        </button>
      </form>

      <button
        onClick={handleCombineRules}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Combine All Rules
      </button>

      <form onSubmit={handleEvaluateRule}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="ruleSelect" style={{ fontWeight: "bold" }}>
            Select Rule for Evaluation:
          </label>
          <select
            id="ruleSelect"
            value={selectedRule}
            onChange={(e) => setSelectedRule(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">--Select Rule--</option>
            {ruleNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="jsonData" style={{ fontWeight: "bold" }}>
            JSON Data for Evaluation:
          </label>
          <textarea
            id="jsonData"
            value={inputData}
            onChange={handleDataChange}
            placeholder="Enter JSON data for evaluation"
            rows="5"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {submitted && jsonError && (
          <p style={{ color: "red", fontStyle: "italic" }}>{jsonError}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#17a2b8",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Evaluate Rule
        </button>
      </form>
    </div>
  );
};

export default RuleForm;
