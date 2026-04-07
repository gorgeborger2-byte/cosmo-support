import json
import os
from datetime import datetime, timezone

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout


BASE = "https://support.cosmotickets.com/status/status.php"
STATUS_PASSWORD = os.environ.get("STATUS_PASSWORD", "support")
OUT_FILE = os.path.join("public", "data", "status.json")

BRANDS = [
    {"id": "all", "name": "All Brands", "url": f"{BASE}?brand=all"},
    {"id": "AstroZoom", "name": "AstroZoom", "url": f"{BASE}?brand=AstroZoom"},
    {"id": "Athena", "name": "Athena", "url": f"{BASE}?brand=Athena"},
    {"id": "Atlas", "name": "Atlas", "url": f"{BASE}?brand=Atlas"},
    {"id": "Forge", "name": "Forge", "url": f"{BASE}?brand=Forge"},
    {"id": "Hero", "name": "Hero", "url": f"{BASE}?brand=Hero"},
    {"id": "Kane", "name": "Kane", "url": f"{BASE}?brand=Kane"},
    {"id": "Liquid", "name": "Liquid", "url": f"{BASE}?brand=Liquid"},
    {"id": "Pulse", "name": "Pulse", "url": f"{BASE}?brand=Pulse"},
    {"id": "Vex", "name": "Vex", "url": f"{BASE}?brand=Vex"},
    {"id": "Viper", "name": "Viper", "url": f"{BASE}?brand=Viper"},
    {"id": "Volt", "name": "Volt", "url": f"{BASE}?brand=Volt"},
]


def normalize_status(raw):
    value = (raw or "").strip().lower()
    if "updat" in value:
        return "Updating"
    if "test" in value:
        return "Testing"
    if "maintenance" in value:
        return "Maintenance"
    if "offline" in value or "down" in value or "unavail" in value:
        return "Offline"
    if "online" in value or "operational" in value or "working" in value:
        return "Online"
    return (raw or "Unknown").strip() or "Unknown"


def overall_status(products):
    if not products:
        return "Unknown"
    states = [p["status"].lower() for p in products]
    if any("updat" in s for s in states):
        return "Updating"
    if any("test" in s for s in states):
        return "Testing"
    if any("maintenance" in s for s in states):
        return "Maintenance"
    if any("offline" in s or "down" in s for s in states):
        return "Offline"
    if all("online" in s or "operational" in s for s in states):
        return "Online"
    return products[0]["status"]


def dedupe_products(products):
    seen = set()
    out = []
    for product in products:
        key = (product["name"].lower(), product["status"].lower())
        if key not in seen:
            seen.add(key)
            out.append(product)
    return out


def parse_products(html, brand_name):
    soup = BeautifulSoup(html, "html.parser")
    products = []

    for card in soup.select(".games-grid .game-card"):
        name_el = card.select_one(".game-name")
        status_el = card.select_one(".status-text")
        if not name_el or not status_el:
            continue
        name = name_el.get_text(" ", strip=True)
        status = status_el.get_text(" ", strip=True)
        if name and 1 < len(name) < 80:
            products.append({"name": name, "brand": brand_name, "status": normalize_status(status)})

    if not products:
        for tr in soup.select("tr"):
            tds = tr.find_all("td")
            if len(tds) < 2:
                continue
            name = tds[0].get_text(" ", strip=True)
            status = tds[1].get_text(" ", strip=True)
            if name and 1 < len(name) < 64 and "product" not in name.lower():
                products.append({"name": name, "brand": brand_name, "status": normalize_status(status)})

    return dedupe_products(products)


def is_login_page(html):
    return "Status Login" in html or 'name="password"' in html


def do_login(page):
    page.goto(BRANDS[0]["url"], wait_until="domcontentloaded", timeout=45000)
    if not is_login_page(page.content()):
        return True
    try:
        page.fill("input[name='password']", STATUS_PASSWORD, timeout=7000)
        page.click("button[type='submit']", timeout=7000)
        page.wait_for_timeout(1200)
        page.wait_for_load_state("domcontentloaded", timeout=20000)
    except PlaywrightTimeout:
        return False
    return not is_login_page(page.content())


def main():
    results = []
    all_brand_products = {}  # name -> brand mapping
    total_products = 0
    logged_in = False
    
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        logged_in = do_login(page)

        # First pass: collect products from individual brand pages to build proper All Brands
        brand_products = {}
        for brand in BRANDS[1:]:  # Skip "All Brands" first
            try:
                page.goto(brand["url"], wait_until="domcontentloaded", timeout=45000)
                html = page.content()
                if is_login_page(html):
                    logged_in = do_login(page)
                    page.goto(brand["url"], wait_until="domcontentloaded", timeout=45000)
                    html = page.content()
                
                if is_login_page(html):
                    results.append({"brand": brand["name"], "status": "Login Required", "products": []})
                    continue
                
                products = parse_products(html, brand["name"])
                brand_products[brand["name"]] = products
                total_products += len(products)
                
                # Store for All Brands
                for p in products:
                    all_brand_products[p["name"]] = brand["name"]
                
                results.append(
                    {"brand": brand["name"], "status": overall_status(products), "products": products}
                )
            except Exception as exc:
                results.append(
                    {"brand": brand["name"], "status": "Error", "products": [], "error": str(exc)}
                )

        # Build All Brands with correct brand attribution
        all_brands_products = []
        for name, actual_brand in all_brand_products.items():
            # Find this product's status from any brand that has it
            status = "Undetected"
            for bname, prods in brand_products.items():
                for p in prods:
                    if p["name"] == name:
                        status = p["status"]
                        break
                if status != "Undetected":
                    break
            all_brands_products.append({"name": name, "brand": actual_brand, "status": status})
        
        # Add All Brands at the beginning
        results.insert(0, {
            "brand": "All Brands",
            "status": overall_status(all_brands_products),
            "products": all_brands_products
        })

        browser.close()

    payload = {
        "success": True,
        "brands": results,
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "loggedIn": logged_in,
        "source": "github-actions",
    }

    if total_products == 0 and os.path.exists(OUT_FILE):
        print("No products scraped, keeping previous status.json")
        return

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")

    updating = 0
    testing = 0
    for brand in results:
        for product in brand.get("products", []):
            status = str(product.get("status", "")).lower()
            if "updat" in status:
                updating += 1
            elif "test" in status:
                testing += 1
    print(f"Updated status.json brands={len(results)} products={total_products} updating={updating} testing={testing}")


if __name__ == "__main__":
    main()
