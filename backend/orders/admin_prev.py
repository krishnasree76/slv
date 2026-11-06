from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    # ✅ Columns in list view
    list_display = ["order_number", "customer_name","phone", "created_at", "payment_status", "status"]

    # ✅ THIS IS THE KEY LINE FOR INLINE EDITING
    list_editable = ["status"]

    # ✅ NEW: ADD FILTERS TO THE RIGHT SIDEBAR
    list_filter = ["payment_status", "status", "created_at"]
    
    # Optional: Add search functionality
    search_fields = ["order_number", "customer_name", "phone"]

    inlines = [OrderItemInline]

    # ✅ ADD THE NEW BULK ACTIONS HERE
    actions = [
        "bulk_invoice_download", 
        "mark_as_processed",
        "mark_as_confirmed", 
        "mark_as_shipped", 
        "mark_as_delivered", 
        "mark_as_cancelled"
    ]

    readonly_fields = ["invoice_download_button"]

    fields = [
        "customer_name", "user", "total_amount", "payment_status",
        "status",
        "invoice_download_button",
        "address", "city", "state", "pincode", "phone",
        "razorpay_order_id", "razorpay_payment_id", "razorpay_signature"
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
