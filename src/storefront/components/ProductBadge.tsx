import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/components/ui/badge";
import type { StoreProduct } from "../types";

export function ProductBadge({ product }: { product: StoreProduct }) {
  const { t } = useTranslation();
  if (product.discountPercent) {
    return <Badge variant="destructive">-{product.discountPercent}%</Badge>;
  }
  if (product.stockStatus === "out_of_stock") {
    return (
      <Badge variant="secondary">{t("storefront.product.outOfStock")}</Badge>
    );
  }
  if (product.stockStatus === "low_stock") {
    return <Badge variant="warning">{t("storefront.product.lowStock")}</Badge>;
  }
  return <Badge variant="success">{t("storefront.product.inStock")}</Badge>;
}
