'use client';

import { useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';

interface SocialShareProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'product' | 'blog';
  className?: string;
}

export function SocialShare({
  title,
  description,
  image,
  url,
  type = 'product',
  className = ''
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const shareText = type === 'product'
    ? `Check out this amazing ${title} from PoshPOULE Farms! ${description}`
    : `Read this insightful article: ${title} - ${description}`;

  const shareData = {
    title: type === 'product' ? `PoshPOULE - ${title}` : title,
    text: shareText,
    url: fullUrl,
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setIsOpen(false);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + fullUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + fullUrl)}`,
  };

  const handleSocialShare = (platform: string) => {
    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Share this content"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Share Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-900 text-sm">Share this {type}</h3>
            </div>

            <div className="p-2 space-y-1">
              {/* Native Share (if supported) */}
              {typeof window !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share via...
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Copy className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </button>

              {/* Social Platforms */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </button>

                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Twitter className="h-4 w-4 text-blue-400" />
                  Twitter
                </button>

                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  LinkedIn
                </button>

                <button
                  onClick={() => handleSocialShare('whatsapp')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  WhatsApp
                </button>

                <button
                  onClick={() => handleSocialShare('email')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
