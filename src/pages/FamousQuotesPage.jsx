import React, { useState, useEffect } from 'react';
import { api } from '../api';

export function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadAllQuotes();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [selectedCategory, quotes]);

  async function loadAllQuotes() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getQuotes();
      const quotesList = data.quotes || [];
      setQuotes(quotesList);

      if (quotesList.length > 0) {
        const uniqueCategories = [...new Set(quotesList.map(q => q.category))];
        setCategories(uniqueCategories.sort());
      }
    } catch (err) {
      setError(err.message || 'Failed to load quotes');
      console.error('Error loading quotes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function filterQuotes() {
    if (selectedCategory === 'all') {
      setFilteredQuotes(quotes);
    } else {
      try {
        const data = await api.getQuotesByCategory(selectedCategory);
        setFilteredQuotes(data.quotes || []);
      } catch (err) {
        console.error('Error filtering quotes:', err);
        setFilteredQuotes([]);
      }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading quotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Inspirational Quotes
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Words of wisdom to inspire your journey
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        justifyContent: 'center',
        marginBottom: '3rem'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '0.5rem 1.25rem',
            background: selectedCategory === 'all' ? '#6366f1' : '#f3f4f6',
            color: selectedCategory === 'all' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '1rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.95rem',
            transition: 'all 0.3s'
          }}
        >
          All ({quotes.length})
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.5rem 1.25rem',
              background: selectedCategory === category ? '#6366f1' : '#f3f4f6',
              color: selectedCategory === category ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '1rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Quotes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map(quote => (
            <div
              key={quote.id}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                padding: '2rem',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{ fontSize: '3rem', color: '#6366f1', opacity: '0.2', marginBottom: '1rem' }}>
                "
              </div>
              <p style={{
                fontSize: '1.1rem',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
                lineHeight: '1.8'
              }}>
                {quote.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  {quote.author
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p style={{ fontWeight: '600', margin: '0' }}>{quote.author}</p>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: '0', textTransform: 'capitalize' }}>
                    {quote.category}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#999' }}>
            No quotes found for this category
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6366f1' }}>{quotes.length}</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Total Quotes</div>
        </div>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6366f1' }}>{categories.length}</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Categories</div>
        </div>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6366f1' }}>{filteredQuotes.length}</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Showing</div>
        </div>
      </div>
    </div>
  );
}

export default QuotesPage;