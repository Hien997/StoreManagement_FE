import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Boxes, Pencil, Tag } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import { useProduct } from "@/features/products/hooks";
import { useCategories } from "@/features/categories/hooks";
import { useSuppliers } from "@/features/suppliers/hooks";
import { useBrands } from "@/features/brands/hooks";
import { useInventory } from "@/features/inventory/hooks";
import {
  toProduct,
  toCategory,
  toSupplier,
  toBrand,
  toStockMovement,
} from "@/types/api/mappers";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { useTranslation } from "react-i18next";

export function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  const { data: productData, isLoading } = useProduct(productId);
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: suppliersData } = useSuppliers({ limit: 100 });
  const { data: brandsData } = useBrands({ page: 1, page_size: 100 });
  const { data: inventoryData } = useInventory({ limit: 100 });
  const product = productData ? toProduct(productData) : null;
  const categories = React.useMemo(
    () => (categoriesData?.items ?? []).map(toCategory),
    [categoriesData],
  );
  const suppliers = React.useMemo(
    () => (suppliersData?.items ?? []).map(toSupplier),
    [suppliersData],
  );
  const brands = React.useMemo(
    () => (brandsData?.items ?? []).map(toBrand),
    [brandsData],
  );

  const productName = product?.name ?? "";
  const movements = React.useMemo(
    () =>
      (inventoryData?.items ?? [])
        .filter((inv) => inv.product_id === productId)
        .map((inv) => toStockMovement(inv, productName))
        .slice(0, 8),
    [inventoryData, productId, productName],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4" /> {t("common.back")}
        </Button>
        <p className="text-muted-foreground">{t("common.loadingProduct")}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4" /> {t("common.back")}
        </Button>
        <p className="text-muted-foreground">{t("common.productNotFound")}</p>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const supplier = suppliers.find((s) => s.id === product.supplierId);
  const brand = brands.find((b) => b.id === product.brand);
  const margin = product.sellingPrice - product.purchasePrice;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/products")}>
        <ArrowLeft className="h-4 w-4" /> {t("common.backToProducts")}
      </Button>

      <PageHeader
        title={product.name}
        description={product.sku}
        actions={
          <Button onClick={() => navigate(`/products?edit=${product.id}`)}>
            <Pencil className="h-4 w-4" /> {t("common.edit")}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <Avatar className="h-32 w-32 rounded-xl">
                <AvatarImage src={product.imageUrl} alt={product.name} />
                <AvatarFallback className="rounded-xl text-2xl">
                  {product.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 flex items-center gap-2">
                <Badge
                  variant={
                    product.status === "active"
                      ? "success"
                      : product.status === "discontinued"
                        ? "danger"
                        : "secondary"
                  }
                  className="capitalize"
                >
                  {product.status}
                </Badge>
                <Badge variant="outline">{product.unit}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("common.pricing")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("common.purchasePrice")}
                </span>
                <span className="font-medium">
                  {formatCurrency(product.purchasePrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("common.sellingPrice")}
                </span>
                <span className="font-medium">
                  {formatCurrency(product.sellingPrice)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("common.margin")}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {margin >= 0 ? "+" : ""}
                  {formatCurrency(margin)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("common.stockValue")}
                </span>
                <span className="font-medium">
                  {formatCurrency(product.stock * product.purchasePrice)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("common.details")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">
                    {t("product.category")}
                  </p>
                  <Link
                    to="/categories"
                    className="font-medium hover:underline"
                  >
                    {category?.name ?? "—"}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">{t("product.stock")}</p>
                  <p className="font-medium">
                    {product.stock} {product.unit}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">{t("product.brand")}</p>
                <p className="font-medium">{brand?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("common.barcode")}</p>
                <p className="font-medium">{product.barcode}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("common.supplier")}</p>
                <Link
                  to={`/suppliers/${supplier?.id}`}
                  className="font-medium hover:underline"
                >
                  {supplier?.name ?? "—"}
                </Link>
              </div>
              <div>
                <p className="text-muted-foreground">{t("common.created")}</p>
                <p className="font-medium">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("product.expiredDate")}
                </p>
                <p className="font-medium">
                  {product.expiredDate ? formatDate(product.expiredDate) : "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("common.recentStockMovements")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {movements.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("common.noMovements")}
                </p>
              ) : (
                <div className="space-y-2">
                  {movements.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <Badge
                          variant={
                            m.type === "in"
                              ? "success"
                              : m.type === "out"
                                ? "danger"
                                : "warning"
                          }
                          className="capitalize"
                        >
                          {m.type}
                        </Badge>
                        <span className="ml-2 text-muted-foreground">
                          {m.note}
                        </span>
                      </div>
                      <span className="font-medium">{m.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
