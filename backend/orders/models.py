import string
import secrets
from django.db import models, transaction
from django.conf import settings # Use this for User model reference


def generate_order_number():
    """Generate random 8 character order id"""
    chars = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(8))


class Order(models.Model):

    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("expired", "Expired"),
        ("failed", "Failed"),
        ("refund", "Refund"),
    ]

    # ✅ NEW: Order status choices
    STATUS_CHOICES = [
    ("processed", "Processed"),
    ("confirmed", "Confirmed"),  # ✅ ADD THIS
    ("shipped", "Shipped"),
    ("delivered", "Delivered"),
    ("cancelled", "Cancelled"),
]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="orders"
    )

    order_number = models.CharField(
        max_length=20,
        unique=True,
        default=generate_order_number,
        editable=False
    )

    customer_name = models.CharField(max_length=100, default="Guest")
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default="pending"
    )

    # ✅ ADD THIS FIELD
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="processed"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    razorpay_order_id = models.CharField(max_length=200, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=200, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Order #{self.order_number}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    variant = models.ForeignKey(
        "products.ProductVariant",
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.variant} x {self.quantity}"

class DeliveryConfiguration(models.Model):
    charge_upto_two = models.DecimalField(max_digits=10, decimal_places=2, default=50.00, help_text="Shipping charge for 1 or 2 products")
    charge_more_than_two = models.DecimalField(max_digits=10, decimal_places=2, default=100.00, help_text="Shipping charge for 3 or more products")

    def save(self, *args, **kwargs):
        self.pk = 1
        super(DeliveryConfiguration, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Delivery Configuration"
