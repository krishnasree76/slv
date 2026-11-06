from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect
from .models import Order, OrderItem, DeliveryConfiguration
from django.contrib.admin import SimpleListFilter

class PaymentStatusFilter(SimpleListFilter):
    title = "payment status"
    parameter_name = "payment_status"

    def lookups(self, request, model_admin):
        return [
            ("pending",  "Pending"),
            ("paid",     "Paid"),
            ("expired",  "Expired"),
            ("refund",   "Refund"),
            ("failed",   "Failed"),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(payment_status=self.value())
        return queryset



class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class OrderAdmin(admin.ModelAdmin):
    list_display  = ["order_number", "customer_name", "phone", "created_at", "payment_status", "status"]
    list_editable = ["status"]

    # ✅ Replace "payment_status" string with the custom filter class
    list_filter   = [PaymentStatusFilter, "status", "created_at"]

    search_fields = ["order_number", "customer_name", "phone"]
    inlines       = [OrderItemInline]

    actions = [
        "bulk_invoice_download",
        "mark_as_processed",
        "mark_as_confirmed",
        "mark_as_shipped",
        "mark_as_delivered",
        "mark_as_cancelled",
    ]

    readonly_fields = ["invoice_download_button"]

    fields = [
        "customer_name", "user", "total_amount", "payment_status",
        "status",
        "invoice_download_button",
        "address", "city", "state", "pincode", "phone",
        "razorpay_order_id", "razorpay_payment_id", "razorpay_signature",
    ]

    # ==========================================
    # 📝 INVOICE LOGIC
    # ==========================================
    @admin.action(description="Download Selected Invoices")
    def bulk_invoice_download(self, request, queryset):
        # Collects selected IDs into a string like "1,2,5"
        ids = ",".join([str(order.id) for order in queryset])
        return HttpResponseRedirect(f"/api/download-invoices/?orders={ids}")

    def invoice_download_button(self, obj):
        if obj.id:
            url = f"{reverse('download_invoices')}?orders={obj.id}"
            return format_html(
                '<a class="button" href="{}" target="_blank" '
                'style="background-color: #0f766e; color: white; padding: 10px 15px; '
                'font-weight: bold; border-radius: 4px; text-decoration: none;">'
                'Download PDF Invoice</a>', 
                url
            )
        return "Save order first"

    invoice_download_button.short_description = "Invoice Actions"

    # ==========================================
    # 🚚 BULK STATUS UPDATE ACTIONS
    # ==========================================
    @admin.action(description="Mark selected orders as Processed")
    def mark_as_processed(self, request, queryset):
        updated = queryset.update(status="processed")
        self.message_user(request, f"{updated} orders marked as Processed.")

    @admin.action(description="Mark selected orders as Confirmed")
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status="confirmed")
        self.message_user(request, f"{updated} orders marked as Confirmed.")

    @admin.action(description="Mark selected orders as Shipped")
    def mark_as_shipped(self, request, queryset):
        updated = queryset.update(status="shipped")
        self.message_user(request, f"{updated} orders marked as Shipped.")

    @admin.action(description="Mark selected orders as Delivered")
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status="delivered")
        self.message_user(request, f"{updated} orders marked as Delivered.")

    @admin.action(description="Mark selected orders as Cancelled")
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status="cancelled")
        self.message_user(request, f"{updated} orders marked as Cancelled.")


admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)

@admin.register(DeliveryConfiguration)
class DeliveryConfigurationAdmin(admin.ModelAdmin):
    list_display = ["__str__", "charge_upto_two", "charge_more_than_two"]
    
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False
