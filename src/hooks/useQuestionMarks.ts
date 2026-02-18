import { useState, useCallback, useEffect } from 'react';
import type { BookmarkedQuestion, BookmarksData } from '../types';
import { loadQuizProgress, saveQuizProgress } from './useQuizProgress';

const BOOKMARKS_KEY = 'isaqb-quiz-bookmarks';

// Load global bookmarks
function loadBookmarks(): BookmarkedQuestion[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    if (!data) return [];
    const parsed: BookmarksData = JSON.parse(data);
    return parsed.bookmarks ?? [];
  } catch {
    return [];
  }
}

// Save global bookmarks
function saveBookmarks(bookmarks: BookmarkedQuestion[]): void {
  try {
    const data: BookmarksData = { bookmarks };
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
}

interface UseQuestionMarksOptions {
  quizId: string;
}

export function useQuestionMarks({ quizId }: UseQuestionMarksOptions) {
  // Flagged questions (session-specific, stored with quiz progress)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(() => {
    const progress = loadQuizProgress(quizId);
    return new Set(progress?.flaggedQuestions ?? []);
  });

  // Bookmarked questions (global)
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(loadBookmarks);

  // Sync flags to localStorage when they change
  useEffect(() => {
    const progress = loadQuizProgress(quizId);
    if (progress) {
      saveQuizProgress(quizId, {
        ...progress,
        flaggedQuestions: Array.from(flaggedQuestions),
      });
    }
  }, [quizId, flaggedQuestions]);

  // Toggle flag for a question
  const toggleFlag = useCallback((questionId: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  // Check if a question is flagged
  const isFlagged = useCallback(
    (questionId: string) => flaggedQuestions.has(questionId),
    [flaggedQuestions]
  );

  // Clear all flags (e.g., when resetting quiz)
  const clearFlags = useCallback(() => {
    setFlaggedQuestions(new Set());
  }, []);

  // Toggle bookmark for a question
  const toggleBookmark = useCallback(
    (questionId: string, questionText: string) => {
      setBookmarks((prev) => {
        const existingIndex = prev.findIndex(
          (b) => b.questionId === questionId && b.quizId === quizId
        );

        let next: BookmarkedQuestion[];
        if (existingIndex >= 0) {
          // Remove bookmark
          next = prev.filter((_, i) => i !== existingIndex);
        } else {
          // Add bookmark
          next = [
            ...prev,
            {
              questionId,
              quizId,
              questionText: questionText.substring(0, 200), // Truncate for storage
              bookmarkedAt: new Date().toISOString(),
            },
          ];
        }

        saveBookmarks(next);
        return next;
      });
    },
    [quizId]
  );

  // Check if a question is bookmarked
  const isBookmarked = useCallback(
    (questionId: string) =>
      bookmarks.some((b) => b.questionId === questionId && b.quizId === quizId),
    [bookmarks, quizId]
  );

  // Get bookmarks for current quiz
  const quizBookmarks = bookmarks.filter((b) => b.quizId === quizId);

  // Get all bookmarks
  const allBookmarks = bookmarks;

  // Remove a bookmark by ID
  const removeBookmark = useCallback((questionId: string, bookmarkQuizId: string) => {
    setBookmarks((prev) => {
      const next = prev.filter(
        (b) => !(b.questionId === questionId && b.quizId === bookmarkQuizId)
      );
      saveBookmarks(next);
      return next;
    });
  }, []);

  // Reload flags from storage (e.g., after quiz reset)
  const reloadFlags = useCallback(() => {
    const progress = loadQuizProgress(quizId);
    setFlaggedQuestions(new Set(progress?.flaggedQuestions ?? []));
  }, [quizId]);

  return {
    // Flags
    flaggedQuestions,
    toggleFlag,
    isFlagged,
    clearFlags,
    reloadFlags,
    flagCount: flaggedQuestions.size,

    // Bookmarks
    toggleBookmark,
    isBookmarked,
    removeBookmark,
    quizBookmarks,
    allBookmarks,
    bookmarkCount: quizBookmarks.length,
    totalBookmarkCount: allBookmarks.length,
  };
}

// Standalone hook for accessing bookmarks without quiz context
export function useAllBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(loadBookmarks);

  const refresh = useCallback(() => {
    setBookmarks(loadBookmarks());
  }, []);

  const removeBookmark = useCallback((questionId: string, quizId: string) => {
    setBookmarks((prev) => {
      const next = prev.filter(
        (b) => !(b.questionId === questionId && b.quizId === quizId)
      );
      saveBookmarks(next);
      return next;
    });
  }, []);

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
    saveBookmarks([]);
  }, []);

  return {
    bookmarks,
    refresh,
    removeBookmark,
    clearAllBookmarks,
    count: bookmarks.length,
  };
}
