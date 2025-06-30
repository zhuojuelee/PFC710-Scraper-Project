import { atomWithStorage } from "jotai/utils";

type WatchList = Record<string, boolean>;

const WATCHLIST_KEY = 'watchListKey';
const initialWatchlist: WatchList = {}
export const watchlistAtom = atomWithStorage(WATCHLIST_KEY, initialWatchlist);

const TOGGLE_WATCHLIST_KEY ='watchListToggleKey';
export const toggleWatchlistAtom = atomWithStorage(TOGGLE_WATCHLIST_KEY, false)
