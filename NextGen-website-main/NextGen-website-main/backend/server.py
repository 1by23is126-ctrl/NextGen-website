from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import bcrypt
import jwt
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr, BeforeValidator
from bson import ObjectId


# ---------- DB ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---------- Auth helpers ----------
JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("password_hash", None)
        user.pop("_id", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Models ----------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    project_type: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "contact"  # contact | consultation


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    project_type: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "contact"
    status: str = "new"  # new | contacted | qualified | closed
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    cover_image: str
    content: str
    category: str
    read_time: Optional[int] = 5
    author: Optional[str] = "NextGen Studio"
    published: bool = True


class BlogPost(BlogPostCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    category: str  # residential | commercial | kitchen | bedroom | office | villa | apartment
    location: str
    year: int
    area: str
    duration: str
    cover_image: str
    gallery: List[str] = []
    overview: str
    challenge: str
    concept: str
    materials: List[str] = []
    timeline_phases: List[dict] = []
    testimonial_quote: Optional[str] = None
    testimonial_author: Optional[str] = None
    featured: bool = False


# ---------- App ----------
app = FastAPI(title="NextGen Interiors API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"name": "NextGen Interiors API", "version": "1.0.0"}


# ---------- Auth ----------
@api_router.post("/auth/login")
async def login(data: LoginInput, response: Response):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=False,
        samesite="lax", max_age=8 * 3600, path="/",
    )
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")},
    }


@api_router.post("/auth/logout")
async def logout(response: Response, user: dict = Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    return {"success": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- Leads ----------
@api_router.post("/leads", response_model=Lead)
async def create_lead(data: LeadCreate):
    lead = Lead(**data.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(user: dict = Depends(get_current_user)):
    cursor = db.leads.find({}, {"_id": 0}).sort("created_at", -1)
    return [Lead(**doc) async for doc in cursor]


@api_router.patch("/leads/{lead_id}")
async def update_lead_status(lead_id: str, payload: dict, user: dict = Depends(get_current_user)):
    status = payload.get("status")
    if status not in {"new", "contacted", "qualified", "closed"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.leads.update_one({"id": lead_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True}


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, user: dict = Depends(get_current_user)):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True}


# ---------- Blog ----------
@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog(category: Optional[str] = None):
    query = {"published": True}
    if category and category != "all":
        query["category"] = category
    cursor = db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1)
    return [BlogPost(**doc) async for doc in cursor]


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog(slug: str):
    doc = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    return BlogPost(**doc)


@api_router.post("/blog", response_model=BlogPost)
async def create_blog(data: BlogPostCreate, user: dict = Depends(get_current_user)):
    existing = await db.blog_posts.find_one({"slug": data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    post = BlogPost(**data.model_dump())
    await db.blog_posts.insert_one(post.model_dump())
    return post


@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog(post_id: str, data: BlogPostCreate, user: dict = Depends(get_current_user)):
    doc = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    update = data.model_dump()
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.blog_posts.update_one({"id": post_id}, {"$set": update})
    doc.update(update)
    return BlogPost(**doc)


@api_router.delete("/blog/{post_id}")
async def delete_blog(post_id: str, user: dict = Depends(get_current_user)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"success": True}


# ---------- Projects ----------
@api_router.get("/projects", response_model=List[Project])
async def list_projects(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    cursor = db.projects.find(query, {"_id": 0}).sort("year", -1)
    return [Project(**doc) async for doc in cursor]


@api_router.get("/projects/{slug}", response_model=Project)
async def get_project(slug: str):
    doc = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**doc)


@api_router.get("/stats")
async def stats():
    return {
        "projects_completed": 240,
        "years_experience": 12,
        "cities": 14,
        "happy_clients": 320,
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Seeders ----------
async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@nextgeninteriors.in").lower()
    password = os.environ.get("ADMIN_PASSWORD", "NextGen@2025")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "NextGen Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin: {email}")
    elif not verify_password(password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": hash_password(password)}},
        )
        logger.info(f"Updated admin password: {email}")


SEED_PROJECTS = [
    {
        "slug": "obsidian-villa-bengaluru",
        "title": "Obsidian — A Villa Reimagined",
        "category": "villa",
        "location": "Bengaluru, Karnataka",
        "year": 2024,
        "area": "6,200 sq ft",
        "duration": "11 months",
        "cover_image": "https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg",
        "gallery": [
            "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
            "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600",
        ],
        "overview": "A four-bedroom villa in the leafy precincts of Sadashivanagar, reworked into a quiet meditation on stone, oak and warm lamplight.",
        "challenge": "The owners — a young family returned from Singapore — wanted a home that felt rooted in Indian craft yet read as effortlessly modern. The existing structure was compartmentalised, dark and disconnected from its garden.",
        "concept": "We dissolved the ground floor into a single flowing volume, anchored by a 14-foot travertine island and a custom oak library wall. Daylight became the protagonist.",
        "materials": ["Italian travertine", "European oak", "Hand-loomed linen", "Patinated brass", "Kota stone flooring"],
        "timeline_phases": [
            {"phase": "Discovery & Concept", "duration": "4 weeks"},
            {"phase": "Design Development", "duration": "10 weeks"},
            {"phase": "Procurement", "duration": "12 weeks"},
            {"phase": "Execution", "duration": "20 weeks"},
            {"phase": "Styling & Handover", "duration": "2 weeks"},
        ],
        "testimonial_quote": "They listened more than they spoke. The result is a home that feels like us — only more composed.",
        "testimonial_author": "Aarav & Ishita Menon, Homeowners",
        "featured": True,
    },
    {
        "slug": "linden-apartment-mumbai",
        "title": "Linden — A Sea-Facing Apartment",
        "category": "apartment",
        "location": "Worli, Mumbai",
        "year": 2024,
        "area": "3,400 sq ft",
        "duration": "7 months",
        "cover_image": "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
        "gallery": [
            "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
            "https://images.unsplash.com/photo-1618219944342-824e40a13285?w=1600",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600",
        ],
        "overview": "A 22nd-floor apartment overlooking the Arabian Sea, designed as a series of quiet rooms that frame the horizon.",
        "challenge": "Maximise the sea view without making the interior feel like a hotel suite. Layer warmth into a glass-heavy envelope.",
        "concept": "A muted palette of stone, ivory and walnut. Custom millwork that recedes. One sculptural moment per room.",
        "materials": ["Statuario marble", "American walnut", "Brushed bronze", "Raw silk drapery"],
        "timeline_phases": [
            {"phase": "Discovery", "duration": "3 weeks"},
            {"phase": "Design", "duration": "8 weeks"},
            {"phase": "Execution", "duration": "16 weeks"},
            {"phase": "Handover", "duration": "1 week"},
        ],
        "testimonial_quote": "Every evening the apartment seems to exhale. That is the design.",
        "testimonial_author": "Karan Shroff, Homeowner",
        "featured": True,
    },
    {
        "slug": "atelier-office-pune",
        "title": "Atelier — A Studio for a Design Firm",
        "category": "office",
        "location": "Koregaon Park, Pune",
        "year": 2023,
        "area": "4,800 sq ft",
        "duration": "5 months",
        "cover_image": "https://images.pexels.com/photos/13219418/pexels-photo-13219418.jpeg",
        "gallery": [
            "https://images.pexels.com/photos/36631701/pexels-photo-36631701.jpeg",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600",
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600",
        ],
        "overview": "The headquarters of a boutique architecture practice, conceived as a working museum of materials.",
        "challenge": "Create a workspace that doubles as a portfolio — every wall, joint and finish on display for visiting clients.",
        "concept": "A linear plan with a central oak table around which the studio gathers. Material samples integrated into the architecture itself.",
        "materials": ["Microcement floors", "Reclaimed teak", "Blackened steel", "Lime plaster walls"],
        "timeline_phases": [
            {"phase": "Brief & Concept", "duration": "2 weeks"},
            {"phase": "Design", "duration": "6 weeks"},
            {"phase": "Build", "duration": "12 weeks"},
        ],
        "testimonial_quote": "Our team writes better proposals here. That is not a metaphor.",
        "testimonial_author": "Studio Principal, Confidential",
        "featured": True,
    },
    {
        "slug": "ivory-kitchen-delhi",
        "title": "Ivory — A Modular Kitchen",
        "category": "kitchen",
        "location": "Vasant Vihar, New Delhi",
        "year": 2024,
        "area": "320 sq ft",
        "duration": "9 weeks",
        "cover_image": "https://images.pexels.com/photos/7515855/pexels-photo-7515855.png",
        "gallery": [
            "https://images.pexels.com/photos/7148841/pexels-photo-7148841.jpeg",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600",
        ],
        "overview": "A galley kitchen rebuilt as the social centre of a 4BHK apartment.",
        "challenge": "Conceal a working kitchen behind cabinetry that reads as furniture.",
        "concept": "Handle-less ivory lacquer above, fluted oak below, a marble apron sink as the only flourish.",
        "materials": ["Ivory lacquer", "Fluted oak", "Calacatta marble", "Brushed nickel hardware"],
        "timeline_phases": [
            {"phase": "Design", "duration": "3 weeks"},
            {"phase": "Manufacture", "duration": "4 weeks"},
            {"phase": "Install", "duration": "2 weeks"},
        ],
        "testimonial_quote": "I cook more. That is the highest compliment I can give.",
        "testimonial_author": "Meera Kapoor, Homeowner",
        "featured": False,
    },
    {
        "slug": "noir-bedroom-hyderabad",
        "title": "Noir — A Master Bedroom",
        "category": "bedroom",
        "location": "Jubilee Hills, Hyderabad",
        "year": 2024,
        "area": "440 sq ft",
        "duration": "6 weeks",
        "cover_image": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600",
        "gallery": [
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600",
            "https://images.unsplash.com/photo-1616627452185-bce1b0a02de6?w=1600",
        ],
        "overview": "A bedroom suite that puts sleep at the centre of a busy life.",
        "challenge": "Create a sanctuary without resorting to hotel cliches.",
        "concept": "A single floating headboard wall in plastered walnut, soft wool underfoot, a reading nook with afternoon light.",
        "materials": ["Walnut veneer", "Wool sisal rug", "Linen drapery", "Alabaster sconces"],
        "timeline_phases": [
            {"phase": "Design", "duration": "2 weeks"},
            {"phase": "Build", "duration": "4 weeks"},
        ],
        "testimonial_quote": "I sleep differently here.",
        "testimonial_author": "Resident, Homeowner",
        "featured": False,
    },
    {
        "slug": "terra-restaurant-goa",
        "title": "Terra — A Coastal Restaurant",
        "category": "commercial",
        "location": "Assagao, Goa",
        "year": 2023,
        "area": "2,100 sq ft",
        "duration": "4 months",
        "cover_image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600",
        "gallery": [
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600",
            "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1600",
        ],
        "overview": "A 60-cover restaurant in a restored Portuguese house, rebuilt as a warm-weather dining room.",
        "challenge": "Honour the heritage of the building while creating a contemporary hospitality experience.",
        "concept": "Lime-washed walls, terracotta floors, a long communal table beneath restored timber beams.",
        "materials": ["Lime-wash plaster", "Terracotta tiles", "Reclaimed teak", "Cane and rattan"],
        "timeline_phases": [
            {"phase": "Heritage Survey", "duration": "3 weeks"},
            {"phase": "Design", "duration": "5 weeks"},
            {"phase": "Restoration & Build", "duration": "10 weeks"},
        ],
        "testimonial_quote": "The room does half the hospitality for us.",
        "testimonial_author": "Founders, Terra Goa",
        "featured": True,
    },
]


SEED_BLOG = [
    {
        "title": "The Quiet Luxury of Restraint",
        "slug": "quiet-luxury-of-restraint",
        "excerpt": "Why the most expensive homes we design are often the ones with the fewest objects in them.",
        "cover_image": "https://images.pexels.com/photos/13201479/pexels-photo-13201479.jpeg",
        "content": "There is a particular silence we try to design into every project — the silence of a room that has had everything unnecessary taken out of it. It is the hardest brief in interior architecture, because subtraction has no upper bound. You can keep removing forever.\n\nIn our studio we have a phrase: *one moment per room*. A single sculptural object, a single material gesture, a single piece of millwork that deserves a full pause. Everything else is the supporting cast.\n\nThis is not minimalism. Minimalism is an aesthetic. Restraint is an editorial discipline — the same discipline that separates a great magazine spread from a busy one.\n\nThe homes we love most, years after handover, are not the ones where we added the most. They are the ones where we knew when to stop.",
        "category": "Philosophy",
        "read_time": 4,
        "author": "NextGen Studio",
        "published": True,
    },
    {
        "title": "Material Diaries — Travertine, Now",
        "slug": "material-diaries-travertine",
        "excerpt": "A field guide to specifying the most over-used stone of the decade without making it look that way.",
        "cover_image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600",
        "content": "Travertine is having a moment, and like most moments, it will end. The question for any studio that specifies it now is: can we use it in a way that will still feel correct in ten years?\n\nWe think the answer lies in three quiet rules.\n\n**Rule one — choose the right cut.** Vein-cut travertine reads contemporary and disciplined. Cross-cut reads like a 1970s hotel lobby. There is a place for both, but they are not interchangeable.\n\n**Rule two — let it touch warm materials.** Travertine against a cold metal can look clinical. Travertine against oak, against linen, against patinated brass — it becomes architecture.\n\n**Rule three — finish matters.** A honed finish is almost always the answer. Polished travertine is a finish from another era.",
        "category": "Materials",
        "read_time": 6,
        "author": "NextGen Studio",
        "published": True,
    },
    {
        "title": "A Letter to a Future Client",
        "slug": "letter-to-a-future-client",
        "excerpt": "Notes from twelve years of designing homes, written for someone who has not yet found us.",
        "cover_image": "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg",
        "content": "Dear Future Client,\n\nYou will spend more time thinking about your home over the next year than you have in any year previous. This is normal. A home, for most people, is the single largest design project of a lifetime.\n\nBefore we meet, three things.\n\n**One — bring us moods, not images.** We do not want a folder of Pinterest pins. We want a description of how you want to feel on a Tuesday evening. The image library is our job.\n\n**Two — tell us your dealbreakers early.** Every project has them. A child with sensory needs. An aging parent moving in. A cat that climbs everything. These are not edge cases; they are the brief.\n\n**Three — trust the discomfort.** The middle of a renovation is the worst part of a renovation. We will get you to the other side.",
        "category": "Practice",
        "read_time": 5,
        "author": "Founder, NextGen Studio",
        "published": True,
    },
    {
        "title": "On Light, Mostly",
        "slug": "on-light-mostly",
        "excerpt": "Why we now design lighting before we design anything else — and what that has changed.",
        "cover_image": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600",
        "content": "Five years ago we designed light at the end of a project, after the millwork and the upholstery and the art. Now we design it first.\n\nThe shift came from realising that almost every emotion in an interior — calm, intimacy, focus, joy — is a function of light. Not of furniture, not of finish. Of light.\n\nWe now write a lighting brief before we draw a plan. How does this room behave at 7am? At 4pm? At 10pm? What does the ceiling look like when the sun goes? What is the room's relationship to its own shadow?\n\nThe answers reshape everything that follows.",
        "category": "Craft",
        "read_time": 4,
        "author": "Lead Designer, NextGen Studio",
        "published": True,
    },
    {
        "title": "Renovating an Older Home, Slowly",
        "slug": "renovating-older-home-slowly",
        "excerpt": "A case for the long renovation — twelve to eighteen months — and what it gives you back.",
        "cover_image": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600",
        "content": "Most renovation timelines are written by impatience. Six months. Four months. Sometimes ninety days.\n\nWe have done those projects and we have done their opposite. The opposite — a renovation that takes a year, sometimes longer — is almost always the better building.\n\nTime lets you change your mind. Time lets a wall be plastered three times until it is right. Time lets a piece of stone be replaced when it arrives wrong. Time lets you live in a room before it is finished and notice the things drawings cannot show.\n\nThe fast renovation is a financial product. The slow renovation is a home.",
        "category": "Practice",
        "read_time": 5,
        "author": "NextGen Studio",
        "published": True,
    },
]


async def seed_data():
    for p in SEED_PROJECTS:
        existing = await db.projects.find_one({"slug": p["slug"]})
        if not existing:
            project = Project(**p)
            await db.projects.insert_one(project.model_dump())
    for b in SEED_BLOG:
        existing = await db.blog_posts.find_one({"slug": b["slug"]})
        if not existing:
            post = BlogPost(**b)
            await db.blog_posts.insert_one(post.model_dump())


@app.on_event("startup")
async def on_startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.projects.create_index("slug", unique=True)
        await db.blog_posts.create_index("slug", unique=True)
        await db.leads.create_index("created_at")
    except Exception as e:
        logger.warning(f"Index creation: {e}")
    await seed_admin()
    await seed_data()
    logger.info("Startup complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
