'use client';

interface ScrollToPostsButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function ScrollToPostsButton({ onClick, children }: ScrollToPostsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-8 py-3 bg-white text-primary hover:bg-gray-100 rounded-full font-medium transition-colors duration-300 transform hover:scale-105"
    >
      {children}
    </button>
  );
}
