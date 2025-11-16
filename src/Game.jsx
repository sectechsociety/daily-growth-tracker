import React from 'react';

function Game() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Game page content coming soon…</h1>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#fff',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#8B7FC7',
  },
};

export default Game;
