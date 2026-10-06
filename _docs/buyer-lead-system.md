# Buyer Lead System — Playbook

> Lives in `_docs/` so GitHub Pages (Jekyll) does **not** publish it to the website.

## 1. How it works

```
Ad / social post / homepage  →  /buy/  (6-question quiz)  →  Web3Forms email to Mathew
                                                         →  Meta Pixel "Lead" + GA4 "buyer_lead"
                                                         →  Thank-you screen (/buy/?sent=1)
```

The quiz asks: buyer type → areas → price → timeline → financing + home to sell → contact.
Each lead arrives by email with a subject line you can triage from your lock screen:

`🔥 HOT Buyer Lead — Relocating to the area · $400k–$550k · 0–3 months · ALSO SELLING`

### Lead priority (in the email as `lead_priority`)

| Points | Signal |
|---|---|
| +3 / +2 / +1 | Timeline 0–3 mo / 3–6 mo / 6–12 mo |
| +2 / +2 / +1 | Pre-approved / Cash / VA loan |
| +1 | Checked the call/text consent box |

**HOT** = 5–6 · **WARM** = 3–4 · **NURTURE** = 0–2.
`ALSO SELLING` in the subject means it's a listing opportunity too — treat as HOT regardless.

## 2. Links to use in ads and posts

Each `path` swaps the headline and skips step 1. Add UTM tags so the email shows where the lead came from (`lead_source`).

| Audience | Link |
|---|---|
| Relocation | `https://mathewmoveshomes.com/buy/?path=relocate&utm_source=facebook&utm_medium=paid&utm_campaign=relocate` |
| Move-up / upgrade | `https://mathewmoveshomes.com/buy/?path=upgrade&utm_source=facebook&utm_medium=paid&utm_campaign=upgrade` |
| First-time buyer | `https://mathewmoveshomes.com/buy/?path=first&utm_source=facebook&utm_medium=paid&utm_campaign=first_time` |
| General / bio link | `https://mathewmoveshomes.com/buy/?utm_source=instagram&utm_medium=bio` |

Swap `utm_source` for `google`, `instagram`, `youtube`, `email`, `yard_sign`, `open_house` (QR code), etc.

### Ad compliance (important)
- Meta: run these under the **Housing special ad category**. That means no targeting by age, gender, or ZIP; minimum 15-mile radius. Use interest/lookalike-free broad audiences + the creative to self-select (e.g. "Moving to Jacksonville?").
- Fair Housing: describe homes and areas, never the people who live there. Don't advertise "good schools," "safe neighborhood," or "perfect for families."
- Keep license info (United Real Estate Gallery, #SL3377387) visible — it's in the page footer.

### Ad angle ideas
- **Relocate:** "Moving to Jacksonville? Get a free side-by-side of the Beaches, St. Johns & Duval — homes, prices, commutes." Video: 30-sec drive-through of an area.
- **PCS / military:** "PCSing to NAS Jax or Mayport? VA-loan homes + live video tours from a Military Relocation Professional."
- **Upgrade:** "Your home has gained equity. Find out what it buys you now — without paying two mortgages."
- **First-time:** "Paying $2,000+/mo in rent? See what that buys you in Jacksonville."
- Retarget everyone who hit `BuyerQuizStep` but never fired `Lead` (custom audience in Meta Events Manager).

## 3. Speed to lead — first 5 minutes

Leads contacted within 5 minutes convert dramatically better than at 1 hour. On every new email:

1. **Text immediately** (if consent box checked) using the template below.
2. **Call within 5 minutes**. If no answer, leave a 20-second voicemail and text "Just tried you."
3. Add to your CRM with the priority, path, and source.

### First text — by path
- **Relocate:** "Hi {name}, it's Mathew Smith with United Real Estate Gallery — got your relocation plan request. Moving from {moving_from}? I've got a few areas in mind for your budget. Got 10 min today or tomorrow for a quick call?"
- **Upgrade:** "Hi {name}, Mathew Smith here — got your upgrade plan request. First step is a quick look at what your current home is worth so we know what it buys you. What's the address?"
- **First-time:** "Hi {name}, Mathew Smith here — congrats on getting started! Quick question so I can send the right homes: have you talked with a lender yet? If not, I can connect you with a couple of good ones."
- **Other:** "Hi {name}, Mathew Smith with United Real Estate Gallery — got your request. What's the #1 thing your next place has to have?"

### Discovery call (10 min)
1. Why now? What happens if you don't move?
2. Must-haves vs. nice-to-haves (beds/baths, garage, pool, commute, lot).
3. Budget comfort level — monthly payment, not just price.
4. Pre-approval status → lender intro if needed.
5. Home to sell? → book a listing consult / valuation.
6. Set the next step on the calendar (search setup, video tour, or showings), and review the written buyer agreement before touring.

## 4. Follow-up cadence

| Day | HOT / WARM | NURTURE |
|---|---|---|
| 0 | Text + call + email plan | Text + email plan |
| 1 | Call #2, text with 3 matching listings | — |
| 3 | Call #3 / video message | Text: 3 listings |
| 7 | Email: area comparison or payment breakdown | Email: area / buying guide |
| 14 | Call + new listings | Text check-in |
| 30 | Check-in call | Email: market update |
| Monthly | Set up MLS auto search; market update email | Monthly market update + new listings |

Rule of thumb: keep going until they buy, tell you to stop, or say they bought with someone else. Most buyer leads buy 3–12 months out — nurture is where the money is.

## 5. Measuring it

- **GA4:** events `buyer_quiz_step` (step 1–6 funnel drop-off), `buyer_lead` (with `buyer_type`, `lead_priority`, `price_range`, `timeline`), plus the existing `generate_lead` and `contact` events. Mark `buyer_lead` as a key event.
- **Meta:** `Lead` (with `content_category` = buyer type), `BuyerQuizStep`, `BuyerAlsoSelling`. Optimize campaigns for `Lead`.
- Monthly: leads by source → contacted within 5 min % → appointments → under contract. Cut the sources that don't produce appointments.
