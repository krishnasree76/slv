import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from orders.models import Order
from products.models import ProductVariant
from django.db import transaction

class Command(BaseCommand):
    help = 'Releases reserved stock for orders pending > 30 minutes'

    def handle(self, *args, **options):
        # 30 minutes ago
        time_threshold = timezone.now() - datetime.timedelta(minutes=30)
        
        # Find orders that are pending/failed and older than 30 mins
        expired_orders = Order.objects.filter(
            created_at__lte=time_threshold,
            payment_status__in=["pending", "failed"]
        )

        count = 0
        for order in expired_orders:
            with transaction.atomic():
                # Lock order
                order = Order.objects.select_for_update().get(id=order.id)
                if order.payment_status in ["pending", "failed"]:
                    for item in order.items.all():
                        variant = ProductVariant.objects.select_for_update().get(id=item.variant.id)
                        # Release reserved stock
                        release_qty = min(variant.reserved_stock, item.quantity)
                        variant.reserved_stock -= release_qty
                        variant.save(update_fields=["reserved_stock"])
                    
                    order.payment_status = "expired"
                    order.status = "cancelled"
                    order.save(update_fields=["payment_status", "status"])
                    count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully released stock for {count} abandoned orders.'))
