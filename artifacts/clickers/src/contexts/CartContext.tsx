import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

export interface CartItem {
  bookId: string;
  title: string;
  coverUrl: string;
  price: number;
  quantity: number;
  format: 'digital' | 'physical' | 'both';
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'LOAD'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.bookId === action.payload.bookId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.bookId === action.payload.bookId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.bookId !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.bookId === action.payload.bookId
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_DRAWER':
      return { ...state, isOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false };
    case 'LOAD':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isInCart: (bookId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = 'alrehab_cart';
const LEGACY_CART_KEY = 'zahmet_kotab_cart';

// Safe localStorage setter that handles QuotaExceededError and purges bloated caches
function safeSaveCart(items: CartItem[]) {
  const serialized = JSON.stringify(items);
  try {
    localStorage.setItem(CART_KEY, serialized);
  } catch (err) {
    // If quota exceeded, clean up large cache keys and retry
    try {
      localStorage.removeItem('CLICKERS_OFFLINE_CACHE');
      localStorage.removeItem(LEGACY_CART_KEY);
      localStorage.setItem(CART_KEY, serialized);
    } catch {
      // If still fails, fail gracefully without crashing React
      console.warn('Cart storage quota exceeded; maintaining cart in memory.');
    }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Load persisted cart on mount
  useEffect(() => {
    try {
      // Clean up any oversized offline cache immediately
      localStorage.removeItem('CLICKERS_OFFLINE_CACHE');

      const saved = localStorage.getItem(CART_KEY) || localStorage.getItem(LEGACY_CART_KEY);
      if (saved) {
        dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist cart safely on every change
  useEffect(() => {
    safeSaveCart(state.items);
  }, [state.items]);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalPrice,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
        updateQuantity: (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { bookId: id, quantity: qty } }),
        clear: () => dispatch({ type: 'CLEAR' }),
        openCart: () => dispatch({ type: 'OPEN_DRAWER' }),
        closeCart: () => dispatch({ type: 'CLOSE_DRAWER' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_DRAWER' }),
        isInCart: (id) => state.items.some((i) => i.bookId === id),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
