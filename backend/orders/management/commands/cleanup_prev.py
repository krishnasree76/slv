from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from orders.models import Order
from products.models import ProductVariant


class Command(BaseCommand):
    help = "Release reserved stock for pending orders older than 15 minutes"

    def handle(self, *args, **options):
        expiry_threshold = timezone.now() - timedelta(minutes=18)

        # ✅ Use prefetch_related for reverse FK (items), NOT select_related
        expired_orders = (
            Order.objects
            .filter(
                payment_status="pending",
                created_at__lt=expiry_threshold,
            )
            .prefetch_related("items", "items__variant")
        )

        released_count = 0
        skipped_count = 0

        for order in expired_orders:
            try:
                with transaction.atomic():
                    # Lock this order row
                    locked_order = Order.objects.select_for_update().get(id=order.id)

                    # Double-check it's still pending inside the lock
                    if locked_order.payment_status != "pending":
                        skipped_count += 1
                        continue

                    # Sort items by variant ID to prevent deadlocks
                    items = sorted(order.items.all(), key=lambda i: i.variant.id)

                    for item in items:
                        variant = (
                            ProductVariant.objects
                            .select_for_update()
                            .get(id=item.variant.id)
                        )

                        # Release reserved stock safely (never go below 0)
                        variant.reserved_stock = max(0, variant.reserved_stock - item.quantity)
                        variant.save(update_fields=["reserved_stock"])

                    # Mark the order as expired so it won't be picked up again
                    locked_order.payment_status = "expired"
                    locked_order.save(update_fields=["payment_status"])

                    released_count += 1
                    self.stdout.write(
                        f"✅ Released stock for order {locked_order.order_number}"
                    )

            except Exception as e:
                self.stderr.write(
                    f"🔥 Error releasing stock for order {order.id}: {str(e)}"
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Released: {released_count} orders. Skipped (already paid/expired): {skipped_count} orders."
            )
        )
