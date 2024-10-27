import React from 'react';

const RuleList = ({ rules }) => {
  return (
    <div>
      <h2>Rules List:</h2>
      {rules.length > 0 ? (
        <ul>
          {rules.map((rule, index) => (
            <li key={index}>
              <strong>Rule Name:</strong> {rule.rule_name} <br />
              <strong>AST:</strong> {JSON.stringify(rule, null, 2)} {/* Pretty-printing the ATS object */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rules available.</p> // Display message if no rules exist
      )}
    </div>
  );
};

export default RuleList;
