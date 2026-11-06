from django.db import models
from colorfield.fields import ColorField
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.db import models
from colorfield.fields import ColorField
from django.utils.text import slugify
from django.core.exceptions import ValidationError

# 🚀 IMPORT ImageOps here!
from io import BytesIO
from PIL import Image, ImageOps 
from django.core.files.base import ContentFile
import os

def compress_image_to_webp(image_field, max_width=1000, quality=80):
    """
    Compresses an image, fixes EXIF rotation, resizes it, and converts it to WebP.
    """
    if not image_field or not image_field.name:
        return

    # Check if already a webp to prevent double compression
    if image_field.name.lower().endswith('.webp'):
        return

    try:
        img = Image.open(image_field)
        
        # 🚀 FIX: Automatically rotate the image based on its EXIF data!
        # This MUST be done before resizing or converting.
        img = ImageOps.exif_transpose(img)
        
        # Convert RGBA to RGB to avoid issues saving as WebP
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Resize if width exceeds max_width
        if img.width > max_width:
            output_size = (max_width, int(img.height * (max_width / img.width)))
            img = img.resize(output_size, Image.Resampling.LANCZOS)

        # Save to buffer
        buffer = BytesIO()
        img.save(buffer, format="WEBP", quality=quality, optimize=True)
        buffer.seek(0)

        # Rename file extension to .webp
        base_name = os.path.splitext(image_field.name)[0]
        new_filename = f"{base_name}.webp"

        image_field.save(new_filename, ContentFile(buffer.read()), save=False)
    except Exception as e:
        print(f"Error compressing image: {e}")


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        
        # 🚀 OPTIMIZATION: Compress category image
        if self.image:
            compress_image_to_webp(self.image, max_width=800)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self):
        return self.name


class ProductColor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    color = ColorField(default="#FFFFFF")

    class Meta:
        ordering = ["name"]
    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey("Category", on_delete=models.CASCADE)
    description = models.TextField()

    shipping_charge = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    has_sizes = models.BooleanField(default=True)

    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, editable=False, default=0)

    tags = models.ManyToManyField("ProductTag", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.original_price and self.price:
            if self.original_price > 0:
                discount = ((self.original_price - self.price) / self.original_price) * 100
                self.discount_percentage = round(discount, 2)
            else:
                self.discount_percentage = 0
        else:
            self.discount_percentage = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")

    def save(self, *args, **kwargs):
        # 🚀 OPTIMIZATION: Compress product images
        if self.image:
            compress_image_to_webp(self.image, max_width=1200, quality=90)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.product.name


SIZE_CHOICES = (
    ('XS', 'XS'),
    ('S', 'S'),
    ('M', 'M'),
    ('L', 'L'),
    ('XL', 'XL'),
    ('XXL', 'XXL'),
    ('3XL', '3XL'),
    ('4XL', '4XL'),
    ('5XL', '5XL'),
    ('0', '0'),
    ('16', '16'),
    ('18', '18'),
    ('20', '20'),
    ('22', '22'),
    ('24', '24'),
    ('26', '26'),
    ('28', '28'),
    ('30', '30'),
    ('32', '32'),
    ('34', '34'),
    ('36', '36'),
    ('38', '38'),
    ('40', '40'),
    ('42', '42'),
    ('44', '44'),
    ('46', '46'),
    ('48', '48'),
    ('50', '50'),
    ('55', '55'),
    ('60', '60'),
    ('65', '65'),
    ('70', '70'),
    ('75', '75'),
    ('80', '80'),
    ('85', '85'),
    ('90', '90'),
    ('95', '95'),
    ('100', '100'),
    ('105', '105'),
    ('110', '110'),
)


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    color = models.ForeignKey(ProductColor, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("product", "color", "size")
        ordering = ["product__name", "color__name", "size"]

    def __str__(self):
        return f"{self.product.name} - {self.color.name} - {self.size}"

    @property
    def is_out_of_stock(self):
        return self.stock == 0


class HeroImage(models.Model):
    image = models.ImageField(upload_to="hero/")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Hero Image {self.id}"
