from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_search_by_brand():
    response = client.get('/search?q=logitech')
    assert response.status_code == 200
    assert response.json()[0]['name'] == 'Logitech M185'

def test_statistics():
    response = client.get('/statistics/1')
    assert response.status_code == 200
    assert response.json()['min'] == 7800
