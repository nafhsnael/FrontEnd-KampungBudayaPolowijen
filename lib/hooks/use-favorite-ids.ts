"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

const FAVORITES_KEY = "favoriteProducts";
const FAVORITES_EVENT = "favorite-products-change";
const SERVER_SNAPSHOT = Symbol("server-snapshot");
const STORAGE_READ_ERROR = Symbol("storage-read-error");

type FavoriteSnapshot =
  | string
  | null
  | typeof SERVER_SNAPSHOT
  | typeof STORAGE_READ_ERROR;

type ParsedFavoriteIds = {
  ids: string[];
  error: string | null;
};

function getClientSnapshot(): FavoriteSnapshot {
  try {
    return window.localStorage.getItem(FAVORITES_KEY);
  } catch {
    return STORAGE_READ_ERROR;
  }
}

function getServerSnapshot(): FavoriteSnapshot {
  return SERVER_SNAPSHOT;
}

function subscribeToFavorites(onChange: () => void) {
  window.addEventListener(FAVORITES_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(FAVORITES_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function parseFavoriteIds(snapshot: FavoriteSnapshot): ParsedFavoriteIds {
  if (snapshot === SERVER_SNAPSHOT || snapshot === null) {
    return { ids: [], error: null };
  }
  if (snapshot === STORAGE_READ_ERROR) {
    return {
      ids: [],
      error: "Data favorit tidak dapat dimuat dari penyimpanan perangkat.",
    };
  }

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (Array.isArray(parsed)) {
      const ids = parsed.filter((id): id is string => typeof id === "string");
      if (ids.length === parsed.length) {
        return { ids, error: null };
      }
    }
  } catch {
    return { ids: [], error: "Data favorit tidak valid dan tidak dapat dimuat." };
  }

  return { ids: [], error: "Data favorit tidak valid dan tidak dapat dimuat." };
}

export function useFavoriteIds() {
  const snapshot = useSyncExternalStore(
    subscribeToFavorites,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [writeError, setWriteError] = useState<string | null>(null);
  const parsedSnapshot = useMemo(() => parseFavoriteIds(snapshot), [snapshot]);

  const toggleFavorite = useCallback((id: string) => {
    const currentSnapshot = getClientSnapshot();
    if (currentSnapshot === STORAGE_READ_ERROR) {
      setWriteError("Favorit tidak dapat disimpan pada perangkat ini.");
      return;
    }

    const currentIds = parseFavoriteIds(currentSnapshot).ids;
    const nextIds = currentIds.includes(id)
      ? currentIds.filter((favoriteId) => favoriteId !== id)
      : [...currentIds, id];

    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextIds));
      setWriteError(null);
      window.dispatchEvent(new Event(FAVORITES_EVENT));
    } catch {
      setWriteError("Favorit tidak dapat disimpan pada perangkat ini.");
    }
  }, []);

  return {
    favoriteIds: parsedSnapshot.ids,
    isLoaded: snapshot !== SERVER_SNAPSHOT,
    storageError: writeError ?? parsedSnapshot.error,
    toggleFavorite,
  };
}
