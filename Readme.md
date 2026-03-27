# Clario

Backend for a minimal video-sharing platform focused on discovery, privacy, and intentional design.

This repository is more than a set of routes and models — it's a conversation about how we build social products responsibly. The code here powers user registration, authentication, avatar/cover uploads (Cloudinary), and simple video references. Read on for quick setup, architecture notes, and a few design questions worth debating before scaling.

**Why this exists**: Modern content platforms optimize for growth; `Huntly` explores a different axis — clarity of ownership, lightweight primitives, and choices that make privacy and predictability easier to reason about.

---

**Quick Features**
- **User registration & login** with JWT access/refresh tokens.
- **Avatar & cover uploads** using Cloudinary, with support for deleting previous avatars by `public_id`.
- **Password hashing** with bcrypt and password-change flow.
- **Minimal data model**: user profiles, video references (IDs only), and watch history.

---

**Model / Workspace**

- Working model: https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj
- This is the workspace we are working in for this project.

---

**Files of interest**
- `src/controllers/user.controller.js` — user flows, token generation, avatar/cover endpoints.
- `src/models/user.model.js` — `User` schema, password hashing, token helpers.
- `src/utils/cloudinary.js` — upload helper (returns `public_id`), and helper to delete by `public_id`.

When updating avatars, the code stores Cloudinary's `public_id` on the `User` record so previous images can be deleted reliably.

---

**Architecture notes**

- Authentication: JWT access tokens (short-lived) + refresh tokens stored on the user document.
- Media: Cloudinary for storage; server removes local temp files after upload and deletes previous remote assets by `public_id`.
- DB: MongoDB + Mongoose for flexible schema and quick iteration.

---

Thought-provoking design questions
- Who owns the user's media? If we delete an avatar, do we also remove all metadata that referenced it? Should we keep an audit trail?
- Tokens vs sessions: JWTs are simple, but how do we handle revocation at scale without central state? Are refresh tokens in the DB enough?
- Privacy trade-offs: storing minimal profile data reduces attack surface — how does that affect personalization and discovery?
- Cost of permanence: when a user requests deletion, do we immediately delete remote assets, or mark them for background deletion to avoid race conditions and partial failures?

---

Contributing & next steps
- If you want this project to be production-ready, consider:
	- Adding rate limiting and brute-force protections on auth endpoints.
	- Background job processing for deletions (retry on failure) and thumbnail generation.
	- Tests for avatar/cover flows and token lifecycle.

- Open an issue or submit a PR. Small, focused changes welcome.

---

License
- This project is provided as-is for learning and experimentation. Add a license file if you plan to open-source it.

Thanks for reading — now ask a hard question about the UX or the data model and let's iterate.

