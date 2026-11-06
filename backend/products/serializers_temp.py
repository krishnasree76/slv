from rest_framework import serializers
from .models import (
    Category,
    Product,
    ProductColor,
    ProductImage,
    ProductVariant,
    HeroImage,
)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]

class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["id", "name", "color"]

class ProductVariantSerializer(serializers.ModelSerializer):
    color = ProductColorSerializer(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ["id", "size", "stock", "color"]

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    
    # Use these instead of computing them heavily
    tag_names = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "code", "name", "description", "price",
            "original_price", "discount_percentage", "has_sizes",
            "shipping_charge", "category", "category_name",
            "variants", "images", "tag_names", "available_colors",
        ]

    def get_tag_names(self, obj):
        # Assumes 'tags' is prefetched in the view
        return [tag.name for tag in obj.tags.all()]

    def get_available_colors(self, obj):
        # 🚀 OPTIMIZATION: Do NOT query the database here!
        # Since we already prefetched 'variants' and 'variants__color' in the view,
        # we can just extract the unique colors in memory. Extremely fast!
        variants = obj.variants.all()
        
        # Use a dictionary to keep unique colors by ID
        unique_colors = {}
        for variant in variants:
            if variant.color and variant.color.id not in unique_colors:
                unique_colors[variant.color.id] = variant.color
                
        # Serialize the unique colors
        return ProductColorSerializer(unique_colors.values(), many=True).data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class HeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroImage
        fields = ["id", "image"]
