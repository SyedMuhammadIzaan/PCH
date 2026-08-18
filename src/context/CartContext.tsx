import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types/index.js';
import { useToast } from './ToastContext.js';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  promoCode: string;
  promoDiscount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => boolean;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 3500;
const STANDARD_SHIPPING_FEE = 250;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pch_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('pch_cart_items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1): boolean => {
    // Check product status
    if (product.status === 'inactive') {
      toast.error('Product Unavailable', 'This product is currently not available for purchase.');
      return false;
    }

    const availableStock = variant ? variant.stock : product.stock;
    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;

    // Check existing quantity in cart
    const existingIndex = items.findIndex((i) => i.id === cartItemId);
    const existingQty = existingIndex >= 0 ? items[existingIndex].quantity : 0;
    const requestedTotalQty = existingQty + quantity;

    if (requestedTotalQty > availableStock) {
      toast.error(
        'Stock Limit Reached',
        `Only ${availableStock} units available for ${product.name}${variant ? ` (${variant.value})` : ''}. You already have ${existingQty} in cart.`
      );
      return false;
    }

    const unitPrice = (product.discountPrice || product.price) + (variant?.additionalPrice || 0);

    if (existingIndex >= 0) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product: JSON.parse(JSON.stringify(product)),
        variantId: variant?.id,
        variantName: variant?.name,
        variantValue: variant?.value,
        quantity,
        price: unitPrice,
      };
      setItems((prev) => [...prev, newItem]);
    }

    toast.success(
      'Added to Cart ✓',
      `${product.name}${variant ? ` (${variant.value})` : ''} added to your bag.`
    );
    setIsCartDrawerOpen(true);
    return true;
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const item = items.find((i) => i.id === cartItemId);
    if (!item) return;

    const availableStock = item.variantId
      ? item.product.variants?.find((v) => v.id === item.variantId)?.stock || item.product.stock
      : item.product.stock;

    if (newQuantity > availableStock) {
      toast.error('Maximum Stock Available', `Only ${availableStock} items in stock for this variant.`);
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQuantity } : i))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    const item = items.find((i) => i.id === cartItemId);
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
    if (item) {
      toast.info('Item Removed', `${item.product.name} removed from your bag.`);
    }
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setPromoDiscount(0);
    try {
      localStorage.removeItem('pch_cart_items');
    } catch {}
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PCH10' || clean === 'EID2026') {
      const discountVal = 500;
      setPromoCode(clean);
      setPromoDiscount(discountVal);
      toast.success('Voucher Applied!', `Rs. ${discountVal} discount added to your order.`);
      return true;
    } else if (clean === 'FIRSTORDER') {
      const discountVal = 300;
      setPromoCode(clean);
      setPromoDiscount(discountVal);
      toast.success('Voucher Applied!', `Rs. ${discountVal} new customer discount applied.`);
      return true;
    } else {
      toast.error('Invalid Voucher', 'Try coupon code PCH10 or EID2026');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    toast.info('Voucher Removed');
  };

  // Computations
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - promoDiscount + shipping);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount: promoDiscount,
        shipping,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        promoCode,
        promoDiscount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
