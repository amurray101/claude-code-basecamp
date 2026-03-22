# Phase 3: Program Iteration

**Cohort 1 Feedback Review — Claude Code Basecamp**

---

## Diagnosis: What are the 2-3 most important problems this feedback reveals? What's signal vs. noise?

The feedback mentioned three core problems:

1. **Program needs to be longer** — give content more breathing room, and more hands-on time to make sure people feel adequately prepared for the job.
    - *"I felt there was too much content packed into the day. Less content at a more reasonable pace would allow for better learning and retention."*

2. **Break up based on role** — start with common tool foundations relevant across all roles, then move into role-specific content.
    - *"More splits between SA, Engineer, Research. Guidance as to what is more relevant for each group. More technical discovery / sales-focused sessions for SAs."*

3. **Make it interactive and specific** — hands-on sessions during self-guided work, hands-on labs during live trainings, working together with peers, presenting back to the group.
    - *"The Evals session spent too much time on abstract component taxonomy without enough concrete examples. The build-along afterward was far more effective for actually learning evals."*

### Signal

**The flat trend in "Self-rated confidence" is a negative signal.** Confidence held steady at ~4.28 across all three days. In a well-calibrated program, confidence should rise as learners gain comfort and mastery over the week. A flat line has two possible readings: content was calibrated appropriately to the group and maintained a productive challenge level each day (which matters, since student confidence is important for classroom engagement), or learners were moving through material too quickly for it to actually sink in and couldn't yet see their own gaps. The "Pacing" data tips toward the second reading — when a third of the room says "Too fast" but nobody's confidence drops, it raises the question of whether confidence is artificially high because participants haven't yet been asked to apply the material under realistic conditions.

**Too much content in too few days may be inflating both "Self-rated confidence" and "Apply independently" scores.** If participants are seeing concepts but not truly digesting them, they may rate their confidence and readiness to apply independently higher than their actual preparedness warrants. The compression of the program means the gap between exposure and genuine understanding hasn't had a chance to surface yet — it will only become visible when participants try to use these skills in the field.

### Noise

**NPS (35, n=17):** Only 17 of 54 surveys included NPS responses — a 31% response rate, which is too low to draw reliable conclusions from a cohort this size. Setting this aside entirely.

**"Apply independently" scores (4.2 → 4.5 → 4.3):** These are fairly high, which is a good sign on its face. However, it's easy to learn a concept and believe you understand implementation when the gulf between the two is actually quite wide. I'd be curious to know how this was assessed in the first round of Basecamp and whether high self-reported readiness translated to actual field performance. Without that baseline, these scores are encouraging but not conclusive.

---

## 2. Changes

**Extend the program from 3 days to 5 days.** The single highest-leverage change. Three days forces a choice between breadth and depth, and Cohort 1 feedback says we chose breadth at the expense of retention. A five-day structure allows each module to include both the conceptual introduction *and* the hands-on practice time participants are asking for, without rushing. Concretely: Days 1-3 cover shared technical foundations (install, CLAUDE.md/prompt craft, extensibility) with integrated labs after every live segment. Days 4-5 shift to role-specific application and a capstone. This means each day carries roughly 2-2.5 hours of content instead of cramming 4+ hours, leaving room for the repetition and application that drive retention.

**Introduce role-specific breakouts starting on Day 4, with role-tagged exercises throughout.** Rather than running fully parallel tracks (which fragments the cohort and doubles facilitator load), keep Days 1-3 shared but tag every exercise with role-specific framing. A Pre-Sales PE and a Post-Sales PE both write a CLAUDE.md on Day 2, but the Pre-Sales PE writes one for a prospect evaluation while the Post-Sales PE writes one for a customer's production codebase. Day 4 then diverges fully: SAs run adoption strategy scenarios, PEs run technical evaluation or implementation sessions, AR goes deep on custom tooling. This answers the "more splits" feedback without losing the cross-role learning that shared sessions provide.

**Restructure every live session around "I do, we do, you do" and cap lecture at 15 minutes.** The Evals feedback is a template for what to fix everywhere: abstract taxonomy followed by a build-along that actually worked. Flip the ratio. Every live segment opens with a short facilitator demo (I do), moves into a guided group exercise (we do), then releases into an independent lab (you do). The HTML interactive format that participants loved becomes the standard, not the exception. Build in a peer teaching moment in every module — participants present back a concept or demo to their table — both because it drives retention and because it's a skill they'll use daily in customer engagements.

**Eliminate setup friction before Day 1.** *"Ensure everyone has cloned and tested the GitHub repo before the first build-along — setup friction eats into the exercise time."* Send a pre-work checklist 48 hours before the program: install Claude Code, clone the training repo, run a verification script. Offer a 30-minute optional office hours slot the afternoon before Day 1 for anyone who hits issues. Zero lab time should be spent on environment setup.

**Add an async/solo track option for Days 1-3.** One respondent noted: *"For folks who learn more from async reading and quiet solo work, by the end of the program the value started to decline."* For the shared foundation days, offer a parallel self-paced path through the same material with optional drop-in office hours. This respects different learning styles without fragmenting the cohort on the days that matter most (Days 4-5 stay synchronous and role-specific).

---

## 3. Measurement

Success for Cohort 2 means three things: "Self-rated confidence" should *rise* across the week, "Pacing" complaints should drop, and "Session engagement avg" should be uniform across sessions.

**Primary metrics:**

- **Confidence trend:** Target a visible upward slope in daily "Self-rated confidence" (e.g., Day 1: ~3.8, Day 5: ~4.5), rather than the flat 4.28 from Cohort 1. A rising trend — especially one that starts slightly lower — indicates learners are being appropriately challenged early and building genuine mastery, not coasting on surface familiarity.
- **Pacing:** Reduce "Too fast" responses from 31% to under 15%. This is the direct measure of whether the 3→5 day expansion worked.
- **Session engagement avg floor:** Raise the lowest-scoring session from 3.9 to at least 4.2. If the "I do, we do, you do" restructure is working, no session should significantly lag the mean.

**Secondary metrics:**

- **"Realistic work simulation" score consistency:** Target 4.2+ every day with no Day 3-style dips. This measures whether role-specific framing is landing throughout the program, not just on explicitly customer-facing days.
- **NPS response rate:** Push from 31% to 60%+ by embedding NPS into the daily end-of-day survey rather than as a separate instrument. This makes Cohort 2's NPS actually interpretable.
- **Pacing × Self-rated confidence cross-tab (new):** Break "Self-rated confidence" scores by "Pacing" response. If the "Too fast" group's confidence is now measurably lower than the "Just right" group, it means the confidence metric is better calibrated — people who are struggling know it. If they converge again, confidence as a self-reported measure may need to be supplemented or replaced.

**Lagging indicator:**

- **30-day field readiness pulse (new):** Survey participants one month post-program: "Have you used a Basecamp skill in a customer engagement? Which one? What was missing?" This closes the loop between "Self-rated confidence" during training and actual field application — the gap that Cohort 1's data can't answer and that no amount of in-program measurement can resolve.
