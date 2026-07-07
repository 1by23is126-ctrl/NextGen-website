"""
NextGen Interiors backend test suite.
Covers: health, stats, projects, blog, leads, auth, admin lead CRUD, admin blog CRUD.
"""
import os
import uuid
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") \
    else os.environ.get("PUBLIC_BACKEND_URL", "https://premium-design-87.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@nextgeninteriors.in"
ADMIN_PASSWORD = "NextGen@2025"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


# ---------- Health & Stats ----------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "NextGen" in data.get("name", "")

    def test_stats(self, session):
        r = session.get(f"{API}/stats")
        assert r.status_code == 200
        data = r.json()
        for k in ["projects_completed", "years_experience", "cities", "happy_clients"]:
            assert k in data
            assert isinstance(data[k], int)


# ---------- Projects ----------
class TestProjects:
    def test_list_projects(self, session):
        r = session.get(f"{API}/projects")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6
        # slug uniqueness
        slugs = [p["slug"] for p in data]
        assert len(slugs) == len(set(slugs))

    def test_featured_filter(self, session):
        r = session.get(f"{API}/projects", params={"featured": "true"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for p in data:
            assert p["featured"] is True

    def test_category_filter(self, session):
        r = session.get(f"{API}/projects", params={"category": "villa"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for p in data:
            assert p["category"] == "villa"

    def test_project_detail(self, session):
        r = session.get(f"{API}/projects/obsidian-villa-bengaluru")
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "obsidian-villa-bengaluru"
        assert data["category"] == "villa"
        assert isinstance(data["materials"], list)
        assert isinstance(data["timeline_phases"], list)

    def test_project_not_found(self, session):
        r = session.get(f"{API}/projects/nonexistent-xyz")
        assert r.status_code == 404


# ---------- Blog ----------
class TestBlog:
    def test_list_blog(self, session):
        r = session.get(f"{API}/blog")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 5

    def test_blog_detail(self, session):
        r = session.get(f"{API}/blog/quiet-luxury-of-restraint")
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "quiet-luxury-of-restraint"
        assert data["published"] is True
        assert len(data["content"]) > 50

    def test_blog_category_filter(self, session):
        r = session.get(f"{API}/blog", params={"category": "Practice"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for b in data:
            assert b["category"] == "Practice"

    def test_blog_not_found(self, session):
        r = session.get(f"{API}/blog/no-such-slug")
        assert r.status_code == 404


# ---------- Leads (public create + auth required to read/modify) ----------
class TestLeadsPublic:
    def test_create_lead_full_payload(self, session):
        payload = {
            "name": "TEST_LeadPersist",
            "email": f"TEST_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+919999999999",
            "project_type": "Residence",
            "budget": "₹50–80L",
            "timeline": "3-6 months",
            "location": "Bengaluru",
            "message": "Looking for a turnkey villa design.",
            "source": "contact",
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and len(data["id"]) > 0
        assert data["status"] == "new"
        assert data["email"] == payload["email"]
        assert data["project_type"] == "Residence"
        # remember for later
        pytest.lead_id_for_admin = data["id"]
        pytest.lead_email_for_admin = payload["email"]

    def test_list_leads_unauthenticated(self, session):
        # remove any session cookies first
        s = requests.Session()
        r = s.get(f"{API}/leads")
        assert r.status_code == 401

    def test_patch_lead_unauthenticated(self, session):
        s = requests.Session()
        r = s.patch(f"{API}/leads/anything", json={"status": "contacted"})
        assert r.status_code == 401


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str)
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"

    def test_login_wrong_password(self, session):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WRONG"})
        assert r.status_code == 401

    def test_me_with_bearer(self, session, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_no_token(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_logout(self, auth_headers):
        r = requests.post(f"{API}/auth/logout", headers=auth_headers)
        assert r.status_code == 200
        assert r.json().get("success") is True


# ---------- Admin Lead CRUD (self-contained, parallel-safe) ----------
@pytest.fixture(scope="class")
def seeded_lead():
    email = f"TEST_admincrud_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "name": "TEST_AdminCrudLead",
        "email": email,
        "phone": "+910000000000",
        "project_type": "Apartment",
        "source": "contact",
    }
    r = requests.post(f"{API}/leads", json=payload)
    assert r.status_code == 200
    return r.json()


class TestAdminLeads:
    def test_list_leads_authenticated(self, auth_headers, seeded_lead):
        r = requests.get(f"{API}/leads", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        emails = [d["email"] for d in data]
        assert seeded_lead["email"] in emails

    def test_patch_status_valid(self, auth_headers, seeded_lead):
        lead_id = seeded_lead["id"]
        r = requests.patch(f"{API}/leads/{lead_id}", headers=auth_headers, json={"status": "contacted"})
        assert r.status_code == 200
        r2 = requests.get(f"{API}/leads", headers=auth_headers)
        match = next((l for l in r2.json() if l["id"] == lead_id), None)
        assert match and match["status"] == "contacted"

    def test_patch_status_invalid(self, auth_headers, seeded_lead):
        lead_id = seeded_lead["id"]
        r = requests.patch(f"{API}/leads/{lead_id}", headers=auth_headers, json={"status": "bogus"})
        assert r.status_code == 400

    def test_delete_lead(self, auth_headers, seeded_lead):
        lead_id = seeded_lead["id"]
        r = requests.delete(f"{API}/leads/{lead_id}", headers=auth_headers)
        assert r.status_code == 200
        r2 = requests.get(f"{API}/leads", headers=auth_headers)
        assert all(l["id"] != lead_id for l in r2.json())


# ---------- Admin Blog CRUD ----------
class TestAdminBlog:
    created_id = None
    slug = f"test-article-{uuid.uuid4().hex[:8]}"

    def test_create_blog(self, auth_headers):
        payload = {
            "title": "TEST_Article",
            "slug": self.slug,
            "excerpt": "A test article.",
            "cover_image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600",
            "content": "Content body for the test article.",
            "category": "Test",
            "read_time": 3,
            "author": "Tester",
            "published": True,
        }
        r = requests.post(f"{API}/blog", headers=auth_headers, json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["slug"] == self.slug
        TestAdminBlog.created_id = data["id"]
        # GET to verify persistence
        r2 = requests.get(f"{API}/blog/{self.slug}")
        assert r2.status_code == 200

    def test_create_duplicate_slug(self, auth_headers):
        payload = {
            "title": "Dup",
            "slug": self.slug,
            "excerpt": "dup",
            "cover_image": "https://x.com/x.jpg",
            "content": "dup",
            "category": "Test",
        }
        r = requests.post(f"{API}/blog", headers=auth_headers, json=payload)
        assert r.status_code == 400

    def test_update_blog(self, auth_headers):
        post_id = TestAdminBlog.created_id
        payload = {
            "title": "TEST_Article_Updated",
            "slug": self.slug,
            "excerpt": "Updated.",
            "cover_image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600",
            "content": "Updated content.",
            "category": "Test",
            "read_time": 4,
            "author": "Tester",
            "published": True,
        }
        r = requests.put(f"{API}/blog/{post_id}", headers=auth_headers, json=payload)
        assert r.status_code == 200, r.text
        assert r.json()["title"] == "TEST_Article_Updated"
        # verify via GET
        r2 = requests.get(f"{API}/blog/{self.slug}")
        assert r2.json()["title"] == "TEST_Article_Updated"

    def test_delete_blog(self, auth_headers):
        post_id = TestAdminBlog.created_id
        r = requests.delete(f"{API}/blog/{post_id}", headers=auth_headers)
        assert r.status_code == 200
        r2 = requests.get(f"{API}/blog/{self.slug}")
        assert r2.status_code == 404
