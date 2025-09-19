# Test script to verify order creation using curl
# Replace TOKEN with an actual valid JWT token for a user

# First, get a token (you'll need to replace these values)
echo "Trying to get an authentication token..."
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' | 
  node -e "const data = JSON.parse(process.stdin.read()); console.log(data.token);")

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Please update the email and password in the script."
  exit 1
fi

echo "Got token: $TOKEN"

# Now use the token to create an order
echo "Creating test order..."
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "productId": "64a1b2c3d4e5f6789012345a",
        "quantity": 2
      }
    ],
    "deliveryType": "delivery",
    "deliveryAddress": {
      "street": "123 Test Street",
      "city": "Test City",
      "state": "Test State",
      "zipCode": "12345",
      "phoneNumber": "1234567890"
    },
    "deliverySlot": {
      "date": "2023-09-25T10:00:00.000Z",
      "timeSlot": "10:00 - 11:00"
    },
    "paymentMethod": "cod"
  }'