import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Brand, Category } from "@/shared/lib/types";
import type { StoreProduct } from "./types";
import { storeService } from "./service";
import { customerOrderService } from "@/features/customers/auth/orderService";
import { useCustomerAuthStore } from "@/features/customers/auth/store";
import type { CustomerOrderResponse } from "@/types/api";

export function useStoreProducts() {
  return useQuery<StoreProduct[]>({
    queryKey: ["store", "products"],
    queryFn: storeService.products,
    staleTime: 1000 * 60 * 5,
  });
}

export function useStoreCategories() {
  return useQuery<Category[]>({
    queryKey: ["store", "categories"],
    queryFn: storeService.categories,
    staleTime: 1000 * 60 * 10,
  });
}

export function useStoreBrands() {
  return useQuery<Brand[]>({
    queryKey: ["store", "brands"],
    queryFn: storeService.brands,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFeaturedProducts(
  products: StoreProduct[] | undefined,
  count = 8,
) {
  return useMemo(
    () => (products ?? []).filter((p) => p.discountPercent).slice(0, count),
    [products, count],
  );
}

export function useNewProducts(
  products: StoreProduct[] | undefined,
  count = 8,
) {
  return useMemo(
    () =>
      [...(products ?? [])]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, count),
    [products, count],
  );
}

export function useBestSellers(
  products: StoreProduct[] | undefined,
  count = 8,
) {
  return useMemo(
    () =>
      [...(products ?? [])].sort((a, b) => b.rating - a.rating).slice(0, count),
    [products, count],
  );
}

export function useRelatedProducts(
  products: StoreProduct[] | undefined,
  current: StoreProduct | undefined,
  count = 4,
) {
  return useMemo(() => {
    if (!current || !products) return [];
    return products
      .filter(
        (p) =>
          p.id !== current.id &&
          (p.categoryId === current.categoryId || p.brand === current.brand),
      )
      .slice(0, count);
  }, [products, current, count]);
}

export type { Brand, Category, StoreProduct };

export function useMyOrders() {
  const customer = useCustomerAuthStore((s) => s.customer);
  const orders = useQuery<CustomerOrderResponse[]>({
    queryKey: ["store", "my-orders"],
    queryFn: () => customerOrderService.list().then((data) => data.items),
    enabled: !!customer,
  });

  return {
    ...orders,
    myOrders: orders.data ?? [],
    isLoading: orders.isLoading,
  };
}
