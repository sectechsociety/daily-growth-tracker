// src/components/MapNode.jsx
import React, { useState } from 'react';
import '../DailyProgressMap.css'; // Adjust path if CSS is elsewhere

const MapNode = ({
  id,
  label,
  icon,
  details,
  position,
  isCompleted,
  onToggleComplete,
  onDetailChange,
  children
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`map-node ${isCompleted ? '' : 'inactive'}`}
      style={{ top: position.y, left: position.x }}
      onClick={() => onToggleComplete(id)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="node-icon">{icon}</div>
      <div className="node-label">{label}</div>
      {details && <div className="node-details">{details}</div>}
      {children}

      {showTooltip && (
        <div className="tooltip" style={{ top: position.y - 40, left: position.x + 60 }}>
          Click to {isCompleted ? 'mark incomplete' : 'mark complete'}
          {id === 'eat' && (
            <div>
              <input
                type="number"
                placeholder="Calories"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onDetailChange(id, 'calorieCount', e.target.value)}
                style={{ width: '80px', marginTop: '5px' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapNode;