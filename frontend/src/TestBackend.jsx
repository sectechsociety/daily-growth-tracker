import { useState } from 'react';
import { fetchBackendStatus, createOrGetUser } from './api';

function TestBackend() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [userResponse, setUserResponse] = useState('');

  const testConnection = async () => {
    setLoading(true);
    try {
      console.log('Calling backend at: http://localhost:5000/');
      const response = await fetchBackendStatus();
      console.log('Backend response:', response);
      setStatus(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Backend error:', error);
      setStatus('Error: ' + error.message + '\n\nCheck browser console (F12) for details');
    }
    setLoading(false);
  };

  const testCreateUser = async () => {
    setLoading(true);
    try {
      console.log('Creating user via API...');
      const response = await createOrGetUser({ 
        firebaseUid: 'test-uid-123',
        email: 'test@example.com',
        name: 'Test User'
      });
      console.log('User creation response:', response);
      setUserResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('User creation error:', error);
      setUserResponse('Error: ' + error.message + '\n\nCheck browser console (F12) for details');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Backend Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Test Backend Status
        </button>
        
        <button 
          onClick={testCreateUser}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#34A853',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Test Create User
        </button>
      </div>

      {status && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          marginBottom: '10px',
        }}>
          <strong>Status:</strong>
          <pre style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>{status}</pre>
        </div>
      )}

      {userResponse && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}>
          <strong>User Response:</strong>
          <pre>{userResponse}</pre>
        </div>
      )}
    </div>
  );
}

export default TestBackend;
