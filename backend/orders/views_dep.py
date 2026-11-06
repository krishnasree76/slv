import razorpay
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

from .models import Order, OrderItem
from products.models import ProductVariant
from django.template.loader import render_to_string
from django.http import HttpResponse
from decimal import Decimal, ROUND_HALF_UP

# Razorpay client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# ==========================================
# 1. CREATE ORDER FIRST
# ==========================================
@api_view(["POST"])
def create_order(request):
    data = request.data
    items = data.get("items", [])
    
    if not items:
        return Response({"error": "No items in the order."}, status=400)

    # ✅ Aggregate duplicate variants from the cart to prevent math bugs
    aggregated_items = {}
    for item in items:
        v_id = item.get("variant")
        qty = int(item.get("quantity", 1))
        if v_id:
            aggregated_items[v_id] = aggregated_items.get(v_id, 0) + qty

    try:
        with transaction.atomic():
            # Create Order as PENDING initially
            order = Order.objects.create(
                user=request.user if request.user.is_authenticated else None,
                customer_name=data.get("name", "Guest"),
                phone=data.get("phone"),
                address=data.get("address"),
                city=data.get("city"),
                state=data.get("state"),
                pincode=data.get("pincode"),
                payment_status="pending",
            )

            total = Decimal('0.00')
            
            # Sort keys to prevent database deadlocks
            for variant_id in sorted(aggregated_items.keys()):
                quantity = aggregated_items[variant_id]
                
                # Fetch variant
                variant = ProductVariant.objects.get(id=variant_id)

                # ✅ Let the OrderItem model handle stock checking and deduction!
                OrderItem.objects.create(
                    order=order,
                    variant=variant,
                    quantity=quantity
                )

                total += Decimal(str(variant.product.price)) * quantity

            order.total_amount = total
            
            # Now Create Razorpay Order
            amount_in_paise = int(total * 100)
            razorpay_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": 1
            })

            order.razorpay_order_id = razorpay_order["id"]
            order.save()

        return Response({
            "order_number": order.order_number,
            "razorpay_order_id": razorpay_order["id"],
            "amount": amount_in_paise,
            "key": settings.RAZORPAY_KEY_ID
        })

    except ValueError as e:
        # Expected error: Caught from your model's save() check
        return Response({"error": str(e)}, status=400)
    except ProductVariant.DoesNotExist:
        return Response({"error": "One or more products no longer exist."}, status=400)
    except Exception as e:
        print("🔥 CREATE ORDER FATAL ERROR:", str(e))
        return Response({"error": "An unexpected error occurred while creating your order."}, status=500)


# ==========================================
# 2. VERIFY PAYMENT (UPDATE DB TO PAID)
# ==========================================
@api_view(["POST"])
def verify_payment(request):
    data = request.data
    
    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
        
        order = Order.objects.get(razorpay_order_id=razorpay_order_id)
        order.payment_status = "paid"
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.save()

        return Response({
            "status": "success",
            "order_number": order.order_number
        })

    except Order.DoesNotExist:
        return Response({"status": "failed", "error": "Order not found in database"}, status=400)
    except Exception as e:
        print("🔥 VERIFY PAYMENT ERROR:", e)
        return Response({"status": "failed", "error": "Invalid Payment Signature"}, status=400)


# ==========================================
# 3. DOWNLOAD INVOICES (PDF)
# ==========================================
def download_invoices(request):
    try:
        from weasyprint import HTML
    except (ImportError, OSError):
        return HttpResponse("<h1>PDF Error</h1><p>GTK+ libraries missing.</p>", status=501)

    order_param = request.GET.get("orders", "")
    if "," in order_param:
        order_ids = order_param.split(",")
    else:
        order_ids = request.GET.getlist("orders")

    orders = Order.objects.filter(id__in=order_ids)

    if not orders.exists():
        return HttpResponse("No orders found.", status=404)

    processed_orders = []
    for order in orders:
        total = Decimal(str(order.total_amount))
        taxable_amount = (total / Decimal('1.05')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        total_gst = total - taxable_amount
        cgst = (total_gst / 2).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        sgst = (total_gst / 2).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        order.taxable_amount = taxable_amount
        order.cgst = cgst
        order.sgst = sgst
        processed_orders.append(order)

    html_string = render_to_string("invoices/invoice.html", {"orders": processed_orders})

    try:
        pdf = HTML(string=html_string).write_pdf()
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = "attachment; filename=invoices.pdf"
        return response
    except Exception as e:
        return HttpResponse(f"Error: {e}", status=500)


# ==========================================
# 4. USER ORDERS (API)
# ==========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    
    data = []
    for order in orders:
        data.append({
            "id": order.id,
            "order_number": order.order_number,
            "created_at": order.created_at,
            "status": order.status,  
            "payment_status": order.payment_status,
            "items": [
                {
                    "variant_name": str(item.variant),
                    "quantity": item.quantity
                } for item in order.items.all()
            ]
        })
        
    return Response(data)
