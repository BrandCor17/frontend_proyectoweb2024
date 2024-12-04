import React from 'react';
import './EventItem.css'
const EventItem = ({ event }) => {
  return (
    <li className="event-item">
  <h3>{event.title}</h3>
  <p>
    <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
  </p>
  <p>{event.description}</p>
</li>

  );
};

export default EventItem;
