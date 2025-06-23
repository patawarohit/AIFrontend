import { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setStory('');

    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/complete/',
        { prompt },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setStory(data.response);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>AI Story Generator</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Write Story Topic Here"
          rows={4}
          style={styles.textarea}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Generating…' : 'Generate Story'}
        </button>
      </form>

      {error && <p style={styles.error}>Error: {error}</p>}
      {story && (
        <>
          <h2>Your Story</h2>
          <p style={styles.story}>{story}</p>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '2rem auto',
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  textarea: {
    padding: '0.5rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: 'crimson',
  },
  story: {
    whiteSpace: 'pre-wrap',
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: 4,
  }
};

export default App;
