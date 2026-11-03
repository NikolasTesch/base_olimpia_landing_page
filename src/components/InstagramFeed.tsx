import { useState, useEffect } from 'react';
import {
  loadInstagramOverride,
  type EditableInstagramPost,
} from '../domain/owner-storage';

interface InstagramFeedProps {
  initialPreviews: EditableInstagramPost[];
  title: string;
  description: string;
  profileUrl?: string | null;
  profileFemininoUrl?: string | null;
  actionLabel?: string | null;
  actionFemininoLabel?: string | null;
  emptyState?: string | null;
}

function formatDatePtBR(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export default function InstagramFeed({
  initialPreviews,
  title,
  description,
  profileUrl,
  profileFemininoUrl,
  actionLabel,
  actionFemininoLabel,
  emptyState,
}: InstagramFeedProps) {
  const [posts, setPosts] = useState<EditableInstagramPost[]>(initialPreviews);

  useEffect(() => {
    const override = loadInstagramOverride();
    if (override && Array.isArray(override)) {
      setPosts(override);
    }

    const onUpdated = (e: Event) => {
      const custom = e as CustomEvent<EditableInstagramPost[] | null>;
      if (custom.detail && Array.isArray(custom.detail)) {
        setPosts(custom.detail);
      } else {
        setPosts(initialPreviews);
      }
    };

    window.addEventListener('base:instagram-updated', onUpdated);
    return () => window.removeEventListener('base:instagram-updated', onUpdated);
  }, [initialPreviews]);

  // Show only selected posts (defaults to true if selected is undefined)
  const activePosts = posts.filter((p) => p.selected !== false);

  const getAccountUrl = (account?: string) => {
    if (account && account.toLowerCase().includes('feminino')) {
      return profileFemininoUrl ?? 'https://www.instagram.com/baseolimpiavoleifeminino/';
    }
    return profileUrl ?? 'https://www.instagram.com/baseolimpiavolei/';
  };

  return (
    <div className="container">
      <div className="instagram-heading">
        <div className="section-heading">
          <span className="eyebrow">07 / O DIA A DIA DO BASE</span>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div className="instagram-heading-actions">
          {profileUrl && (
            <a
              className="button button-small"
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="button-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span>{actionLabel ?? 'Instagram Geral'}</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {profileFemininoUrl && (
            <a
              className="button button-small button-secondary"
              href={profileFemininoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="button-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span>{actionFemininoLabel ?? 'Instagram Feminino'}</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      {activePosts.length > 0 ? (
        <div className="instagram-grid">
          {activePosts.map((p) => {
            const isVideo = p.mediaType === 'video' || (p.videoSrc && p.videoSrc.trim().length > 0);
            const accountUrl = getAccountUrl(p.account);

            return (
              <article key={p.id} className="instagram-card">
                <div className="instagram-card-head">
                  <a
                    href={accountUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram-card-account-link"
                    title={`Abrir ${p.account ?? '@baseolimpiavolei'} no Instagram`}
                  >
                    <span className="instagram-mark" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </span>
                    <span className="instagram-card-account">{p.account ?? '@baseolimpiavolei'}</span>
                  </a>
                </div>

                <div className="media-frame media-square">
                  {isVideo ? (
                    <div className="instagram-media-wrapper">
                      <video
                        src={p.videoSrc ?? undefined}
                        poster={p.imageSrc}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={p.title}
                      >
                        Seu navegador não suporta a tag de vídeo.
                      </video>
                      <span className="instagram-media-badge" aria-label="Vídeo oficial">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Vídeo</span>
                      </span>
                    </div>
                  ) : (
                    <div className="instagram-media-wrapper">
                      <img
                        src={p.imageSrc}
                        alt={p.title}
                        loading="lazy"
                        width="400"
                        height="400"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="instagram-media-badge" aria-label="Foto oficial">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <span>Foto</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="instagram-card-copy">
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <div className="instagram-card-footer">
                    {p.permalink && (
                      <a href={p.permalink} target="_blank" rel="noopener noreferrer">
                        Ver no Instagram <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {p.publishedAt && (
                      <time className="instagram-card-date" dateTime={p.publishedAt}>
                        {formatDatePtBR(p.publishedAt)}
                      </time>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="muted">{emptyState || 'Nenhuma publicação selecionada no momento.'}</p>
      )}
    </div>
  );
}
