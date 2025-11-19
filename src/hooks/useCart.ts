import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Cart } from '../types/cart.types';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';

const EMPTY_CART: Cart = {
  items: [],
  totalPrice: 0
};

interface UseCartOptions {
  autoFetch?: boolean;
}

export const useCart = ({ autoFetch = true }: UseCartOptions = {}) => {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
      setError(null);
      setSuccessMessage(null);
    } catch (err) {
      setError('Không thể tải giỏ hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) {
      setIsLoading(false);
      return;
    }
    void fetchCart();
  }, [autoFetch, fetchCart]);

  const addToCart = useCallback(
    async (productId: number, quantity: number = 1) => {
      setIsLoading(true);
      try {
        const updatedCart = await cartService.addToCart(productId, quantity);
        setCart(updatedCart);
        setError(null);
        setSuccessMessage('Đã thêm sản phẩm vào giỏ hàng!');
        return updatedCart;
      } catch (err) {
        setError('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (productId: number, nextQuantity: number) => {
      setIsLoading(true);
      try {
        const updatedCart = await cartService.updateCartItemQuantity(productId, nextQuantity);
        setCart(updatedCart);
        setError(null);
        setSuccessMessage(null);
      } catch (err) {
        setError('Không thể cập nhật số lượng. Vui lòng thử lại.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const increaseQuantity = useCallback(
    (productId: number, currentQuantity: number) => updateQuantity(productId, currentQuantity + 1),
    [updateQuantity]
  );

  const decreaseQuantity = useCallback(
    (productId: number, currentQuantity: number) =>
      updateQuantity(productId, Math.max(currentQuantity - 1, 0)),
    [updateQuantity]
  );

  const removeItem = useCallback(async (productId: number) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      setError(null);
      setSuccessMessage(null);
    } catch (err) {
      setError('Không thể xóa sản phẩm khỏi giỏ hàng.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkout = useCallback(async () => {
    setIsLoading(true);
    try {
      const order = await orderService.createOrder();
      setSuccessMessage(`Đặt hàng thành công! Mã đơn: #${order.id}`);
      setCart(EMPTY_CART);
      setError(null);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thanh toán thất bại.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  return {
    cart,
    totalItems,
    isLoading,
    error,
    successMessage,
    refreshCart: fetchCart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    checkout
  };
};


