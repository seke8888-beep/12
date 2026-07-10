from datetime import datetime, timedelta, timezone
from statistics import median
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt

app = FastAPI(title="Baǵa API", version="1.0.0", description="Агрегатор цен Казахстана")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

PRODUCTS = [
    {"id": 1, "name": "Logitech M185", "brand": "Logitech", "category": "Компьютерные мыши", "model": "M185", "barcode": "5099206027275", "image": "🖱️"},
    {"id": 2, "name": "Xiaomi Redmi Note 13", "brand": "Xiaomi", "category": "Смартфоны", "model": "Redmi Note 13", "barcode": "6941812757660", "image": "📱"},
    {"id": 3, "name": "Apple AirPods Pro 2", "brand": "Apple", "category": "Наушники", "model": "AirPods Pro 2", "barcode": "194253397472", "image": "🎧"},
]
OFFERS = [
    {"id": 1, "product_id": 1, "supplier": "Kaspi", "price": 7800, "currency": "KZT", "city": "Алматы", "url": "https://kaspi.kz", "updated_at": "сегодня, 10:34", "delivery": "Бесплатно"},
    {"id": 2, "product_id": 1, "supplier": "Sulpak", "price": 8190, "currency": "KZT", "city": "Алматы", "url": "https://sulpak.kz", "updated_at": "сегодня, 09:12", "delivery": "от 1 000 ₸"},
    {"id": 3, "product_id": 1, "supplier": "Белый Ветер", "price": 8500, "currency": "KZT", "city": "Астана", "url": "https://shop.kz", "updated_at": "вчера, 18:20", "delivery": "Бесплатно"},
    {"id": 4, "product_id": 1, "supplier": "Technodom", "price": 8600, "currency": "KZT", "city": "Алматы", "url": "https://technodom.kz", "updated_at": "сегодня, 08:55", "delivery": "Бесплатно"},
]

class LoginPayload(BaseModel):
    email: str
    password: str

class FavoritePayload(BaseModel):
    product_id: int

def product_stats(product_id: int):
    prices = [o["price"] for o in OFFERS if o["product_id"] == product_id]
    if not prices:
        raise HTTPException(404, "Предложения не найдены")
    return {"min": min(prices), "max": max(prices), "average": round(sum(prices) / len(prices)), "median": median(prices), "offers_count": len(prices)}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/products")
def products():
    return PRODUCTS

@app.get("/products/{product_id}")
def product(product_id: int):
    item = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not item:
        raise HTTPException(404, "Товар не найден")
    return {**item, "statistics": product_stats(product_id), "offers": [o for o in OFFERS if o["product_id"] == product_id]}

@app.get("/search")
def search(q: str = Query(..., min_length=1)):
    term = q.lower()
    fields = ("name", "brand", "model", "barcode")
    return [p for p in PRODUCTS if any(term in str(p[k]).lower() for k in fields)]

@app.get("/offers")
def offers(product_id: Optional[int] = None):
    return [o for o in OFFERS if product_id is None or o["product_id"] == product_id]

@app.get("/statistics/{product_id}")
def statistics(product_id: int):
    return product_stats(product_id)

@app.post("/auth/login")
def login(data: LoginPayload):
    if not data.email or not data.password:
        raise HTTPException(401, "Неверные данные")
    token = jwt.encode({"sub": data.email, "exp": datetime.now(timezone.utc) + timedelta(days=1)}, "change-me-in-production", algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

@app.post("/favorites")
def favorites(data: FavoritePayload):
    if not any(p["id"] == data.product_id for p in PRODUCTS):
        raise HTTPException(404, "Товар не найден")
    return {"message": "Товар добавлен в избранное", "product_id": data.product_id}
