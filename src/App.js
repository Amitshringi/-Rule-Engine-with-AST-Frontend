import { useState, useEffect } from "react";
import "./App.css";
import RuleForm from "./components/RuleForm";
import RuleList from "./components/RuleList";

function App() {
  const [rules, setRules] = useState([]);
  const [combinedAST, setCombinedAST] = useState(null);
  const [data, setData] = useState({});
  const [evaluationResult, setEvaluationResult] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state

  // Fetch existing rules from the backend
  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/rules/");
        if (!response.ok) {
          throw new Error("Failed to fetch rules");
        }
        const data = await response.json();
        setRules(data);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  // Add new rule to the list
  const addRule = async (ruleName, ruleString) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/rules/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: ruleName, ruleString }),
      });
      if (!response.ok) {
        throw new Error("Failed to add rule");
      }
      const newRule = await response.json();
      setRules([...rules, newRule]);
      alert("Succfully Rule Added");
      window.location.reload();
    } catch (error) {
      console.error("Error adding rule:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combine multiple rules
  const combineRules = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/rules/combine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });

      const combined = await response.json();
      if (!combined.ok) {
        console.log("response", combined);
        alert(combined.error);
        throw new Error("Failed to combine rules");
      }
      setCombinedAST(combined);
      alert("All rules are combined");
      window.location.reload();
    } catch (error) {
      console.error("Error combining rules:", error);
    } finally {
      setLoading(false);
    }
  };

  // Evaluate the rule AST with user data
  const evaluateRule = async (ruleName, jsonData) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/rules/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleName, jsonData: data }),
      });

      const result = await response.json();

      setEvaluationResult(result.data);
      alert(`Evaluation Result is  ${result.data}`);

      // setCombinedAST(null); // Clear combined AST after evaluation
    } catch (error) {
      console.error("Error evaluating rule:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Evaluation Result", evaluationResult);

  return (
    <div className="App">
      <h1>Rule Engine With AST</h1>

      {/* Loading indicator */}
      {loading && <p>Loading...</p>}

      {/* Rule Form Component */}
      <RuleForm
        addRule={addRule}
        combineRules={combineRules}
        setData={setData}
        evaluateRule={evaluateRule}
      />

      {/* Rule List Component */}
      <RuleList rules={rules} />

      {/* Display Combined AST */}
      {combinedAST && (
        <div>
          <h2>Combined AST:</h2>
          <pre>{JSON.stringify(combinedAST, null, 2)}</pre>
        </div>
      )}

      {/* Display Evaluation Result */}

      {/* <div>
          <h2>Evaluation Result: {evaluationResult}</h2>
        </div> */}
    </div>
  );
}

export default App;
