# Graph Report - lmstax  (2026-05-04)

## Corpus Check
- 97 files · ~56,699 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 234 nodes · 191 edges · 9 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5014cb96`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]

## God Nodes (most connected - your core abstractions)
1. `getSupabaseAdmin()` - 11 edges
2. `confirm()` - 6 edges
3. `saveQuizLibrary()` - 5 edges
4. `getTeacherCourseStats()` - 4 edges
5. `updateProgress()` - 4 edges
6. `getUserProfile()` - 4 edges
7. `handleSave()` - 4 edges
8. `saveModuleLibrary()` - 4 edges
9. `getCookieOptions()` - 4 edges
10. `getModuleLibrary()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `handleDelete()` --calls--> `confirm()`  [INFERRED]
  src/app/admin/courses/page.tsx → src/app/payment/callback/page.tsx
- `handleDelete()` --calls--> `confirm()`  [INFERRED]
  src/app/admin/modules/page.tsx → src/app/payment/callback/page.tsx
- `handleDelete()` --calls--> `confirm()`  [INFERRED]
  src/app/admin/quizzes/page.tsx → src/app/payment/callback/page.tsx
- `POST()` --calls--> `getSupabaseAdmin()`  [INFERRED]
  src/app/api/payment/webhook/route.ts → src/lib/supabase.ts
- `middleware()` --calls--> `getCookieOptions()`  [INFERRED]
  src/middleware.ts → src/lib/supabase.ts

## Communities (79 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (11): addOption(), addQuestion(), deleteQuestion(), handleSave(), removeOption(), updateOption(), updateQuestion(), getQuizLibrary() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (10): getTeacherCourseStats(), updateProgress(), getUserProfile(), fetchUserData(), async(), handleNext(), markAsComplete(), getSupabaseAdmin() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (6): confirm(), handleDelete(), fetchStudents(), handleRoleChange(), fetchTeachers(), handleRoleChange()

### Community 3 - "Community 3"
Cohesion: 0.31
Nodes (4): getModuleLibrary(), handleDelete(), handleDuplicate(), saveModuleLibrary()

### Community 6 - "Community 6"
Cohesion: 0.53
Nodes (4): createSilentProxy(), getCookieOptions(), getSupabase(), middleware()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `confirm()` connect `Community 2` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `handleDelete()` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getSupabaseAdmin()` (e.g. with `getTeacherCourseStats()` and `updateProgress()`) actually correct?**
  _`getSupabaseAdmin()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `confirm()` (e.g. with `handleDelete()` and `handleDelete()`) actually correct?**
  _`confirm()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getTeacherCourseStats()` (e.g. with `getSupabaseAdmin()` and `fetchUserData()`) actually correct?**
  _`getTeacherCourseStats()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `updateProgress()` (e.g. with `getSupabaseAdmin()` and `markAsComplete()`) actually correct?**
  _`updateProgress()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._