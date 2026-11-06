from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Category,
    Product,
    ProductImage,
    ProductVariant,
    ProductTag,
    HeroImage,
    ProductColor,
)


def image_preview_tag(image_field, width=70, height=70):
    if image_field and getattr(image_field, "url", None):
        return format_html(
            '<img src="{}" style="width:{}px;height:{}px;object-fit:cover;border-radius:8px;border:1px solid #ddd;" />',
            image_field.url,
            width,
            height,
        )
    return "—"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category_image_preview")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)

    @admin.display(description="Image")
    def category_image_preview(self, obj):
        return image_preview_tag(obj.image, 60, 60)


@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(ProductColor)
class ColorAdmin(admin.ModelAdmin):
    list_display = ("name", "color_swatch")
    search_fields = ("name",)
    ordering = ("name",)

    @admin.display(description="Color")
    def color_swatch(self, obj):
        return format_html(
            '<span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:{};border:1px solid #ccc;"></span> {}',
            obj.color,
            obj.color,
        )


@admin.register(HeroImage)
class HeroImageAdmin(admin.ModelAdmin):
    list_display = ("id", "hero_preview", "is_active")
    list_filter = ("is_active",)
    readonly_fields = ("hero_preview",)

    @admin.display(description="Preview")
    def hero_preview(self, obj):
        return image_preview_tag(obj.image, 140, 80)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("color", "image", "preview")
    readonly_fields = ("preview",)

    @admin.display(description="Preview")
    def preview(self, obj):
        return image_preview_tag(obj.image, 70, 70)


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ("color", "size", "stock")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline, ProductVariantInline]

    list_display = (
        "name",
        "code",
        "category",
        "has_sizes",
        "original_price",
        "price",
        "discount_percentage",
        "display_tags",
        "created_at",
    )
    list_filter = (
        "category",
        "has_sizes",
        "tags",
        "created_at",
    )
    search_fields = (
        "name",
        "code",
        "description",
        "category__name",
        "tags__name",
    )
    filter_horizontal = ("tags",)
    readonly_fields = ("discount_percentage", "created_at")
    ordering = ("-created_at",)
    list_per_page = 25
    save_on_top = True
    date_hierarchy = "created_at"

    TAG_COLORS = {
        "latest":  ("#087E83", "#E0F5F5"),
        "popular": ("#55236F", "#F0E8F8"),
    }

    @admin.display(description="Tags")
    def display_tags(self, obj):
        tags = obj.tags.all()
        if not tags:
            return "—"
        badges = []
        for tag in tags:
            fg, bg = self.TAG_COLORS.get(tag.name.lower(), ("#555", "#eee"))
            badges.append(
                format_html(
                    '<span style="background:{};color:{};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;margin-right:4px;">{}</span>',
                    bg, fg, tag.name,
                )
            )
        return format_html("".join([b for b in badges]))

    fieldsets = (
        ("Basic Information", {
            "fields": (
                "name",
                "code",
                "category",
                "description",
                "tags",
                "original_price",
                "price",
                "discount_percentage",
                "has_sizes",
                "created_at",
            )
        }),
    )
@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    exclude = ("reserved_stock",)

    list_display = (
        "product",
        "color",
        "size",
        "stock",
        "reserved_stock",
        "out_of_stock",
    )

    list_editable = ("stock",)

    list_filter = (
        "product__category",
        "color",
        "size",
    )

    search_fields = (
        "product__name",
        "product__code",
        "color__name",
        "size",
    )


    ordering = ("product__name", "color__name", "size")

    list_per_page = 25
    save_on_top = True

    @admin.display(boolean=True, description="Out of stock")
    def out_of_stock(self, obj):
        return obj.is_out_of_stock

