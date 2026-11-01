import { createContext, useContext, type ReactNode } from "react";

interface BookmarkContextValue {
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

// App provides shared bookmark state to pages without threading it through route props.
export function BookmarkProvider({
  value,
  children,
}: {
  value: BookmarkContextValue;
  children: ReactNode;
}) {
  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

// Fail clearly if a bookmark consumer is rendered outside the App provider.
export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error("useBookmarks must be used within BookmarkProvider");
  return context;
}
