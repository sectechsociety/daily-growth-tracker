// src/components/DailyProgressMap.jsx
import React, { useState } from 'react';
import MapNode from './MapNode'; // Correct: MapNode is in the same 'components' folder
import '../DailyProgressMap.css'; // Correct: Assuming CSS is in src/

// Import react-icons (make sure you've installed it: npm install react-icons)
import {
  FaBed,
  FaUtensils,
  FaLaptopCode,
  FaDumbbell,
  FaBrain,
  FaPray,
  FaSoap,
  FaQuoteLeft,
} from 'react-icons/fa';

const DailyProgressMap = () => {
  const [activities, setActivities] = useState([
    { id: 'sleep', label: 'Sleep', icon: <FaBed />, details: '7-9 hours', position: { x: 100, y: 150 }, isCompleted: false },
    { id: 'eat', label: 'Eat', icon: <FaUtensils />, details: 'Calorie Count', position: { x: 250, y: 50 }, isCompleted: false, data: { calorieCount: 0 } },
    { id: 'work', label: 'Work/Study', icon: <FaLaptopCode />, details: 'Coding/Books/Review Mail', position: { x: 450, y: 150 }, isCompleted: false },
    { id: 'workout', label: 'Workout', icon: <FaDumbbell />, details: 'Gym, Yoga, etc.', position: { x: 650, y: 50 }, isCompleted: false },
    { id: 'aptitude', label: 'Solve Aptitude', icon: <FaBrain />, details: 'One question per day', position: { x: 800, y: 250 }, isCompleted: false },
    { id: 'pray', label: 'Pray', icon: <FaPray />, details: 'Spiritual practice', position: { x: 650, y: 450 }, isCompleted: false },
    { id: 'hygiene', label: 'Hygiene', icon: <FaSoap />, details: 'Personal care', position: { x: 450, y: 550 }, isCompleted: false },
    { id: 'quote', label: 'Positive Quote', icon: <FaQuoteLeft />, details: 'Read one daily', position: { x: 250, y: 450 }, isCompleted: false },
  ]);

  const handleToggleComplete = (id) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id ? { ...activity, isCompleted: !activity.isCompleted } : activity
      )
    );
  };

  const handleDetailChange = (id, key, value) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id ? { ...activity, data: { ...activity.data, [key]: value } } : activity
      )
    );
  };

  const renderConnectionLines = () => {
    const connectionOrder = [
      'sleep', 'eat', 'work', 'workout', 'aptitude', 'pray', 'hygiene', 'quote', 'sleep'
    ];

    const paths = [];
    for (let i = 0; i < connectionOrder.length - 1; i++) {
      const startNodeId = connectionOrder[i];
      const endNodeId = connectionOrder[i + 1];

      const startNode = activities.find(a => a.id === startNodeId);
      const endNode = activities.find(a => a.id === endNodeId);

      if (startNode && endNode) {
        const startX = start