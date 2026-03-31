'use client'

import { MOCK_SOCIAL_POSTS } from '@/lib/nepal-data'
import { Share2, Clock, ThumbsUp, MessageCircle, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function SocialPage() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>Social Media Publishing</h1>
        <p className="body-lg">Automated posts to Reddit and X (Mock Mode)</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ flex: 1, borderLeft: '3px solid #FF4500' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FF4500', marginBottom: '0.5rem' }}>Reddit Bot Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span className="status-dot status-warning" /> DRY RUN MODE
          </div>
        </div>
        <div className="card" style={{ flex: 1, borderLeft: '3px solid #1DA1F2' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1DA1F2', marginBottom: '0.5rem' }}>X (Twitter) Bot Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span className="status-dot status-warning" /> DRY RUN MODE
          </div>
        </div>
      </div>

      <h2 className="headline" style={{ marginBottom: '1rem' }}>Recent Automated Posts</h2>

      <div className="animate-fade-in">
        {MOCK_SOCIAL_POSTS.map(post => (
          <div key={post.id} className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge" style={{ 
                  background: post.platform === 'reddit' ? '#FF450020' : '#1DA1F220',
                  color: post.platform === 'reddit' ? '#FF4500' : '#1DA1F2',
                  border: `1px solid ${post.platform === 'reddit' ? '#FF450040' : '#1DA1F240'}`,
                }}>
                  {post.platform.toUpperCase()}
                </span>
                {post.platform === 'reddit' && <span className="badge badge-status">r/{post.subreddit}</span>}
                <span style={{ fontSize: '0.75rem', color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}
                </span>
              </div>
              <span className="badge badge-medium">MOCK MODE</span>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--on-surface)', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
              {post.content}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', background: 'var(--surface-container-low)', borderRadius: '0.5rem' }}>
              {post.platform === 'reddit' ? (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--outline)', fontSize: '0.85rem' }}>
                    <ThumbsUp size={14} /> {post.upvotes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--outline)', fontSize: '0.85rem' }}>
                    <MessageCircle size={14} /> {post.comments}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--outline)', fontSize: '0.85rem' }}>
                    <ThumbsUp size={14} /> {post.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--outline)', fontSize: '0.85rem' }}>
                    <RefreshCw size={14} /> {post.retweets}
                  </span>
                </>
              )}
              {post.url && (
                <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--tertiary)', textDecoration: 'none' }}>
                  View Original ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
