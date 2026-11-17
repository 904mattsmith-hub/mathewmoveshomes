# MyAgentFinder → BoomTown: setup and follow-up

> Lives in `_docs/`, which GitHub Pages (Jekyll) does not publish. Keep client names and phone numbers out of this repo.

## How it works

```
MyAgentFinder emails "New Buyer Referral Contact Info"  (referrals@myagentfinder.com → 904mattsmith@gmail.com)
   → Zapier: Gmail trigger
   → Code by Zapier: _docs/maf-to-boomtown.js parses the email
   → BoomTown: Create or Update Lead (category + full notes + follow-up plan)
   → BoomTown action plan for that category does the texts/emails/to-dos
```

Every MyAgentFinder (MAF) referral email has the same labeled lines (NAME, CALL NOW, EMAIL, ADDRESS or AREA, PRICE RANGE, TIMEFRAME, LOAN STATUS, BEST TIME TO REACH OUT, LEAD SOURCE, ADDITIONAL COMMENTS, VIEW REFERRAL). The parser reads those, fixes the phone to BoomTown's `###-###-####` format, and decides the follow-up track.

## Follow-up rules (built from the MAF answers)

| MAF answer | What the parser sets |
|---|---|
| Timeframe **0–3 months** | BoomTown category **hot**: daily touches days 1–3, then every 2 days to day 14 |
| Timeframe **3–6 months** | Category **qualify**: days 1, 2, 4, 7, 14, then weekly |
| Timeframe **6–12+ months** | Category **nurture**: days 1, 3, 7, 14, 30, then monthly |
| Loan: **Haven't applied** | Offer a lender intro on the first call |
| Loan: **In process** | Ask which lender and when the pre-approval letter is coming |
| Loan: **Pre-approved** | Ask for the letter, book showings this week |
| Channel **USDALoans.com / FHALoans.com / VA** | Notes the loan type. USDA: check the area is USDA-eligible before sending listings |
| Price range + area/ZIP | Note to set up an MLS auto-search with exactly those numbers |
| Always | Call and text within 1 hour. Update the MAF portal status every 2 days (MAF flags "Overdue") |

All of this is written into the lead's BoomTown **Notes**, so the plan is on the lead record.

## Zap setup (one time, about 15 minutes in zapier.com)

1. **Trigger:** Gmail → *New Email Matching Search*, account 904mattsmith@gmail.com
   Search: `from:referrals@myagentfinder.com subject:"Referral Contact Info"`
2. **Action:** Code by Zapier → *Run JavaScript*
   - Input data: `body` = Gmail **Body Plain**
   - Code: paste all of `_docs/maf-to-boomtown.js`
3. **Action:** BoomTown → *Create or Update Lead*
   | BoomTown field | Map to |
   |---|---|
   | Firstname / Lastname | `firstName` / `lastName` |
   | Emailaddress | `email` |
   | Day Phone | `phone` |
   | City / State / Zipcode | `city` / `state` / `zipCode` |
   | Source | **MyAgentFinder** (add it under BoomTown lead sources if it isn't in the list) |
   | Importtype | `Api Import` |
   | Buyer Assignment / Seller Assignment | `CurrentUser` |
   | Buyer Category | `buyerCategory` |
   | Avglistingprice | `avgListingPrice` |
   | Notes | `notes` |
   | Welcomeemail | **leave blank** (MAF already sends the intro email) |
4. *(Optional)* **Action:** Gmail → *Send Email* to Khristi with the same fields, so she can add the lead to her BoomTown (matches the current team process).
5. Turn the Zap on. Test it by re-sending the newest MAF email to yourself, or use Zapier's "Test trigger".

## In BoomTown (one time)

Make three action plans and have them auto-apply by **source = MyAgentFinder** and **category**:
- **MAF – Hot** (0–3 months)
- **MAF – Qualify** (3–6 months)
- **MAF – Nurture** (6+ months)

Use the texts below as the steps. Each plan should also include a recurring to-do: *"Update MyAgentFinder portal status"* every 2 days until the lead is a client.

## Message templates

Fill in `{first}`, `{area}`, `{price}` and `{loan}` from the lead record.

**First text (every track, within 1 hour)**
> Hi {first}, it's Mathew Smith, the Realtor® MyAgentFinder matched you with for your home search in {area}. I've got a few homes in the {price} range I can send over. Is now a good time for a quick call?

**Loan: haven't applied**
> Getting pre-approved is step one, and it's free. I work with a couple of local lenders who are fast and straight with you, including on {loan} loans. Want me to connect you?

(Drop the "{loan} loans" part when the channel didn't name a loan type.)

**Loan: in process**
> Who are you working with on the pre-approval? Once the letter comes through, we can start touring right away.

**Loan: pre-approved**
> Great that you're pre-approved! Can you send me the letter? Then let's line up showings this week. What days work?

**Hot, day 2 (no reply)**
> Hi {first}, just sent you 3 homes in {area} around {price}. Any you'd want to see this week?

**Nurture, day 30 and monthly**
> Hi {first}, quick {area} market update: here's what sold near your price range this month. Still thinking about a move in the next 6–12 months?

## Referral-fee note

MAF referrals carry a referral fee at closing (40% on recent referrals). Keep the MAF portal status current. MAF follows up with both you and the client until it's updated.
