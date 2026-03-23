from django.http import JsonResponse, HttpResponse
from .models import Order
import json
from django.views.decorators.csrf import csrf_exempt

# -------------------------
# Home view for root URL
# -------------------------
def home(request):
    return HttpResponse("Welcome to My E-commerce Site!")

# -------------------------
# Existing create_order view
# -------------------------
@csrf_exempt
def create_order(request):
    if request.method == "POST":
        try:
            print("🔥 Request received")

            data = json.loads(request.body)
            print("📦 Data:", data)

            name = data.get("name")
            email = data.get("email")
            address = data.get("address")
            order_id = data.get("order_id")
            items = data.get("items", [])

            # ✅ LOOP THROUGH EACH PRODUCT
            for item in items:
                Order.objects.create(
                    name=name,
                    email=email,
                    address=address,
                    order_id=order_id,  # ✅ NEW
                    product_name=item.get("product_name"),
                    quantity=item.get("quantity"),
                    price=item.get("price")
                )

            print("✅ Order saved successfully")

            return JsonResponse({
                "message": "Order created successfully"
            })

        except Exception as e:
            print("❌ ERROR:", e)
            return JsonResponse({
                "error": str(e)
            })

    return JsonResponse({
        "error": "Only POST method allowed"
    })