import React, { useState } from 'react';

const FamousQuotesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('innovation');

  const quotes = [
    {
      id: 1,
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      title: "Apple Co-founder",
      category: "innovation",
      icon: "💡"
    },
    {
      id: 2,
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      title: "Apple Co-founder",
      category: "passion",
      icon: "❤️"
    },
    {
      id: 3,
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
      title: "Musician & Visionary",
      category: "wisdom",
      icon: "🎵"
    },
    {
      id: 4,
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      title: "Political Figure & Activist",
      category: "vision",
      icon: "✨"
    },
    {
      id: 5,
      text: "It's better to be a pirate than to join the Navy.",
      author: "Steve Jobs",
      title: "Apple Co-founder",
      category: "courage",
      icon: "⚓"
    },
    {
      id: 6,
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
      title: "Humorist & Writer",
      category: "perseverance",
      icon: "⏰"
    },
    {
      id: 7,
      text: "The only thing we have to fear is fear itself.",
      author: "Franklin D. Roosevelt",
      title: "U.S. President",
      category: "courage",
      icon: "💪"
    },
    {
      id: 8,
      text: "Success is not final, failure is not fatal.",
      author: "Winston Churchill",
      title: "British Prime Minister",
      category: "perseverance",
      icon: "🏆"
    },
    {
      id: 9,
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      title: "Disney Founder",
      category: "action",
      icon: "🎬"
    },
    {
      id: 10,
      text: "You miss 100% of the shots you don't take.",
      author: "Wayne Gretzky",
      title: "Hockey Legend",
      category: "courage",
      icon: "🎯"
    },
    {
      id: 11,
      text: "Ideas are nothing. Execution is everything.",
      author: "Mark Zuckerberg",
      title: "Facebook Founder",
      category: "execution",
      icon: "⚙️"
    },
    {
      id: 12,
      text: "Your work is going to fill a large part of your life.",
      author: "Steve Jobs",
      title: "Apple Co-founder",
      category: "passion",
      icon: "💼"
    },
    {
      id: 13,
      text: "Do something you love, and you'll never work a day in your life.",
      author: "Marc Anthony",
      title: "Entrepreneur & Speaker",
      category: "passion",
      icon: "😊"
    },
    {
      id: 14,
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
      title: "Motivational Speaker",
      category: "vision",
      icon: "🚀"
    },
    {
      id: 15,
      text: "Great things never come from comfort zones.",
      author: "Unknown",
      title: "Universal Truth",
      category: "courage",
      icon: "🌟"
    }
  ];

  const categories = [
    { id: 'innovation', label: '💡 Innovation', count: quotes.filter(q => q.category === 'innovation').length },
    { id: 'passion', label: '❤️ Passion', count: quotes.filter(q => q.category === 'passion').length },
    { id: 'wisdom', label: '🧠 Wisdom', count: quotes.filter(q => q.category === 'wisdom').length },
    { id: 'vision', label: '🎯 Vision', count: quotes.filter(q => q.category === 'vision').length },
    { id: 'courage', label: '💪 Courage', count: quotes.filter(q => q.category === 'courage').length },
    { id: 'perseverance', label: '🏆 Perseverance', count: quotes.filter(q => q.category === 'perseverance').length },
    { id: 'action', label: '⚡ Action', count: quotes.filter(q => q.category === 'action').length },
    { id: 'execution', label: '⚙️ Execution', count: quotes.filter(q => q.category === 'execution').length }
  ];

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  return (
    <div style={{ backgroundColor: '#f9fafb', paddingTop: '40px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
            💬 Famous Tech CEOs Quotes
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Inspiration and wisdom from industry leaders and visionaries
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '50px'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedCategory === 'all' ? '#3b82f6' : '#e5e7eb',
              color: selectedCategory === 'all' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            All Quotes ({quotes.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedCategory === cat.id ? '#3b82f6' : '#e5e7eb',
                color: selectedCategory === cat.id ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Quotes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: '5px solid #3b82f6',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>{quote.icon}</div>
              <blockquote style={{
                fontStyle: 'italic',
                color: '#374151',
                marginBottom: '20px',
                fontSize: '16px',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                "{quote.text}"
              </blockquote>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#1f2937', fontWeight: 'bold', fontSize: '15px' }}>
                  — {quote.author}
                </p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
                  {quote.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '60px'
        }}>
          <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
            Quote Statistics
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '10px' }}>
                {quotes.length}
              </div>
              <p style={{ color: '#666' }}>Total Quotes</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '10px' }}>
                {new Set(quotes.map(q => q.author)).size}
              </div>
              <p style={{ color: '#666' }}>Unique Authors</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '10px' }}>
                {categories.length}
              </div>
              <p style={{ color: '#666' }}>Categories</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>
                ∞
              </div>
              <p style={{ color: '#666' }}>Unlimited Inspiration</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
            Ready to Transform Your Vision into Reality?
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '25px', opacity: 0.9 }}>
            Let the wisdom of industry leaders inspire your journey. Partner with Ayinde Technologies to turn inspiration into innovation.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/services" style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'white',
              color: '#3b82f6',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Explore Our Services
            </a>
            <a href="/#contact" style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              border: '2px solid white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamousQuotesPage;